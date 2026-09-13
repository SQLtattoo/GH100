[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    foreach ($tool in @('node', 'npm', 'python', 'pwsh')) {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
            throw "Missing existing tool: $tool. Nothing will be installed; ask before installing it."
        }
    }
    $nodeVersion = node --version
    if ($LASTEXITCODE -ne 0) { throw 'Node version check failed.' }
    $nodeMajor = [int]($nodeVersion.TrimStart('v').Split('.')[0])
    if ($nodeMajor -lt 22) { throw 'Node 22 or newer is required.' }
    if ($nodeMajor -ne 22) { Write-Warning "Local runtime is $nodeVersion; CI targets Node 22. This is not a local Node 22 validation." }
    python -c 'import yaml'
    if ($LASTEXITCODE -ne 0) { throw 'PyYAML is not available. Ask before installing it; no parser was installed.' }

    npm ci --ignore-scripts --no-audit --no-fund --offline
    if ($LASTEXITCODE -ne 0) { throw 'Offline lockfile installation failed.' }
    npm run lint
    if ($LASTEXITCODE -ne 0) { throw 'Lint failed.' }
    node scripts/run-ci-tests.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Tests failed.' }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
    $before = Get-ChildItem dist -File | Sort-Object Name | Get-FileHash | Select-Object -ExpandProperty Hash
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Second build failed.' }
    $after = Get-ChildItem dist -File | Sort-Object Name | Get-FileHash | Select-Object -ExpandProperty Hash
    if (Compare-Object $before $after) { throw 'Build is not deterministic.' }

    $parser = @'
import glob, json, yaml
paths = sorted(glob.glob('.github/**/*.yml', recursive=True))
documents = {}
for path in paths:
    with open(path, encoding='utf-8') as stream:
        documents[path.replace(chr(92), '/')] = yaml.load(stream, Loader=yaml.BaseLoader)
print(json.dumps(documents))
'@
    $documents = python -c $parser
    if ($LASTEXITCODE -ne 0) { throw 'Workflow YAML parsing failed.' }
    $documents | node scripts/verify-workflows.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Workflow safety checks failed.' }
    foreach ($path in Get-ChildItem scripts -Filter '*.ps1') {
        $tokens = $null
        $parseErrors = $null
        $null = [System.Management.Automation.Language.Parser]::ParseFile($path.FullName, [ref]$tokens, [ref]$parseErrors)
        if ($parseErrors.Count) { throw "PowerShell parse failed: $($path.Name)" }
    }
    Write-Output 'PowerShell scripts parse successfully.'
    node scripts/verify-repository.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Repository verification failed.' }
    Write-Output 'Local rehearsal passed. No authentication, publish, remote, or cloud operation was performed.'
} finally {
    Pop-Location
}
