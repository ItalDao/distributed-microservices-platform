# Environment Configuration Guide

Complete guide for configuring environment variables for all services in the Distributed Microservices Platform.

---

## Overview

Each service requires specific environment variables for proper operation. Configuration can be provided via:

1. `.env` files (local development)
2. Environment variables (Docker, Kubernetes)
3. Secrets management (production)

> [!IMPORTANT]
> Use placeholders in documentation. Store real secrets only in local .env or a secrets manager.

---

## Auth Service Configuration

**File**: `services/auth-service/.env`

```bash
# Application Configuration
NODE_ENV=development                          # development, staging, production
PORT=3001                                     # Service port
LOG_LEVEL=debug                               # debug, info, warn, error

# Database Configuration
DATABASE_HOST=localhost                       # PostgreSQL host
DATABASE_PORT=5432                            # PostgreSQL port
DATABASE_USER=postgres                        # Database username
DATABASE_PASSWORD=postgres                    # Database password
DATABASE_NAME=auth_service                    # Database name
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_service
DATABASE_SSL=false                            # Enable SSL for production
DATABASE_POOL_MIN=2                           # Minimum connections
DATABASE_POOL_MAX=20                          # Maximum connections

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRATION=24h                            # Token expiration time
JWT_REFRESH_EXPIRATION=7d                     # Refresh token expiration

# RabbitMQ Configuration
RABBITMQ_HOST=localhost                       # RabbitMQ host
RABBITMQ_PORT=5672                            # RabbitMQ port
RABBITMQ_USER=guest                           # RabbitMQ username
RABBITMQ_PASSWORD=guest                       # RabbitMQ password
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=events                      # Event exchange name

# Password Security
BCRYPT_ROUNDS=10                              # Bcrypt salt rounds (8-12)
PASSWORD_MIN_LENGTH=8                         # Minimum password length
PASSWORD_REQUIRE_UPPERCASE=true               # Require uppercase letters
PASSWORD_REQUIRE_NUMBERS=true                 # Require numbers
PASSWORD_REQUIRE_SPECIAL=true                 # Require special characters

# Logging
LOG_FORMAT=json                                # json or text
LOG_RETENTION_DAYS=30                         # Log file retention

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true                         # Allow credentials
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS     # Allowed methods

# Monitoring
PROMETHEUS_ENABLED=true                       # Enable Prometheus metrics
METRICS_PORT=9090                             # Metrics port

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com                      # SMTP server
SMTP_PORT=587                                 # SMTP port
SMTP_USER=your-email@gmail.com               # SMTP username
SMTP_PASSWORD=your-app-password               # SMTP password
SMTP_FROM=noreply@example.com                # From email address
```

**Environment Variable Types**:

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| NODE_ENV | string | development | Controls logging and error messages |
| PORT | number | 3001 | Must be unique across services |
| DATABASE_URL | string | postgresql://... | Connection string format |
| JWT_EXPIRATION | string | 24h | Uses ms format: 30s, 5m, 24h |
| BCRYPT_ROUNDS | number | 10 | Higher = slower but more secure |
| CORS_ORIGINS | string | url1,url2 | Comma-separated list |

---

## Payments Service Configuration

**File**: `services/payments-service/.env`

```bash
# Application Configuration
NODE_ENV=development
PORT=3002
LOG_LEVEL=debug

# MongoDB Configuration
MONGODB_HOST=localhost                        # MongoDB host
MONGODB_PORT=27017                            # MongoDB port
MONGODB_USER=payments_user                    # MongoDB username
MONGODB_PASSWORD=payments_password            # MongoDB password
MONGODB_DATABASE=payments_db                  # Database name
MONGODB_URL=mongodb://payments_user:payments_password@localhost:27017/payments_db
MONGODB_REPLICA_SET=                          # Replica set name (optional)
MONGODB_SSL=false                             # Enable SSL for production
MONGODB_POOL_MIN=2                            # Minimum connections
MONGODB_POOL_MAX=50                           # Maximum connections

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=events

# Payment Configuration
PAYMENT_PROCESSING_TIMEOUT=30000              # Timeout in ms
PAYMENT_MAX_AMOUNT=1000000                    # Maximum payment amount
PAYMENT_MIN_AMOUNT=0.01                       # Minimum payment amount
TRANSACTION_ID_PREFIX=TXN                     # Transaction ID prefix

# Supported Payment Methods
PAYMENT_METHODS=credit_card,debit_card,paypal,bank_transfer
PAYMENT_STATUSES=pending,completed,failed,refunded

# Rate Limiting
RATE_LIMIT_WINDOW=60000                       # Time window in ms
RATE_LIMIT_MAX_REQUESTS=100                   # Max requests per window

# Logging
LOG_FORMAT=json
LOG_RETENTION_DAYS=30

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9091

# Webhook Configuration (optional)
WEBHOOK_ENABLED=false
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_TIMEOUT=5000
```

---

## Notifications Service Configuration

**File**: `services/notifications-service/.env`

```bash
# Application Configuration
NODE_ENV=development
PORT=3003
LOG_LEVEL=debug

# Redis Configuration
REDIS_HOST=localhost                          # Redis host
REDIS_PORT=6379                               # Redis port
REDIS_PASSWORD=                                # Redis password (if required)
REDIS_DATABASE=0                              # Redis database index
REDIS_URL=redis://localhost:6379
REDIS_KEY_PREFIX=notif:                       # Key prefix for cache

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com                      # Email server host
SMTP_PORT=587                                 # SMTP port (usually 587 or 465)
SMTP_SECURE=true                              # Use TLS/SSL
SMTP_USER=your-email@gmail.com               # SMTP username
SMTP_PASSWORD=your-app-password               # SMTP password or app-specific password
SMTP_FROM=noreply@example.com                # From email address
SMTP_FROM_NAME=Notifications                  # From display name
SMTP_REPLY_TO=support@example.com            # Reply-to address

# Email Template Configuration
EMAIL_TEMPLATES_CACHE_TTL=3600                # Cache TTL in seconds
EMAIL_TEMPLATES_PATH=./templates              # Template file path
EMAIL_TEMPLATE_ENGINE=handlebars              # Template engine

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=events
RABBITMQ_QUEUE=notifications                  # Queue name
RABBITMQ_PREFETCH=10                          # Prefetch count

# Notification Configuration
NOTIFICATION_RATE_LIMIT=60000                 # Time between notifications (ms)
NOTIFICATION_RETRY_ATTEMPTS=3                 # Retry attempts for failures
NOTIFICATION_TIMEOUT=10000                    # Timeout in ms
MAX_CONCURRENT_SENDS=10                       # Concurrent email sends

# Email Validation
EMAIL_VALIDATION_ENABLED=true
EMAIL_DOUBLE_OPT_IN=false                     # Require confirmation

# Logging
LOG_FORMAT=json
LOG_RETENTION_DAYS=30

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9092

# Webhooks (optional)
WEBHOOK_ENABLED=false
WEBHOOK_URL=https://example.com/webhooks/emails
WEBHOOK_SIGN_KEY=your-signature-key
```

---

## API Gateway Configuration

**File**: `services/api-gateway/.env`

```bash
# Application Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Microservice URLs
AUTH_SERVICE_URL=http://localhost:3001        # Auth Service URL
PAYMENTS_SERVICE_URL=http://localhost:3002    # Payments Service URL
NOTIFICATIONS_SERVICE_URL=http://localhost:3003 # Notifications Service URL

# Service Timeouts
SERVICE_TIMEOUT=30000                         # Service call timeout (ms)
SERVICE_CONNECT_TIMEOUT=5000                  # Connection timeout (ms)

# JWT Configuration (validation)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_VALIDATION_ENABLED=true                   # Enable JWT validation
JWT_PUBLIC_KEY_PATH=/etc/certs/public.key     # Public key path (optional)

# Rate Limiting
RATE_LIMIT_WINDOW=60000                       # Time window in ms
RATE_LIMIT_MAX_REQUESTS=100                   # Max requests per IP
RATE_LIMIT_SKIP_PATHS=/health,/metrics        # Paths to skip rate limiting
RATE_LIMIT_STORAGE=memory                     # memory, redis

# Redis Configuration (for rate limiting)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_URL=redis://localhost:6379

# CORS Configuration
CORS_ENABLED=true
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:4201
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
CORS_CREDENTIALS=true
CORS_MAX_AGE=3600

# Security Headers
SECURITY_HEADERS_ENABLED=true
HSTS_MAX_AGE=31536000                         # HTTP Strict Transport Security
CONTENT_SECURITY_POLICY=default-src 'self'

# Request/Response Configuration
REQUEST_BODY_LIMIT=10mb                       # Maximum request size
REQUEST_TIMEOUT=30000                         # Request timeout (ms)
COMPRESSION_ENABLED=true                      # Enable gzip compression
COMPRESSION_THRESHOLD=1kb                     # Compress responses > 1kb

# Logging
LOG_FORMAT=json
LOG_RETENTION_DAYS=30
LOG_REQUESTS=true                             # Log all requests
LOG_SENSITIVE_DATA=false                      # Don't log passwords/tokens

# Service Discovery
SERVICE_DISCOVERY_ENABLED=false               # Dynamic service discovery
SERVICE_DISCOVERY_INTERVAL=30000              # Discovery interval (ms)

# Circuit Breaker Configuration
CIRCUIT_BREAKER_ENABLED=true
CIRCUIT_BREAKER_THRESHOLD=5                   # Failure threshold
CIRCUIT_BREAKER_TIMEOUT=60000                 # Reset timeout (ms)

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9093

# Health Check Configuration
HEALTH_CHECK_INTERVAL=30000                   # Health check interval (ms)
HEALTH_CHECK_TIMEOUT=5000                     # Health check timeout (ms)
```

---

## Docker Environment Configuration

**File**: `infrastructure/.env`

```bash
# Database Services
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=auth_service
POSTGRES_INITDB_ARGS=-c max_connections=200 -c shared_buffers=512MB

MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=root
MONGO_INITDB_DATABASE=payments_db

# Redis
REDIS_PASSWORD=
REDIS_APPENDONLY=yes
REDIS_APPENDFSYNC=everysec

# RabbitMQ
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
RABBITMQ_DEFAULT_VHOST=/

# Prometheus
PROMETHEUS_RETENTION=15d                      # Data retention
PROMETHEUS_SCRAPE_INTERVAL=15s                # Scrape interval

# Grafana
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=admin
GF_USERS_ALLOW_SIGN_UP=false
```

---

## Production Environment

**File**: `.env.production` (Never commit to version control)

```bash
# Application Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn                                # Reduce logs in production

# Database Configuration (Use managed services - NEVER commit real credentials!)
AUTH_DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@<HOST>:5432/auth_db
PAYMENTS_DATABASE_URL=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/payments_db
REDIS_URL=redis://:<PASSWORD>@<HOST>:6379

# JWT Configuration
JWT_SECRET=<GENERATE_SECURE_32_CHAR_SECRET>
JWT_EXPIRATION=24h

# Microservice URLs (Internal DNS)
AUTH_SERVICE_URL=http://auth-service.internal:3001
PAYMENTS_SERVICE_URL=http://payments-service.internal:3002
NOTIFICATIONS_SERVICE_URL=http://notifications-service.internal:3003

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_STORAGE=redis                      # Use Redis in production

# CORS Configuration
CORS_ORIGINS=https://app.example.com,https://www.example.com
CORS_CREDENTIALS=true

# Security
HTTPS_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/server.crt
SSL_KEY_PATH=/etc/ssl/private/server.key

# SMTP Configuration
SMTP_HOST=smtp-production.example.com
SMTP_PORT=587
SMTP_USER=production-email@example.com
SMTP_PASSWORD=production-email-password

# Monitoring
PROMETHEUS_ENABLED=true
PROMETHEUS_RETENTION=90d                      # Longer retention in production

# Secrets Management
VAULT_ENABLED=true                            # Use HashiCorp Vault
VAULT_ADDR=https://vault.example.com:8200
VAULT_TOKEN=s.xxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Secrets Management

### Using HashiCorp Vault

```bash
# Store secrets in Vault
vault kv put secret/microservices/auth-service \
  DATABASE_PASSWORD=secure_db_password \
  JWT_SECRET=secure_jwt_secret

# Load secrets in application
const dbPassword = await vaultClient.read('secret/microservices/auth-service');
```

### Using AWS Secrets Manager

```bash
# Store secrets
aws secretsmanager create-secret \
  --name auth-service/database-password \
  --secret-string "secure_db_password"

# Retrieve secrets
aws secretsmanager get-secret-value \
  --secret-id auth-service/database-password
```

### Using Kubernetes Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: auth-service-secrets
type: Opaque
stringData:
  DATABASE_PASSWORD: secure_db_password
  JWT_SECRET: secure_jwt_secret
```

---

## Environment-Specific Configurations

### Development

```bash
NODE_ENV=development
LOG_LEVEL=debug
DEBUG=*                                       # Enable debug mode
DATABASE_SSL=false
CORS_ORIGINS=*                                # Allow all origins
```

### Staging

```bash
NODE_ENV=staging
LOG_LEVEL=info
DATABASE_SSL=true
CORS_ORIGINS=https://staging.example.com
RATE_LIMIT_MAX_REQUESTS=500
```

### Production

```bash
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_SSL=true
CORS_ORIGINS=https://app.example.com
RATE_LIMIT_MAX_REQUESTS=1000
CIRCUIT_BREAKER_ENABLED=true
HEALTH_CHECK_ENABLED=true
```

---

## Configuration Best Practices

### Security

1. **Never commit `.env` files to version control**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Use strong secrets** (minimum 32 characters for JWT)
   ```bash
   # Generate secure random secret
   openssl rand -base64 32
   ```

3. **Rotate secrets regularly**
   - Database passwords: quarterly
   - JWT secrets: annually or on breach
   - API keys: when credentials exposed

4. **Use environment-specific secrets**
   - Never use production secrets in development
   - Use separate databases per environment

### Configuration Loading

```typescript
// Load configuration with validation
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  PORT: number;
}

export async function validateConfig(config: Record<string, any>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config);
  const errors = await validate(validatedConfig);

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors}`);
  }

  return validatedConfig;
}
```

### Configuration Hierarchy

Priority order (highest to lowest):
1. Environment variables
2. `.env.{NODE_ENV}.local` file
3. `.env.local` file
4. `.env` file
5. Default values in code

---

## Troubleshooting

### Common Configuration Issues

**Database Connection Fails**:
```bash
# Check connection string format
# PostgreSQL: postgresql://user:password@host:port/database
# MongoDB: mongodb://user:password@host:port/database

# Test connection
psql $DATABASE_URL
mongo $MONGODB_URL
```

**JWT Validation Fails**:
```bash
# Ensure JWT_SECRET is at least 32 characters
# Check token expiration
# Verify secret matches across all services
```

**CORS Errors**:
```bash
# Check CORS_ORIGINS includes your client URL
# Verify CORS_CREDENTIALS setting
# Clear browser cache
```

**Rate Limiting Issues**:
```bash
# Check RATE_LIMIT_STORAGE is properly configured
# Verify Redis connection if using Redis
# Review RATE_LIMIT_WINDOW and MAX_REQUESTS values
```

---

## Configuration Templates

### Development Template

Copy to `.env`:
```bash
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
MONGODB_URL=mongodb://localhost:27017/payments_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_SECRET=dev-secret-key-min-32-characters-long-test-key
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
```

### Production Secrets (Vault/Secrets Manager)

```bash
# Store in secure location, never in code
auth-service/db-password
auth-service/jwt-secret
payments-service/db-password
notifications-service/smtp-password
api-gateway/jwt-secret
```

---

## Documentation

For service-specific configuration, see:
- [Auth Service Configuration](../services/auth-service/README.md)
- [Payments Service Configuration](../services/payments-service/README.md)
- [Notifications Service Configuration](../services/notifications-service/README.md)
- [API Gateway Configuration](../services/api-gateway/README.md)
- [Deployment Guide](./deployment.md)
