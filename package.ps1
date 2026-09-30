# Builds dist\Gin Scorekeeper.zip for emailing. Run: npm run package
# (that rebuilds the guide first). The zip holds one "Gin Scorekeeper" folder so
# "Extract All" gives people a tidy folder instead of loose files.
# Needs PowerShell 7 (pwsh): Windows PowerShell 5 writes backslash paths that break on a Mac.
$ErrorActionPreference = 'Stop'
$root  = $PSScriptRoot
$dist  = Join-Path $root 'dist'
$stage = Join-Path $dist 'Gin Scorekeeper'
$guide = Join-Path $dist 'Gin Scorekeeper - User Guide.docx'
$zip   = Join-Path $dist 'Gin Scorekeeper.zip'

if (-not (Test-Path $guide)) { throw "Guide not found. Run: npm run guide" }

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null
Copy-Item (Join-Path $root 'index.html') (Join-Path $stage 'Gin Scorekeeper.html')
Copy-Item $guide $stage

if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path $stage -DestinationPath $zip
Remove-Item $stage -Recurse -Force

Get-Item $zip | Select-Object Name, @{n='KB';e={[math]::Round($_.Length/1KB,1)}}
