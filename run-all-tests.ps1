#!/usr/bin/env pwsh

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    TESTING SUITE - DISTRIBUTED MICROSERVICES" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Test counters
$passedTests = 0
$failedTests = 0
$testResults = @()

Write-Host "🧪 Running Frontend Tests..." -ForegroundColor Yellow
Push-Location "frontend"
npm test -- --run 2>&1 | Out-File -FilePath "frontend-test-results.txt"
$frontendExit = $LASTEXITCODE
Pop-Location

if ($frontendExit -eq 0) {
    Write-Host "✅ Frontend tests PASSED" -ForegroundColor Green
    $passedTests++
    $testResults += "Frontend: PASSED"
} else {
    Write-Host "❌ Frontend tests FAILED" -ForegroundColor Red
    $failedTests++
    $testResults += "Frontend: FAILED"
}

Write-Host ""
Write-Host "🧪 Running Auth Service Tests..." -ForegroundColor Yellow
Push-Location "services/auth-service"
npm test -- --run --coverage 2>&1 | Out-File -FilePath "auth-test-results.txt"
$authExit = $LASTEXITCODE
Pop-Location

if ($authExit -eq 0) {
    Write-Host "✅ Auth Service tests PASSED" -ForegroundColor Green
    $passedTests++
    $testResults += "Auth Service: PASSED"
} else {
    Write-Host "❌ Auth Service tests FAILED" -ForegroundColor Red
    $failedTests++
    $testResults += "Auth Service: FAILED"
}

Write-Host ""
Write-Host "🧪 Running Payments Service Tests..." -ForegroundColor Yellow
Push-Location "services/payments-service"
npm test -- --run 2>&1 | Out-File -FilePath "payments-test-results.txt"
$paymentsExit = $LASTEXITCODE
Pop-Location

if ($paymentsExit -eq 0) {
    Write-Host "✅ Payments Service tests PASSED" -ForegroundColor Green
    $passedTests++
    $testResults += "Payments Service: PASSED"
} else {
    Write-Host "❌ Payments Service tests FAILED" -ForegroundColor Red
    $failedTests++
    $testResults += "Payments Service: FAILED"
}

Write-Host ""
Write-Host "🧪 Running Notifications Service Tests..." -ForegroundColor Yellow
Push-Location "services/notifications-service"
npm test -- --run 2>&1 | Out-File -FilePath "notifications-test-results.txt"
$notificationsExit = $LASTEXITCODE
Pop-Location

if ($notificationsExit -eq 0) {
    Write-Host "✅ Notifications Service tests PASSED" -ForegroundColor Green
    $passedTests++
    $testResults += "Notifications Service: PASSED"
} else {
    Write-Host "❌ Notifications Service tests FAILED" -ForegroundColor Red
    $failedTests++
    $testResults += "Notifications Service: FAILED"
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "                   TEST SUMMARY" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Test Suites: 4"
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host ""

Write-Host "Detailed Results:"
foreach ($result in $testResults) {
    Write-Host "  - $result"
}

Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the following files for details:"
    Write-Host "- Frontend: frontend/frontend-test-results.txt"
    Write-Host "- Auth Service: services/auth-service/auth-test-results.txt"
    Write-Host "- Payments Service: services/payments-service/payments-test-results.txt"
    Write-Host "- Notifications: services/notifications-service/notifications-test-results.txt"
    exit 1
}
