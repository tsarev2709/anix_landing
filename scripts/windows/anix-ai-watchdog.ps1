param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
    [string]$RuntimeRoot = 'C:\Anix'
)

$ErrorActionPreference = "Stop"

$runtimeGatewayRoot = Join-Path $RuntimeRoot 'local-ai-gateway'
$projectGatewayRoot = Join-Path $ProjectRoot 'local-ai-gateway'
$gatewayRoot = if (Test-Path -LiteralPath $runtimeGatewayRoot) {
    $runtimeGatewayRoot
} else {
    $projectGatewayRoot
}
$gatewayProjectRoot = Split-Path -Parent $gatewayRoot

$logDir = if ($env:ANIX_AI_LOG_DIR) { $env:ANIX_AI_LOG_DIR } else { Join-Path $RuntimeRoot 'logs' }
$logPath = Join-Path $logDir "ai-watchdog.log"
$gatewayEnvFiles = @(
    (Join-Path $gatewayRoot '.env.local-ai'),
    (Join-Path $gatewayRoot '.env'),
    (Join-Path $RuntimeRoot 'local-ai-gateway.env.local-ai')
)

function Rotate-Log {
    param(
        [string]$Path,
        [int64]$MaxBytes = 5242880,
        [int]$Keep = 5
    )
    if (-not (Test-Path -LiteralPath $Path)) { return }
    if ((Get-Item -LiteralPath $Path).Length -lt $MaxBytes) { return }
    for ($index = $Keep - 1; $index -ge 1; $index--) {
        $from = "$Path.$index"
        $to = "$Path.$($index + 1)"
        if (Test-Path -LiteralPath $from) {
            Move-Item -LiteralPath $from -Destination $to -Force
        }
    }
    Move-Item -LiteralPath $Path -Destination "$Path.1" -Force
}

function Write-WatchdogLog {
    param([string]$Message)
    Add-Content -LiteralPath $logPath -Encoding utf8 -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
}

function Import-EnvFile {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $false }
    Get-Content -LiteralPath $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            $parts = $line -split '=', 2
            if ($parts.Count -eq 2) {
                [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
            }
        }
    }
    return $true
}

function Test-Health {
    param([string]$Url)
    try {
        $result = Invoke-RestMethod -Uri $Url -TimeoutSec 12
        return ($result.ok -eq $true)
    }
    catch {
        return $false
    }
}

function Test-ProtectedEmbed {
    param([string]$BaseUrl)
    if (-not $env:LOCAL_AI_GATEWAY_SECRET) { return $false }
    $headers = @{ Authorization = "Bearer $env:LOCAL_AI_GATEWAY_SECRET" }
    $body = @{
        request_id = "watchdog-$([guid]::NewGuid().ToString())"
        input = "Anix watchdog protected endpoint check"
        model = if ($env:EMBEDDING_MODEL) { $env:EMBEDDING_MODEL } else { "embeddinggemma" }
    } | ConvertTo-Json -Depth 4
    try {
        $result = Invoke-RestMethod -Uri "$($BaseUrl.TrimEnd('/'))/v1/embed" -Method Post -Headers $headers -ContentType "application/json" -Body $body -TimeoutSec 45
        return ($result.embeddings -and $result.embeddings.Count -gt 0 -and $result.embeddings[0].Count -eq 768)
    }
    catch {
        Write-WatchdogLog "protected_embed_failed base=$BaseUrl error=$($_.Exception.Message)"
        return $false
    }
}

function Test-ProtectedChat {
    param([string]$BaseUrl)
    if (-not $env:LOCAL_AI_GATEWAY_SECRET) { return $false }
    $headers = @{ Authorization = "Bearer $env:LOCAL_AI_GATEWAY_SECRET" }
    $body = @{
        request_id = "watchdog-chat-$([guid]::NewGuid().ToString())"
        model = if ($env:CHAT_MODEL) { $env:CHAT_MODEL } else { "qwen3:8b" }
        system_prompt = "You are a service health probe. Return only valid JSON."
        retrieved_context = "The Anix AI service is being checked for real text generation."
        messages = @(
            @{ role = "user"; content = 'Return {"ok":true,"text":"ready"}.' }
        )
        model_parameters = @{
            temperature = 0
            num_ctx = 2048
            format = "json"
            think = $false
        }
    } | ConvertTo-Json -Depth 8
    try {
        $result = Invoke-RestMethod -Uri "$($BaseUrl.TrimEnd('/'))/v1/chat" -Method Post -Headers $headers -ContentType "application/json" -Body $body -TimeoutSec 150
        $content = [string]$result.message.content
        if ([string]::IsNullOrWhiteSpace($content)) { return $false }
        $payload = $content | ConvertFrom-Json -ErrorAction Stop
        return ($payload.ok -eq $true)
    }
    catch {
        Write-WatchdogLog "protected_chat_failed base=$BaseUrl error=$($_.Exception.Message)"
        return $false
    }
}

function Start-Gateway {
    $wscript = "C:\Windows\System32\wscript.exe"
    $launcher = Join-Path $RuntimeRoot 'start-gateway-hidden.vbs'
    if (Test-Path -LiteralPath $launcher) {
        Start-Process -FilePath $wscript -ArgumentList "`"$launcher`"" -WindowStyle Hidden
        return
    }

    $runtimeStarter = Join-Path $RuntimeRoot 'start-local-ai-gateway.ps1'
    if (Test-Path -LiteralPath $runtimeStarter) {
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$runtimeStarter`"" -WindowStyle Hidden
        return
    }

    $repoStarter = Join-Path $ProjectRoot 'scripts\windows\start-local-ai.ps1'
    if (-not (Test-Path -LiteralPath $repoStarter)) {
        throw 'No gateway launcher is available.'
    }
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$repoStarter`" -ProjectRoot `"$gatewayProjectRoot`"" -WindowStyle Hidden
}

New-Item -ItemType Directory -Path $logDir -Force | Out-Null
Rotate-Log -Path $logPath
foreach ($envFile in $gatewayEnvFiles) { Import-EnvFile -Path $envFile | Out-Null }
if (-not $env:LOCAL_AI_GATEWAY_SECRET -and $env:GATEWAY_SECRET) { $env:LOCAL_AI_GATEWAY_SECRET = $env:GATEWAY_SECRET }

Write-WatchdogLog "check_started"

$ollamaReady = $false
try {
    Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 5 | Out-Null
    $ollamaReady = $true
}
catch {
    Write-WatchdogLog "ollama_unavailable restarting"
    Get-Process ollama -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    $ollamaExe = (Get-Command ollama -ErrorAction SilentlyContinue).Source
    if (-not $ollamaExe) { $ollamaExe = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" }
    if (Test-Path -LiteralPath $ollamaExe) {
        Start-Process -FilePath $ollamaExe -ArgumentList "serve" -WindowStyle Hidden
        for ($attempt = 1; $attempt -le 30; $attempt++) {
            Start-Sleep -Seconds 2
            try {
                Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 5 | Out-Null
                $ollamaReady = $true
                break
            }
            catch {}
        }
    }
}

if ($ollamaReady) {
    try {
        $warmBody = @{
            model = if ($env:CHAT_MODEL) { $env:CHAT_MODEL } else { "qwen3:8b" }
            prompt = ""
            stream = $false
            keep_alive = -1
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/generate" -Method Post -ContentType "application/json" -Body $warmBody -TimeoutSec 180 | Out-Null
        Write-WatchdogLog "ollama_ready model_warm=true"
    }
    catch {
        Write-WatchdogLog "ollama_warm_failed error=$($_.Exception.Message)"
    }
}
else {
    Write-WatchdogLog "ollama_start_failed"
}

$localHealthOk = Test-Health "http://127.0.0.1:8788/health"
$localProtectedOk = Test-ProtectedEmbed "http://127.0.0.1:8788"
$localChatOk = if ($localHealthOk -and $localProtectedOk) { Test-ProtectedChat "http://127.0.0.1:8788" } else { $false }

if (-not ($localHealthOk -and $localProtectedOk -and $localChatOk)) {
    Write-WatchdogLog "gateway_unhealthy restarting localHealth=$localHealthOk protected=$localProtectedOk chat=$localChatOk"
    Get-NetTCPConnection -LocalPort 8788 -State Listen -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique |
        Where-Object { $_ -and $_ -ne $PID } |
        ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Start-Gateway
    for ($attempt = 1; $attempt -le 30; $attempt++) {
        Start-Sleep -Seconds 2
        $localHealthOk = Test-Health "http://127.0.0.1:8788/health"
        $localProtectedOk = Test-ProtectedEmbed "http://127.0.0.1:8788"
        if ($localHealthOk -and $localProtectedOk) { break }
    }
    $localChatOk = if ($localHealthOk -and $localProtectedOk) { Test-ProtectedChat "http://127.0.0.1:8788" } else { $false }
}

$cloudflared = Get-Service cloudflared -ErrorAction SilentlyContinue
if ($cloudflared -and $cloudflared.Status -ne "Running") {
    try {
        Start-Service cloudflared
        Start-Sleep -Seconds 5
    }
    catch {
        Write-WatchdogLog "cloudflared_start_failed error=$($_.Exception.Message)"
    }
}

$externalHealthOk = Test-Health "https://llm.anix-ai.pro/health"
$externalProtectedOk = Test-ProtectedEmbed "https://llm.anix-ai.pro"
$externalChatOk = if ($externalHealthOk -and $externalProtectedOk) { Test-ProtectedChat "https://llm.anix-ai.pro" } else { $false }
if (-not ($externalHealthOk -and $externalProtectedOk -and $externalChatOk)) {
    Write-WatchdogLog "external_gateway_unhealthy restarting_cloudflared health=$externalHealthOk protected=$externalProtectedOk chat=$externalChatOk"
    try {
        Restart-Service cloudflared
        Start-Sleep -Seconds 8
    }
    catch {
        Write-WatchdogLog "cloudflared_restart_failed error=$($_.Exception.Message)"
    }
    $externalHealthOk = Test-Health "https://llm.anix-ai.pro/health"
    $externalProtectedOk = Test-ProtectedEmbed "https://llm.anix-ai.pro"
    $externalChatOk = if ($externalHealthOk -and $externalProtectedOk) { Test-ProtectedChat "https://llm.anix-ai.pro" } else { $false }
}

Write-WatchdogLog "result localHealth=$localHealthOk localProtected=$localProtectedOk localChat=$localChatOk externalHealth=$externalHealthOk externalProtected=$externalProtectedOk externalChat=$externalChatOk"
