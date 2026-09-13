[CmdletBinding(PositionalBinding = $false)]
param(
    [ValidatePattern('^demo-0[1-5]$')]
    [string]$Target,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
if (-not $PSBoundParameters.ContainsKey('Target')) {
    throw 'An explicit -Target demo-XX argument is required. Nothing was changed.'
}
$root = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path (Join-Path $root '.git'))) {
    throw 'This folder is not a Git repository. Nothing was changed.'
}
$top = git -C $root rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0 -or [IO.Path]::GetFullPath($top) -ne [IO.Path]::GetFullPath($root)) {
    throw 'Refusing to operate outside the demo repository.'
}
git -C $root show-ref --verify --quiet "refs/tags/$Target"
if ($LASTEXITCODE -ne 0) { throw "Local tag $Target does not exist." }
$commit = git -C $root rev-parse --verify "refs/tags/$Target^{commit}"
if ($LASTEXITCODE -ne 0) { throw 'Target must resolve to a commit.' }
$changes = git -C $root status --porcelain --untracked-files=all
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect working tree.' }
if ($changes -and -not $Force) {
    throw 'Uncommitted changes detected. Commit or preserve them first; -Force permits discarding tracked changes.'
}
Write-Warning 'This moves the current local branch/HEAD and discards tracked changes. No remote is contacted. Untracked files are not cleaned.'
$confirmation = Read-Host "Type $Target to confirm the local reset"
if ($confirmation -cne $Target) { throw 'Confirmation did not match. Nothing was changed.' }
git -C $root reset --hard $commit
if ($LASTEXITCODE -ne 0) { throw 'Local reset failed.' }
Write-Output "Reset to $Target. No remote was touched."
