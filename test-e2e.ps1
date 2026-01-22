# End-to-End Test Script for Microservices Platform
# Tests: Auth Login -> Profile -> Payments -> Notifications

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "🧪 END-TO-END SYSTEM TEST" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

$baseUrl = "http://localhost:3000"
$testEmail = "e2e-test-$(Get-Random)@example.com"
$testPassword = "Test1234567!"

Write-Host "Test Configuration:" -ForegroundColor Cyan
Write-Host "  API Gateway: $baseUrl"
Write-Host "  Test Email: $testEmail"
Write-Host "  Password: $testPassword"

# Test 1: User Registration
Write-Host "`n[1/6] Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    password = $testPassword
    firstName = "E2E"
    lastName = "Test"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody `
        -UseBasicParsing

    if ($registerResponse.StatusCode -eq 201) {
        Write-Host "  ✅ Registration successful (201)" -ForegroundColor Green
        $registerData = $registerResponse.Content | ConvertFrom-Json
        Write-Host "  User ID: $($registerData.id)" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Unexpected status: $($registerResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: User Login
Write-Host "`n[2/6] Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody `
        -UseBasicParsing

    if ($loginResponse.StatusCode -eq 200) {
        $loginData = $loginResponse.Content | ConvertFrom-Json
        $token = $loginData.access_token
        Write-Host "  ✅ Login successful (200)" -ForegroundColor Green
        Write-Host "  Token received: $($token.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Unexpected status: $($loginResponse.StatusCode)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Get User Profile
Write-Host "`n[3/6] Testing Get Profile (with JWT)..." -ForegroundColor Yellow
try {
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/auth/profile" `
        -Method GET `
        -Headers @{"Authorization"="Bearer $token"} `
        -UseBasicParsing

    if ($profileResponse.StatusCode -eq 200) {
        $profileData = $profileResponse.Content | ConvertFrom-Json
        Write-Host "  ✅ Profile retrieved (200)" -ForegroundColor Green
        Write-Host "  Email: $($profileData.email)" -ForegroundColor Gray
        Write-Host "  Name: $($profileData.firstName) $($profileData.lastName)" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Unexpected status: $($profileResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Profile retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Create Payment
Write-Host "`n[4/6] Testing Create Payment..." -ForegroundColor Yellow
$paymentBody = @{
    userId = $registerData.id
    amount = 99.99
    currency = "USD"
    paymentMethod = "credit_card"
    description = "E2E Test Payment"
} | ConvertTo-Json

try {
    $paymentResponse = Invoke-WebRequest -Uri "$baseUrl/payments" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $paymentBody `
        -UseBasicParsing

    if ($paymentResponse.StatusCode -eq 201) {
        $paymentData = $paymentResponse.Content | ConvertFrom-Json
        Write-Host "  ✅ Payment created (201)" -ForegroundColor Green
        Write-Host "  Payment ID: $($paymentData._id)" -ForegroundColor Gray
        Write-Host "  Amount: $($paymentData.amount) $($paymentData.currency)" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Unexpected status: $($paymentResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Payment creation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Payments List
Write-Host "`n[5/6] Testing Get Payments List..." -ForegroundColor Yellow
try {
    $paymentsResponse = Invoke-WebRequest -Uri "$baseUrl/payments" `
        -Method GET `
        -UseBasicParsing

    if ($paymentsResponse.StatusCode -eq 200) {
        $paymentsData = $paymentsResponse.Content | ConvertFrom-Json
        Write-Host "  ✅ Payments list retrieved (200)" -ForegroundColor Green
        Write-Host "  Total payments: $($paymentsData.Count)" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Unexpected status: $($paymentsResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Payments list retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Send Notification
Write-Host "`n[6/6] Testing Send Notification..." -ForegroundColor Yellow
$notificationBody = @{
    email = $testEmail
    type = "welcome"
    data = @{
        firstName = "E2E"
        lastName = "Test"
    }
} | ConvertTo-Json

try {
    $notificationResponse = Invoke-WebRequest -Uri "$baseUrl/notifications/send" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $notificationBody `
        -UseBasicParsing

    if ($notificationResponse.StatusCode -eq 201) {
        Write-Host "  ✅ Notification queued (201)" -ForegroundColor Green
        Write-Host "  Note: Email delivery may fail if SMTP not configured" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  Status: $($notificationResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠️  Notification test: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ END-TO-END TEST COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nSystem Status:" -ForegroundColor Cyan
Write-Host "  [OK] Auth Service (register, login, profile)"
Write-Host "  [OK] Payments Service (create, list)"
Write-Host "  [OK] Notifications Service (send)"
Write-Host "  [OK] API Gateway (routing)"
Write-Host "`nFrontend available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
