param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
)

$ErrorActionPreference = 'Stop'
$taskName = 'AnixLocalAIGateway'
$scriptPath = Join-Path $ProjectRoot 'scripts\windows\start-local-ai.ps1'

if (-not (Test-Path $scriptPath)) {
  throw "Не найден $scriptPath"
}

$action = New-ScheduledTaskAction `
  -Execute 'powershell.exe' `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`" -ProjectRoot `"$ProjectRoot`""
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -RestartCount 20 `
  -RestartInterval (New-TimeSpan -Minutes 2) `
  -ExecutionTimeLimit (New-TimeSpan -Days 3650) `
  -StartWhenAvailable

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description 'Ollama gateway for the Anix website AI consultant' `
  -Force | Out-Null

Write-Host "Автозапуск зарегистрирован: $taskName"
