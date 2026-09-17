param(
    [string]$RuntimeRoot = 'C:\Anix'
)

$ErrorActionPreference = 'Stop'

$logDir = if ($env:ANIX_AI_LOG_DIR) { $env:ANIX_AI_LOG_DIR } else { Join-Path $RuntimeRoot 'logs' }
$launcherLog = Join-Path $logDir 'ollama-launcher.log'
$stdoutLog = Join-Path $logDir 'ollama-server.log'
$stderrLog = Join-Path $logDir 'ollama-server-error.log'

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

New-Item -ItemType Directory -Path $logDir -Force | Out-Null
foreach ($path in @($launcherLog, $stdoutLog, $stderrLog)) { Rotate-Log -Path $path }

try {
    Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3 | Out-Null
    Write-LauncherLog 'ollama already running'
    exit 0
}
catch {}

$ollamaExe = (Get-Command ollama.exe -ErrorAction SilentlyContinue).Source
if (-not $ollamaExe) {
    $ollamaExe = Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'
}
if (-not (Test-Path -LiteralPath $ollamaExe)) {
    throw 'Ollama executable was not found.'
}

$process = Start-Process `
    -FilePath $ollamaExe `
    -ArgumentList 'serve' `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -PassThru

for ($attempt = 1; $attempt -le 30; $attempt++) {
    Start-Sleep -Milliseconds 500
    if ($process.HasExited) {
        Write-LauncherLog "ollama exited during startup code=$($process.ExitCode)"
        exit $process.ExitCode
    }
    try {
        Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3 | Out-Null
        Write-LauncherLog "ollama started pid=$($process.Id)"
        exit 0
    }
    catch {}
}

Write-LauncherLog "ollama startup timeout pid=$($process.Id)"
exit 1
