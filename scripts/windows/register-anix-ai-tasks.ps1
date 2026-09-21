param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
    [string]$RuntimeRoot = 'C:\Anix'
)

$ErrorActionPreference = 'Stop'

$userId = "$env:USERDOMAIN\$env:USERNAME"
$powershell = 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe'
$wscript = 'C:\Windows\System32\wscript.exe'
$ollamaScript = Join-Path $ProjectRoot 'scripts\windows\start-ollama-server.ps1'
$gatewayScript = Join-Path $ProjectRoot 'scripts\windows\start-local-ai.ps1'
$watchdogScript = Join-Path $ProjectRoot 'scripts\windows\anix-ai-watchdog.ps1'
$watchdogWrapper = Join-Path $ProjectRoot 'scripts\windows\start-watchdog-hidden.vbs'
$gatewayProjectRoot = if (Test-Path -LiteralPath (Join-Path $RuntimeRoot 'local-ai-gateway')) {
    $RuntimeRoot
} else {
    $ProjectRoot
}
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
$startupSettings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -Hidden `
    -MultipleInstances IgnoreNew `
    -RestartCount 10 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable
$watchdogSettings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -Hidden `
    -MultipleInstances IgnoreNew `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable

$definitions = @(
    @{
        Name = 'AnixOllamaServer'
        Script = $ollamaScript
        Execute = $powershell
        Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ollamaScript`" -RuntimeRoot `"$RuntimeRoot`""
        Description = 'Hidden Ollama server startup for Anix local AI'
        Triggers = @(New-ScheduledTaskTrigger -AtLogOn -User $userId)
        Settings = $startupSettings
    },
    @{
        Name = 'AnixLocalAIGateway'
        Script = $gatewayScript
        Execute = $powershell
        Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$gatewayScript`" -ProjectRoot `"$gatewayProjectRoot`""
        Description = 'Hidden authenticated local AI gateway startup for Anix'
        Triggers = @(New-ScheduledTaskTrigger -AtLogOn -User $userId)
        Settings = $startupSettings
    },
    @{
        Name = 'AnixAIWatchdog'
        Script = $watchdogScript
        Execute = $wscript
        Arguments = "`"$watchdogWrapper`" `"$watchdogScript`" `"$ProjectRoot`" `"$RuntimeRoot`""
        Description = 'Five-minute end-to-end health and generation check for Anix AI'
        Triggers = @(
            (New-ScheduledTaskTrigger -AtLogOn -User $userId),
            (New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 3650))
        )
        Settings = $watchdogSettings
    }
)

if (-not (Test-Path -LiteralPath $watchdogWrapper)) {
    throw "Missing script: $watchdogWrapper"
}

foreach ($definition in $definitions) {
    if (-not (Test-Path -LiteralPath $definition.Script)) {
        throw "Missing script: $($definition.Script)"
    }
    $action = New-ScheduledTaskAction `
        -Execute $definition.Execute `
        -Argument $definition.Arguments `
        -WorkingDirectory $RuntimeRoot
    $task = New-ScheduledTask `
        -Action $action `
        -Trigger $definition.Triggers `
        -Principal $principal `
        -Settings $definition.Settings `
        -Description $definition.Description
    Register-ScheduledTask -TaskName $definition.Name -InputObject $task -Force -ErrorAction Stop | Out-Null
}

foreach ($definition in $definitions) {
    Start-ScheduledTask -TaskName $definition.Name -ErrorAction Stop
}

$watchdogDeadline = (Get-Date).AddMinutes(3)
do {
    Start-Sleep -Seconds 2
    $watchdogState = (Get-ScheduledTask -TaskName 'AnixAIWatchdog' -ErrorAction Stop).State
} while ($watchdogState -ne 'Ready' -and (Get-Date) -lt $watchdogDeadline)

$status = foreach ($definition in $definitions) {
    $task = Get-ScheduledTask -TaskName $definition.Name -ErrorAction Stop
    $info = Get-ScheduledTaskInfo -TaskName $definition.Name -ErrorAction Stop
    [pscustomobject]@{
        task = $definition.Name
        state = [string]$task.State
        last_result = $info.LastTaskResult
        last_run = $info.LastRunTime
        next_run = $info.NextRunTime
        hidden = $task.Settings.Hidden
        action = (($task.Actions | ForEach-Object { "$($_.Execute) $($_.Arguments)" }) -join ' | ')
        trigger_count = @($task.Triggers).Count
    }
}

New-Item -ItemType Directory -Path (Join-Path $RuntimeRoot 'logs') -Force | Out-Null
$status | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $RuntimeRoot 'logs\ai-task-status.json') -Encoding utf8
Write-Output 'Registered and started AnixOllamaServer, AnixLocalAIGateway, and AnixAIWatchdog.'
