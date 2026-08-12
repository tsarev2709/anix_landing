param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [switch]$SkipModelCheck
)

$ErrorActionPreference = 'Stop'
$envFile = Join-Path $ProjectRoot 'local-ai-gateway\.env.local-ai'

if (-not (Test-Path $envFile)) {
  throw "Создайте $envFile из .env.local-ai.example и задайте LOCAL_AI_GATEWAY_SECRET."
}

Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith('#')) { return }
  $parts = $line -split '=', 2
  if ($parts.Count -eq 2) {
    [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
  }
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
node 'local-ai-gateway\server.mjs'
