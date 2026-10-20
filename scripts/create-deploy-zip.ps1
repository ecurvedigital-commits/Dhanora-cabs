$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceDir = Split-Path -Parent $scriptDir
if (-not (Test-Path (Join-Path $sourceDir "package.json"))) {
    $sourceDir = "d:\UI\Dehradun"
}

$zipPath = Join-Path $sourceDir "dhanora-cab-deploy.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed previous zip file."
}

Write-Host "Creating Linux-compatible deployment archive with POSIX paths using tar..."

$itemsToInclude = @(
    "apps",
    "packages",
    "package.json",
    "server.js",
    ".htaccess",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "tsconfig.base.json",
    "deploy.sh",
    "nginx_dhanoracabs.conf",
    "logo.jpg",
    "images",
    "Dockerfile",
    "docker-compose.yml",
    ".env.example",
    "README.md"
)

# Use tar -a -c -f which natively outputs standard POSIX forward slashes ('/') in ZIP headers
$tarArgs = @(
    "-a",
    "-c",
    "-f",
    $zipPath,
    "--exclude=node_modules",
    "--exclude=.next",
    "--exclude=dist",
    "--exclude=.turbo",
    "--exclude=.git",
    "--exclude=index.html",
    "--exclude=*.log"
) + $itemsToInclude

Push-Location $sourceDir
try {
    & tar.exe $tarArgs
} finally {
    Pop-Location
}

if (Test-Path $zipPath) {
    $fileInfo = Get-Item $zipPath
    Write-Host "SUCCESS! Deployment zip created successfully:"
    Write-Host "Path: $($fileInfo.FullName)"
    Write-Host "Size: $([Math]::Round($fileInfo.Length / 1MB, 2)) MB"
    Write-Host "Last Modified: $($fileInfo.LastWriteTime)"
} else {
    Write-Error "Failed to generate $zipPath"
}
