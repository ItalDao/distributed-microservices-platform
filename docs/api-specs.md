# API Specifications

Complete API documentation for all microservices in the Distributed Microservices Platform.

**Base URL**: http://localhost:3000 (via API Gateway)

> [!NOTE]
> Use the API Gateway base URL for all client requests.

> [!WARNING]
> Protected endpoints require a valid JWT in the Authorization header.

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Payments API](#payments-api)
3. [Notifications API](#notifications-api)
4. [Health Check API](#health-check-api)
5. [Common Response Formats](#common-response-formats)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Authentication API

**Base Service**: Auth Service
**Base Path**: `/auth`
**Authentication**: JWT Bearer Token (for protected endpoints)

### User Registration

**Endpoint**: `POST /auth/register`

**Description**: Register a new user account

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules**:
- `email`: Valid email format, unique in database
- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, special character
- `firstName`: String, 1-100 characters
- `lastName`: String, 1-100 characters

**Response Status**: 201 Created

**Response Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (see error details)
- `409 Conflict`: Email already exists
- `500 Internal Server Error`: Server error

**cURL Example**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### User Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and obtain JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Validation**:
- `email`: Valid email format
- `password`: Non-empty string

**Response Status**: 200 OK

**Response Body**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Token Details**:
- **Type**: JWT (JSON Web Token)
- **Algorithm**: HS256
- **Expiration**: 24 hours
- **Usage**: Include in Authorization header as `Bearer {token}`

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

**cURL Example**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### Get User Profile

**Endpoint**: `GET /auth/profile`

**Description**: Retrieve authenticated user's profile

**Authentication**: Required (Bearer Token)

**Request Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Response Status**: 200 OK

**Response Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

**cURL Example**:
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json"
```

---

### Validate JWT Token

**Endpoint**: `GET /auth/validate`

**Description**: Validate and decode JWT token

**Authentication**: Required (Bearer Token)

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Response Status**: 200 OK

**Response Body**:
```json
{
  "valid": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "expiresAt": "2024-01-02T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Server error

---

### List All Users

**Endpoint**: `GET /auth/users`

**Description**: Retrieve list of all users (admin endpoint)

**Authentication**: Required (Bearer Token)

**Query Parameters**:
```
?page=1&limit=10&sort=createdAt&order=desc
```

**Response Status**: 200 OK

**Response Body**:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user1@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "email": "user2@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "isActive": true,
      "createdAt": "2024-01-01T13:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### Get User by ID

**Endpoint**: `GET /auth/users/{userId}`

**Description**: Retrieve specific user details

**Authentication**: Required (Bearer Token)

**Path Parameters**:
- `userId` (string, UUID): User identifier

**Response Status**: 200 OK

**Response Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

### Delete User

**Endpoint**: `DELETE /auth/users/{userId}`

**Description**: Delete user account (admin operation)

**Authentication**: Required (Bearer Token)

**Path Parameters**:
- `userId` (string, UUID): User identifier

**Response Status**: 200 OK

**Response Body**:
```json
{
  "message": "User deleted successfully",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

## Payments API

**Base Service**: Payments Service
**Base Path**: `/payments`
**Authentication**: JWT Bearer Token (for all endpoints)

### Create Payment

**Endpoint**: `POST /payments/create`

**Description**: Create new payment transaction

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": "99.99",
  "currency": "USD",
  "method": "credit_card",
  "description": "Purchase subscription"
}
```

**Field Descriptions**:
- `userId`: Unique user identifier (UUID)
- `amount`: Payment amount (decimal, 2 decimal places)
- `currency`: ISO 4217 currency code (USD, EUR, etc.)
- `method`: Payment method (credit_card, debit_card, paypal, bank_transfer)
- `description`: Optional transaction description

**Response Status**: 201 Created

**Response Body**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "transactionId": "TXN-2024-001-550e8400",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": "99.99",
  "currency": "USD",
  "method": "credit_card",
  "status": "pending",
  "description": "Purchase subscription",
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid payment data
- `401 Unauthorized`: Missing or invalid token
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

**cURL Example**:
```bash
curl -X POST http://localhost:3000/payments/create \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": "99.99",
    "currency": "USD",
    "method": "credit_card",
    "description": "Purchase subscription"
  }'
```

---

### List Payments

**Endpoint**: `GET /payments`

**Description**: Retrieve payments with optional filtering

**Authentication**: Required

**Query Parameters**:
```
?userId={userId}&status={status}&page=1&limit=10&sort=createdAt&order=desc
```

**Supported Filters**:
- `userId`: Filter by user ID
- `status`: Filter by payment status (pending, completed, failed, refunded)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field (createdAt, amount, status)
- `order`: Sort order (asc, desc)

**Response Status**: 200 OK

**Response Body**:
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "transactionId": "TXN-2024-001-550e8400",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": "99.99",
      "currency": "USD",
      "method": "credit_card",
      "status": "completed",
      "description": "Purchase subscription",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**cURL Example**:
```bash
curl -X GET "http://localhost:3000/payments?userId=550e8400-e29b-41d4-a716-446655440000&status=completed&limit=10" \
  -H "Authorization: Bearer {accessToken}"
```

---

### Get Payment by ID

**Endpoint**: `GET /payments/{paymentId}`

**Description**: Retrieve payment details

**Authentication**: Required

**Path Parameters**:
- `paymentId`: Payment record ID

**Response Status**: 200 OK

**Response Body**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "transactionId": "TXN-2024-001-550e8400",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": "99.99",
  "currency": "USD",
  "method": "credit_card",
  "status": "completed",
  "description": "Purchase subscription",
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Payment not found
- `500 Internal Server Error`: Server error

---

### Update Payment Status

**Endpoint**: `PUT /payments/{paymentId}/status`

**Description**: Update payment status (admin operation)

**Authentication**: Required

**Request Body**:
```json
{
  "status": "completed"
}
```

**Valid Status Values**:
- `pending`: Initial state
- `completed`: Successfully processed
- `failed`: Transaction failed
- `refunded`: Payment refunded

**Response Status**: 200 OK

**Response Body**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "transactionId": "TXN-2024-001-550e8400",
  "status": "completed",
  "updatedAt": "2024-01-01T12:05:00Z"
}
```

---

### Process Payment

**Endpoint**: `POST /payments/{paymentId}/process`

**Description**: Process payment (simulate approval/rejection)

**Authentication**: Required

**Request Body**:
```json
{
  "action": "approve",
  "notes": "Manual approval"
}
```

**Valid Actions**:
- `approve`: Approve the payment
- `reject`: Reject the payment

**Response Status**: 200 OK

**Response Body**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "transactionId": "TXN-2024-001-550e8400",
  "status": "completed",
  "processedAt": "2024-01-01T12:05:00Z",
  "action": "approve"
}
```

---

### Delete Payment

**Endpoint**: `DELETE /payments/{paymentId}`

**Description**: Delete payment record

**Authentication**: Required

**Response Status**: 200 OK

**Response Body**:
```json
{
  "message": "Payment deleted successfully",
  "paymentId": "660e8400-e29b-41d4-a716-446655440001"
}
```

---

## Notifications API

**Base Service**: Notifications Service
**Base Path**: `/notifications`
**Authentication**: JWT Bearer Token (optional for public endpoints)

### Send Notification

**Endpoint**: `POST /notifications/send`

**Description**: Send email notification

**Authentication**: Optional

**Request Body**:
```json
{
  "email": "user@example.com",
  "type": "welcome",
  "data": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Notification Types**:
- `welcome`: Welcome email for new users
- `payment_confirmation`: Payment confirmation email
- `payment_failure`: Payment failure notification
- `custom`: Custom notification with template

**Template Variables** (by type):
- `welcome`: firstName, lastName, email
- `payment_confirmation`: transactionId, amount, date
- `payment_failure`: transactionId, amount, reason

**Response Status**: 200 OK

**Response Body**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "email": "user@example.com",
  "type": "welcome",
  "status": "sent",
  "sentAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email or notification type
- `429 Too Many Requests`: Rate limit exceeded (1 per minute per email)
- `500 Internal Server Error`: Server error

**cURL Example**:
```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "type": "welcome",
    "data": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }'
```

---

### Get Notification Statistics

**Endpoint**: `GET /notifications/stats`

**Description**: Retrieve notification statistics

**Query Parameters**:
```
?type={type}&startDate={date}&endDate={date}
```

**Response Status**: 200 OK

**Response Body**:
```json
{
  "totalSent": 1500,
  "successfullyDelivered": 1450,
  "failed": 50,
  "bounced": 0,
  "byType": {
    "welcome": {
      "sent": 500,
      "delivered": 490,
      "failed": 10
    },
    "payment_confirmation": {
      "sent": 1000,
      "delivered": 960,
      "failed": 40
    }
  },
  "last30Days": {
    "sent": 300,
    "delivered": 290,
    "deliveryRate": "96.67%"
  }
}
```

---

## Health Check API

**Endpoint**: `GET /health`

**Description**: Get aggregated health status of all services

**Authentication**: Not required

**Response Status**: 200 OK (if healthy) or 503 Service Unavailable

**Response Body**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "auth": {
      "status": "healthy",
      "responseTime": "45ms"
    },
    "payments": {
      "status": "healthy",
      "responseTime": "52ms"
    },
    "notifications": {
      "status": "healthy",
      "responseTime": "38ms"
    }
  },
  "dependencies": {
    "database": "connected",
    "cache": "connected",
    "messageQueue": "connected"
  }
}
```

**Service-Specific Health Checks**:

- `GET /auth/health` - Auth Service health
- `GET /payments/health` - Payments Service health
- `GET /notifications/health` - Notifications Service health

---

## Metrics API

**Endpoint**: `GET /metrics`

**Description**: Get Prometheus metrics

**Content-Type**: text/plain

**Response Status**: 200 OK

**Response Format**: Prometheus text format

**Example Metrics**:
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{endpoint="/auth/login",method="POST",status="200"} 1500

# HELP http_request_duration_seconds HTTP request latency
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{endpoint="/auth/login",le="0.1"} 1200
```

---

## Common Response Formats

### Success Response

**Status Code**: 200, 201, 204

**Format**:
```json
{
  "data": {...},
  "message": "Operation successful",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### Error Response

**Status Code**: 400, 401, 403, 404, 422, 500, etc.

**Format**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/auth/register"
}
```

### Pagination Response

**Format**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Error Handling

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 422 | Input validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

### Error Response Example

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred",
    "details": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      },
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/auth/register",
  "requestId": "req-550e8400-e29b-41d4"
}
```

---

## Rate Limiting

### Policy

- **Limit**: 100 requests per minute per IP address
- **Header**: `X-RateLimit-Limit: 100`
- **Remaining**: `X-RateLimit-Remaining: 95`
- **Reset**: `X-RateLimit-Reset: 1704110400`

### Rate Limit Exceeded Response

**Status**: 429 Too Many Requests

**Response**:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  },
  "headers": {
    "Retry-After": "60",
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": "1704110400"
  }
}
```

---

## Authentication

### JWT Bearer Token

Include JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Structure

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "iat": 1704024000,
  "exp": 1704110400
}
```

---

## CORS Configuration

Allowed origins (configurable):
- http://localhost:3000
- http://localhost:3001
- http://localhost:3002
- http://localhost:3003
- http://localhost:4200 (Angular default)

Allowed methods: GET, POST, PUT, DELETE, OPTIONS

Allowed headers: Content-Type, Authorization

---

## API Versioning

Current API version: v1

Future versions will be supported via path:
- `/v1/auth/...` - Current version
- `/v2/auth/...` - Future version (when released)

Deprecated endpoints will provide migration guides in response headers.

---

## Best Practices

1. **Always include Authentication headers** for protected endpoints
2. **Use appropriate HTTP methods**: GET (retrieve), POST (create), PUT (update), DELETE (delete)
3. **Handle rate limiting** with exponential backoff
4. **Validate input** before sending requests
5. **Use pagination** for large result sets
6. **Check response status** before processing data
7. **Log request IDs** for debugging
8. **Implement retry logic** for transient failures
9. **Keep tokens secure** and never expose in logs
10. **Follow HTTP status codes** meanings

---

## Support

For API issues or questions:
- GitHub Issues: https://github.com/ItalDao/distributed-microservices-platform/issues
- Documentation: https://github.com/ItalDao/distributed-microservices-platform/docs
- Author: [@ItalDao](https://github.com/ItalDao)
