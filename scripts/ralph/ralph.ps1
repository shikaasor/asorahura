# Ralph Wiggum - Long-running AI agent loop (PowerShell version)
# Usage: .\ralph.ps1 [-Tool amp|claude] [-MaxIterations 10]

param(
    [ValidateSet("amp", "claude")]
    [string]$Tool = "claude",
    [int]$MaxIterations = 10
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PrdFile = Join-Path $ScriptDir "prd.json"
$ProgressFile = Join-Path $ScriptDir "progress.txt"
$ArchiveDir = Join-Path $ScriptDir "archive"
$LastBranchFile = Join-Path $ScriptDir ".last-branch"
$ClaudeMdFile = Join-Path $ScriptDir "CLAUDE.md"

# Archive previous run if branch changed
if ((Test-Path $PrdFile) -and (Test-Path $LastBranchFile)) {
    try {
        $prdContent = Get-Content $PrdFile -Raw | ConvertFrom-Json
        $CurrentBranch = $prdContent.branchName
        $LastBranch = Get-Content $LastBranchFile -Raw
        $LastBranch = $LastBranch.Trim()

        if ($CurrentBranch -and $LastBranch -and ($CurrentBranch -ne $LastBranch)) {
            # Archive the previous run
            $Date = Get-Date -Format "yyyy-MM-dd"
            $FolderName = $LastBranch -replace "^ralph/", ""
            $ArchiveFolder = Join-Path $ArchiveDir "$Date-$FolderName"

            Write-Host "Archiving previous run: $LastBranch"
            New-Item -ItemType Directory -Path $ArchiveFolder -Force | Out-Null
            if (Test-Path $PrdFile) { Copy-Item $PrdFile $ArchiveFolder }
            if (Test-Path $ProgressFile) { Copy-Item $ProgressFile $ArchiveFolder }
            Write-Host "   Archived to: $ArchiveFolder"

            # Reset progress file for new run
            @"
# Ralph Progress Log
Started: $(Get-Date)
---
"@ | Set-Content $ProgressFile
        }
    } catch {
        Write-Host "Warning: Could not check for branch change: $_"
    }
}

# Track current branch
if (Test-Path $PrdFile) {
    try {
        $prdContent = Get-Content $PrdFile -Raw | ConvertFrom-Json
        $CurrentBranch = $prdContent.branchName
        if ($CurrentBranch) {
            $CurrentBranch | Set-Content $LastBranchFile
        }
    } catch {
        Write-Host "Warning: Could not read PRD file: $_"
    }
}

# Initialize progress file if it doesn't exist
if (-not (Test-Path $ProgressFile)) {
    @"
# Ralph Progress Log
Started: $(Get-Date)
---
"@ | Set-Content $ProgressFile
}

Write-Host "Starting Ralph - Tool: $Tool - Max iterations: $MaxIterations"

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host ""
    Write-Host "==============================================================="
    Write-Host "  Ralph Iteration $i of $MaxIterations ($Tool)"
    Write-Host "==============================================================="

    $Output = ""

    try {
        if ($Tool -eq "amp") {
            $PromptFile = Join-Path $ScriptDir "prompt.md"
            $Output = Get-Content $PromptFile -Raw | amp --dangerously-allow-all 2>&1
            $Output | Write-Host
        } else {
            # Claude Code: use --dangerously-skip-permissions for autonomous operation
            $Output = claude --dangerously-skip-permissions --print $ClaudeMdFile 2>&1
            $Output | Write-Host
        }
    } catch {
        Write-Host "Error during iteration: $_"
        $Output = $_.ToString()
    }

    # Check for completion signal
    if ($Output -match "<promise>COMPLETE</promise>") {
        Write-Host ""
        Write-Host "Ralph completed all tasks!"
        Write-Host "Completed at iteration $i of $MaxIterations"
        exit 0
    }

    Write-Host "Iteration $i complete. Continuing..."
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Ralph reached max iterations ($MaxIterations) without completing all tasks."
Write-Host "Check $ProgressFile for status."
exit 1
