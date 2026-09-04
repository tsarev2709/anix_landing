param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [switch]$SkipModelCheck
)

$ErrorActionPreference = 'Stop'
$envFile = Join-Path $ProjectRoot 'local-ai-gateway\.env.local-ai'
$legacyEnvFile = Join-Path $ProjectRoot 'local-ai-gateway\.env'
$logDir = if ($env:ANIX_AI_LOG_DIR) { $env:ANIX_AI_LOG_DIR } else { 'C:\Anix\logs' }
$launcherLog = Join-Path $logDir 'ai-gateway-launcher.log'
$gatewayLog = Join-Path $logDir 'ai-gateway.log'
$gatewayErrorLog = Join-Path $logDir 'ai-gateway-error.log'

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

function Write-LauncherLog {
  param([string]$Message)
  Add-Content -LiteralPath $launcherLog -Encoding utf8 -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') launcher $Message"
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

New-Item -ItemType Directory -Path $logDir -Force | Out-Null
Rotate-Log -Path $launcherLog
Rotate-Log -Path $gatewayLog
Rotate-Log -Path $gatewayErrorLog

$loaded = Import-EnvFile -Path $envFile
if (-not $loaded) {
  $loaded = Import-EnvFile -Path $legacyEnvFile
}
if (-not $loaded) {
  throw "Создайте $envFile из .env.local-ai.example и задайте LOCAL_AI_GATEWAY_SECRET."
}
if (-not $env:LOCAL_AI_GATEWAY_SECRET -and $env:GATEWAY_SECRET) {
  $env:LOCAL_AI_GATEWAY_SECRET = $env:GATEWAY_SECRET
}
if (-not $env:LOCAL_AI_GATEWAY_SECRET) {
  throw "LOCAL_AI_GATEWAY_SECRET не задан."
}

foreach ($command in @('node', 'ollama', 'cloudflared')) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
    throw "Не найдена команда $command. Выполните docs/ai-consultant-windows.md."
  }
}

try {
  Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3 | Out-Null
} catch {
  Start-Process -FilePath 'ollama' -ArgumentList 'serve' -WindowStyle Hidden
  Start-Sleep -Seconds 3
}

if (-not $SkipModelCheck) {
  $models = (ollama list | Out-String)
  foreach ($model in @($env:CHAT_MODEL, $env:EMBEDDING_MODEL)) {
    if ($model -and -not $models.Contains(($model -split ':')[0])) {
      throw "Модель $model не установлена. Выполните: ollama pull $model"
    }
  }
}

Set-Location $ProjectRoot
try {
  $health = Invoke-RestMethod -Uri 'http://127.0.0.1:8788/health' -TimeoutSec 3
  if ($health.ok -eq $true -and $health.gateway -eq 'online') {
    Write-LauncherLog 'gateway already running'
    exit 0
  }
}
catch {}

Write-LauncherLog "starting gateway"
$nodeExe = (Get-Command node -ErrorAction Stop).Source
$process = Start-Process `
  -FilePath $nodeExe `
  -ArgumentList (Join-Path $ProjectRoot 'local-ai-gateway\server.mjs') `
  -WorkingDirectory $ProjectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $gatewayLog `
  -RedirectStandardError $gatewayErrorLog `
  -PassThru

for ($attempt = 1; $attempt -le 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  if ($process.HasExited) {
    Write-LauncherLog "gateway exited during startup code=$($process.ExitCode)"
    exit $process.ExitCode
  }
  try {
    $health = Invoke-RestMethod -Uri 'http://127.0.0.1:8788/health' -TimeoutSec 3
    if ($health.ok -eq $true -and $health.gateway -eq 'online') {
      Write-LauncherLog "gateway started pid=$($process.Id)"
      exit 0
    }
  }
  catch {}
}

Write-LauncherLog "gateway startup timeout pid=$($process.Id)"
exit 1
