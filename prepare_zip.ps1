# PowerShell Script to Prepare a clean ZIP file for cPanel Deployment
$projectRoot = "c:\Users\Lenovo\OneDrive\Desktop\Zar_latest\Zar_backend"
$tempDir = Join-Path $projectRoot "deploy_temp"
$zipPath = Join-Path $projectRoot "zar_deployment.zip"

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

# Create temp structure
New-Item -ItemType Directory -Path $tempDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "backend") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "frontend") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "frontend/admin-dashboard") | Out-Null

# Copy Backend (excluding node_modules)
Get-ChildItem -Path (Join-Path $projectRoot "backend") -Exclude "node_modules" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir "backend") -Recurse -Force
}

# Copy Admin-Dashboard (excluding node_modules, .next)
Get-ChildItem -Path (Join-Path $projectRoot "frontend/admin-dashboard") -Exclude "node_modules", ".next" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir "frontend/admin-dashboard") -Recurse -Force
}

# Copy root configs
Copy-Item -Path (Join-Path $projectRoot "ecosystem.config.js") -Destination $tempDir -Force
Copy-Item -Path (Join-Path $projectRoot ".htaccess") -Destination $tempDir -Force
Copy-Item -Path (Join-Path $projectRoot "deploy.sh") -Destination $tempDir -Force
Copy-Item -Path (Join-Path $projectRoot "cpanel-deployment-guide.md") -Destination $tempDir -Force

# Compress to ZIP using built-in Windows tar
cd $tempDir
tar -acf $zipPath *
cd $projectRoot

# Clean up
Remove-Item -Recurse -Force $tempDir

Write-Host "ZIP file created successfully at: $zipPath"
