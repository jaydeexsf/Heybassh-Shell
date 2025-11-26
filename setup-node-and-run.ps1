Param(
    [string]$ProjectPath = ".",
    [string]$StartScript = "dev",
    [string]$NodeVersion = "v20.11.1"
)

$ErrorActionPreference = "Stop"

function Write-Section([string]$Message, [ConsoleColor]$Color = [ConsoleColor]::Cyan) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor $Color
    Write-Host $Message -ForegroundColor $Color
    Write-Host "========================================" -ForegroundColor $Color
}

function Ensure-Node([string]$VersionTag) {
    $nodeDetected = $false

    try {
        $currentNode = (node --version).Trim()
        $currentNpm = (npm --version).Trim()
        Write-Host "Node.js version: $currentNode" -ForegroundColor Green
        Write-Host "npm version: $currentNpm" -ForegroundColor Green
        $nodeDetected = $true
    } catch {
        Write-Host "Node.js not found in PATH. Installing locally without admin rights..." -ForegroundColor Yellow
    }

    if ($nodeDetected) {
        return
    }

    $nodeBaseName = "node-$VersionTag-win-x64"
    $downloadUrl = "https://nodejs.org/dist/$VersionTag/$nodeBaseName.zip"
    $tempZip = Join-Path $env:TEMP "$nodeBaseName.zip"
    $extractDir = Join-Path $env:TEMP "$nodeBaseName"
    $installDir = Join-Path $env:LOCALAPPDATA "nodejs"

    if (Test-Path $extractDir) {
        Remove-Item $extractDir -Recurse -Force
    }
    if (-not (Test-Path $installDir)) {
        New-Item -ItemType Directory -Path $installDir | Out-Null
    }

    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Write-Host "Downloading Node.js $VersionTag from $downloadUrl" -ForegroundColor Yellow
    Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip

    Write-Host "Extracting archive to $extractDir" -ForegroundColor Yellow
    Expand-Archive -LiteralPath $tempZip -DestinationPath $env:TEMP -Force

    Write-Host "Copying Node binaries to $installDir" -ForegroundColor Yellow
    Copy-Item (Join-Path $extractDir "*") $installDir -Recurse -Force

    Remove-Item $tempZip -Force
    Remove-Item $extractDir -Recurse -Force

    $sessionPath = "$installDir;$env:PATH"
    $env:PATH = $sessionPath

    $userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($userPath -notlike "*$installDir*") {
        [Environment]::SetEnvironmentVariable("PATH", "$installDir;$userPath", "User")
        Write-Host "Added $installDir to the user PATH. New terminals will pick this up automatically." -ForegroundColor Green
    }

    $npmDataDir = Join-Path $env:APPDATA "npm"
    if (-not (Test-Path $npmDataDir)) {
        New-Item -ItemType Directory -Path $npmDataDir | Out-Null
    }

    Write-Host "Node.js installed successfully." -ForegroundColor Green
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
}

function Resolve-Project([string]$PathArgument) {
    $candidate = if ([System.IO.Path]::IsPathRooted($PathArgument)) {
        $PathArgument
    } else {
        Join-Path $PSScriptRoot $PathArgument
    }

    if (-not (Test-Path $candidate)) {
        throw "Project directory not found: $candidate"
    }

    return (Resolve-Path $candidate).Path
}

Write-Section -Message "Node.js Setup"
Ensure-Node -VersionTag $NodeVersion

$projectDirectory = Resolve-Project -PathArgument $ProjectPath
Write-Section -Message "Running project at $projectDirectory"
Set-Location $projectDirectory

if (-not (Test-Path "package.json")) {
    throw "package.json not found in $projectDirectory. Please provide a path to a valid Node.js project."
}

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules missing. Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting $StartScript using npm..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
npm run $StartScript