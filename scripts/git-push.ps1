# GitHub 푸시 스크립트
# 프로젝트 루트(jinam_ver.1.0.0-main 폴더)에서 실행하세요.
# 사용법: .\scripts\git-push.ps1
# 또는: PowerShell에서 이 스크립트가 있는 폴더의 상위로 cd한 뒤 .\scripts\git-push.ps1

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot | Split-Path -Parent
Set-Location $repoRoot

if (-not (Test-Path ".git")) {
    Write-Host "Git 저장소 초기화 중..."
    git init
    git branch -M main
}

$remote = "origin"
$url = "https://github.com/Jaeyoung0218/jinam_ver.1.0.0.git"
$existing = git remote get-url $remote 2>$null
if (-not $existing) {
    Write-Host "원격 저장소 추가: $url"
    git remote add $remote $url
} elseif ($existing -ne $url) {
    Write-Host "원격 URL 변경: $url"
    git remote set-url $remote $url
}

Write-Host "변경 사항 스테이징..."
git add -A
$status = git status --short
if (-not $status) {
    Write-Host "커밋할 변경 사항이 없습니다."
    exit 0
}
Write-Host $status
Write-Host ""
Write-Host "커밋 중..."
git commit -m "feat: KSPO 콘서트 JSON 반영 및 페이지 연동 (26 Q1)"
Write-Host "푸시 중 (origin main)..."
git push -u origin main
Write-Host "완료."
