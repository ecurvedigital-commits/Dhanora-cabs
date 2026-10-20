# Build full static Next.js website for Hostinger public_html
$ErrorActionPreference = "Stop"

$projectRoot = "d:\UI\Dehradun"
$webDir = Join-Path $projectRoot "apps\web"
$outDir = Join-Path $webDir "out"
$distDir = Join-Path $projectRoot "dist"
$zipPath = Join-Path $projectRoot "dist.zip"

Write-Host "=========================================================="
Write-Host "Step 1: Exporting full Next.js application to static HTML..."
Write-Host "=========================================================="

$env:NEXT_EXPORT = "true"

Push-Location $webDir
try {
    pnpm run build
} finally {
    Pop-Location
}

if (-not (Test-Path $outDir)) {
    Write-Error "Next.js export failed: $outDir does not exist."
}

Write-Host "=========================================================="
Write-Host "Step 2: Packaging complete website into dist folder..."
Write-Host "=========================================================="

if (Test-Path $distDir) {
    Remove-Item -Recurse -Force $distDir
}
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

# Copy everything from Next.js static export (out/) into dist/
Copy-Item -Path "$outDir\*" -Destination $distDir -Recurse -Force

# Ensure logo.jpg and direct images exist
if (Test-Path (Join-Path $projectRoot "logo.jpg")) {
    Copy-Item (Join-Path $projectRoot "logo.jpg") (Join-Path $distDir "logo.jpg") -Force
}

# 3. Write Hostinger-optimized .htaccess with Clean URLs & Caching
$htaccessContent = @"
# ========================================================
# Hostinger LiteSpeed / Apache Configuration - Dhanora Cab
# ========================================================

# 1. Force HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Handle Clean URLs: e.g. /routes loads /routes.html seamlessly
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME}.html -f
    RewriteRule ^(.*)$ `$1.html [L]
</IfModule>

# 2. 404 Fallback
ErrorDocument 404 /404.html

# 3. Character Encoding & Default Document
AddDefaultCharset UTF-8
DirectoryIndex index.html

# 4. Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 5. Gzip / Deflate Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json image/svg+xml
</IfModule>

# 6. Browser Cache Expiration (Leverage Browser Caching)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# 7. Prevent Directory Browsing
Options -Indexes
"@

Set-Content -Path (Join-Path $distDir ".htaccess") -Value $htaccessContent -Encoding UTF8

# 4. Create dist.zip Archive for 1-Click Upload & Extraction in Hostinger File Manager
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Write-Host "=========================================================="
Write-Host "Step 3: Creating dist.zip archive for Hostinger..."
Write-Host "=========================================================="

Push-Location $distDir
try {
    & tar.exe -a -c -f $zipPath *
} finally {
    Pop-Location
}

$zipInfo = Get-Item $zipPath
Write-Host "=========================================================="
Write-Host "SUCCESS! Full website ready for Hostinger:"
Write-Host "Folder: $distDir"
Write-Host "Zip Archive: $zipPath ($([Math]::Round($zipInfo.Length / 1MB, 2)) MB)"
Write-Host "=========================================================="
