# System Architecture

## Overview

Enterprise-grade distributed microservices platform demonstrating modern software engineering practices. The system is designed for scalability, maintainability, and operational excellence with complete observability and asynchronous communication patterns.

### Key Architecture Principles

- **Single Responsibility**: Each service has a well-defined, focused domain
- **Scalability**: Stateless services that can be horizontally scaled
- **Resilience**: Event-driven communication with RabbitMQ for fault tolerance
- **Type Safety**: Full TypeScript implementation across all services
- **Observability**: Comprehensive logging, metrics, and monitoring
- **Data Autonomy**: Each service owns its database (Database per Service pattern)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   API Gateway                        │
│         (NestJS + Rate Limiting + Auth)              │
└──────────────┬──────────────┬──────────────┬────────┘
               │              │              │
       ┌───────▼──────┐ ┌────▼─────┐ ┌─────▼────────┐
       │ Auth Service │ │ Payments │ │Notifications │
       │   (NestJS)   │ │ Service  │ │   Service    │
       │  PostgreSQL  │ │ MongoDB  │ │    Redis     │
       └──────┬───────┘ └────┬─────┘ └──────┬───────┘
              │              │               │
              └──────────────┴───────────────┘
                             │
                    ┌────────▼─────────┐
                    │     RabbitMQ     │
                    │  Message Broker  │
                    └──────────────────┘
```

## Components

### Auth Service

**Status**: Production Ready
**Port**: 3001
**Database**: PostgreSQL
**Technology Stack**:
- Framework: NestJS
- ORM: TypeORM
- Authentication: JWT + Passport
- Hash Algorithm: bcrypt (10 rounds)
- Message Queue: RabbitMQ

**Purpose**: 
Centralized authentication and user management for all platform users.

**Features**:
- User registration with email validation
- Secure login with JWT token generation
- Password hashing with industry-standard bcrypt
- Token validation and expiration handling
- Role-based access control foundation
- Event publishing for user lifecycle events

**Database Schema**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_isActive ON users(isActive);
```

**API Endpoints**:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| GET | `/auth/validate` | Validate JWT token | Yes |
| GET | `/users` | List all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| DELETE | `/users/:id` | Delete user | Yes |
| GET | `/health` | Health check | No |
| GET | `/metrics` | Prometheus metrics | No |

**Events Published**:

1. `user.registered`
   - **When**: User completes registration
   - **Payload**: 
   ```json
   {
     "userId": "uuid",
     "email": "user@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```
   - **Consumers**: Notifications Service (welcome email)

2. `user.login`
   - **When**: User successfully logs in
   - **Payload**:
   ```json
   {
     "userId": "uuid",
     "email": "user@example.com",
     "timestamp": "2024-01-01T00:00:00Z",
     "ipAddress": "192.168.1.1"
   }
   ```
   - **Consumers**: Logging service (audit trail)

---

### Payments Service

**Status**: Production Ready
**Port**: 3002
**Database**: MongoDB
**Technology Stack**:
- Framework: NestJS
- Database Driver: Mongoose
- Message Queue: RabbitMQ
- Transaction ID: UUID v4

**Purpose**: 
Payment processing, transaction management, and financial record keeping.

**Features**:
- Payment transaction creation and processing
- Multiple payment method support
- Payment status lifecycle management
- Unique transaction ID generation
- MongoDB document storage for flexible schema
- Event publishing for payment state changes
- Rate limiting for API protection

**Database Schema**:
```javascript
db.createCollection("payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["transactionId", "userId", "amount", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        transactionId: { bsonType: "string" },
        userId: { bsonType: "string" },
        amount: { bsonType: "decimal128" },
        currency: { bsonType: "string" },
        method: { bsonType: "string" }, // credit_card, debit_card, paypal, bank_transfer
        status: { bsonType: "string" }, // pending, completed, failed, refunded
        description: { bsonType: "string" },
        metadata: { bsonType: "object" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.payments.createIndex({ transactionId: 1 });
db.payments.createIndex({ userId: 1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ createdAt: -1 });
```

**API Endpoints**:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/payments/create` | Create new payment | Yes |
| GET | `/payments` | List payments (with filters) | Yes |
| GET | `/payments/:id` | Get payment details | Yes |
| PUT | `/payments/:id/status` | Update payment status | Yes |
| POST | `/payments/:id/process` | Process payment | Yes |
| DELETE | `/payments/:id` | Delete payment | Yes |
| GET | `/health` | Health check | No |
| GET | `/metrics` | Prometheus metrics | No |

**Payment Status Lifecycle**:
```
pending -> processing -> completed ✓
       \-> failed ✗
completed -> refunded (refund operation)
```

**Events Published**:

1. `payment.created`
   - **When**: New payment transaction created
   - **Payload**:
   ```json
   {
     "transactionId": "uuid",
     "userId": "uuid",
     "amount": "100.00",
     "currency": "USD",
     "method": "credit_card",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```

2. `payment.processed`
   - **When**: Payment processing completes
   - **Payload**:
   ```json
   {
     "transactionId": "uuid",
     "userId": "uuid",
     "status": "completed",
     "amount": "100.00",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```
   - **Consumers**: Notifications Service (confirmation email)

---

### Notifications Service

**Status**: Production Ready
**Port**: 3003
**Cache**: Redis
**Email Service**: Nodemailer
**Technology Stack**:
- Framework: NestJS
- Cache: Redis
- Email: Nodemailer
- Message Queue: RabbitMQ (consumer)
- Template Engine: Handlebars

**Purpose**: 
Email notification delivery and template management with caching for performance.

**Features**:
- HTML email template rendering
- Redis-based template caching
- Event-driven notification triggering
- Rate limiting per email (1 message/minute)
- Nodemailer SMTP integration
- Email delivery tracking
- Template versioning

**Email Templates**:

1. **Welcome Email**
   - Trigger: `user.registered`
   - Subject: Welcome to our platform
   - Variables: firstName, lastName, email

2. **Payment Confirmation**
   - Trigger: `payment.processed`
   - Subject: Payment Confirmation
   - Variables: transactionId, amount, date

3. **Payment Failed**
   - Trigger: `payment.failed`
   - Subject: Payment Failed - Action Required
   - Variables: transactionId, amount, errorMessage

**Cache Structure (Redis)**:
```
Key: templates:welcome:v1
Value: {
  subject: "Welcome...",
  html: "<html>...</html>",
  text: "...",
  version: 1,
  createdAt: "2024-01-01T00:00:00Z"
}
```

**API Endpoints**:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/notifications/send` | Send email notification | Yes |
| GET | `/notifications/stats` | Get notification statistics | Yes |
| GET | `/health` | Health check | No |
| GET | `/metrics` | Prometheus metrics | No |

**Event Listeners**:

1. `user.registered` -> Send welcome email
2. `payment.created` -> Send confirmation email
3. `payment.processed` -> Send completion email
4. `payment.failed` -> Send failure notification

---

### API Gateway

**Status**: Production Ready
**Port**: 3000
**Rate Limiting**: 100 requests/minute per IP
**Technology Stack**:
- Framework: NestJS
- HTTP Client: Axios
- Rate Limiter: @nestjs/throttler

**Purpose**: 
Single entry point providing request routing, security, and service coordination.

**Features**:
- Request routing to all backend services
- JWT authentication middleware
- Rate limiting with configurable thresholds
- CORS handling
- Centralized error handling
- Request/response logging
- Metrics aggregation from all services
- Service health monitoring
- Request transformation and validation

**Routing Rules**:

```
Client Request
      |
      v
  API Gateway
      |
      +-- /auth/* -------> Auth Service (3001)
      +-- /payments/* -----> Payments Service (3002)
      +-- /notifications/* -> Notifications Service (3003)
      +-- /health -------> Aggregated Health Check
      +-- /metrics -------> Prometheus Metrics
```

**API Endpoints**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Aggregated health status from all services |
| GET | `/health/auth` | Auth Service health |
| GET | `/health/payments` | Payments Service health |
| GET | `/health/notifications` | Notifications Service health |
| GET | `/metrics` | Prometheus metrics aggregation |
| POST | `/auth/*` | Proxy to Auth Service |
| POST | `/payments/*` | Proxy to Payments Service |
| POST | `/notifications/*` | Proxy to Notifications Service |

**Rate Limiting Configuration**:
- Default: 100 requests per minute per IP
- Can be customized per endpoint
- Returns 429 (Too Many Requests) when exceeded
- Includes Retry-After header

---

## Communication Patterns

### Synchronous Communication (Request-Response)

Used for immediate responses:

```
Client -> API Gateway -> Microservice -> Database
                            |
                            v
                        Response
```

**Advantages**:
- Immediate feedback
- Simple error handling
- Easy to debug

**Use Cases**:
- REST API calls
- Real-time data queries
- Authentication checks

**Example**:
```
GET /auth/profile
200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John"
}
```

### Asynchronous Communication (Event-Driven)

Used for decoupled, eventual consistency:

```
Service A -> RabbitMQ (Event) -> Service B
                  |
                  +-> Service C
                  |
                  +-> Service D
```

**Advantages**:
- Loose coupling
- Better scalability
- Fault tolerance
- Parallel processing

**Use Cases**:
- User notifications
- Data consistency across services
- Audit logging
- Background processing

**Example**:
```
Auth Service publishes:
{
  "type": "user.registered",
  "userId": "uuid",
  "email": "user@example.com"
}

Notifications Service receives:
- Sends welcome email
- Updates user preferences

Logging Service receives:
- Records event in audit log
```

---

## Event-Driven Architecture

### Event Flow Diagram

```
Auth Service         Payments Service       Notifications Service
     |                     |                         |
     +-- user.registered --+-- RabbitMQ --+-- Email: Welcome
     |                     |              |
     +-- user.login -------+              +-- Log: User Activity
                           |
                  payment.created
                           |
                    RabbitMQ Queue
                           |
                 Notifications Service
                           |
                  Email: Payment Confirmation
```

### Event Registry

**Managed Events**:
1. `user.registered` - Auth Service -> Notifications
2. `user.login` - Auth Service -> Logging
3. `payment.created` - Payments -> Notifications
4. `payment.processed` - Payments -> Notifications
5. `payment.failed` - Payments -> Notifications

**Event Properties**:
- Unique ID (for deduplication)
- Timestamp (UTC ISO 8601)
- Event Type (semantic versioning)
- Payload (event data)
- Source (originating service)
- Correlation ID (for tracing)

---

## Observability

### Logging Strategy

**Log Levels**:
- `error`: System failures requiring immediate attention
- `warn`: Potential issues that should be reviewed
- `info`: General informational messages
- `debug`: Detailed debugging information

**Log Format** (JSON):
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "info",
  "service": "auth-service",
  "message": "User registered successfully",
  "userId": "uuid",
  "correlationId": "trace-id",
  "duration": "45ms"
}
```

**Log Storage**:
- `logs/error.log`: Error and warning messages
- `logs/combined.log`: All log levels
- Rotation: Daily, max 30 days retention

### Metrics Collection

**Prometheus Endpoints**:
- Auth Service: http://localhost:3001/metrics
- Payments Service: http://localhost:3002/metrics
- Notifications Service: http://localhost:3003/metrics
- API Gateway: http://localhost:3000/metrics

**Key Metrics**:

| Metric | Type | Purpose |
|--------|------|---------|
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | Request latency |
| `http_errors_total` | Counter | Error count by endpoint |
| `db_connections` | Gauge | Active database connections |
| `rabbitmq_messages` | Counter | Message count |
| `cache_hits` | Counter | Cache hit rate |

### Monitoring Dashboard (Grafana)

Access at: http://localhost:3004 (admin/admin)

**Available Dashboards**:
1. System Overview - Global health and metrics
2. Service Performance - Request rates and latencies
3. Error Analysis - Error rates and types
4. Database Metrics - Connection pools and queries
5. Message Queue - RabbitMQ depth and throughput
6. Business Metrics - Domain-specific KPIs

---

## Database Strategy

### Polyglot Persistence Pattern

Each service uses the database best suited for its domain:

| Service | Database | Reason | Scale |
|---------|----------|--------|-------|
| Auth Service | PostgreSQL | ACID compliance, relational data, user management | Single region |
| Payments Service | MongoDB | Flexible schema, high write throughput, transactions | Replicated |
| Notifications Service | Redis | Cache, high-speed lookups, template storage | In-memory |

### Database per Service Pattern

```
Auth Service
    |
    +-- PostgreSQL (owns users table)
    |
Payments Service
    |
    +-- MongoDB (owns payments collection)
    |
Notifications Service
    |
    +-- Redis (owns template cache)
```

**Constraints**:
- No cross-database joins
- Data consistency through events
- No direct database access between services
- Each service manages its own migrations

### Data Consistency Strategy

**Eventual Consistency via Events**:
1. Service A modifies its data
2. Publishes event to RabbitMQ
3. Service B receives event
4. Service B updates its local data
5. System reaches consistent state

**Benefits**:
- Loose coupling
- High availability
- Scalability

**Trade-offs**:
- Eventual consistency (not immediate)
- Complex error handling
- Requires idempotent operations

---

## Security Architecture

### Authentication Flow

```
1. Client sends credentials
   POST /auth/login
   { "email": "user@example.com", "password": "..." }

2. Auth Service validates
   - Check email exists
   - Verify bcrypt password hash
   - Generate JWT token

3. API Gateway validates
   - Check JWT signature
   - Verify token expiration
   - Extract user claims

4. Service validates
   - Verify authorization (roles/permissions)
   - Log access

5. Response with JWT
   { "token": "eyJhbGc..." }
```

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user-id",
  "email": "user@example.com",
  "iat": 1672531200,
  "exp": 1672617600
}

Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### Password Security

- **Algorithm**: bcrypt with 10 salt rounds
- **Storage**: Hashed passwords only (never plaintext)
- **Validation**: Industry-standard timing-safe comparison
- **Requirements**: Configurable length and complexity

### Network Security

- **CORS**: Configured for authorized origins
- **Rate Limiting**: 100 requests/minute per IP
- **HTTPS**: Required in production
- **Headers**: Security headers configured

---

## Scalability Design

### Horizontal Scaling

**Stateless Services**:
- Each service instance is identical
- No local session storage
- Can be added/removed dynamically
- Load balanced behind API Gateway

**Scaling Example**:
```
     Load Balancer
           |
     +-----+-----+
     |     |     |
   Auth1 Auth2 Auth3  (3 instances)
     |     |     |
     +-----+-----+
           |
      PostgreSQL (shared)
```

### Load Balancing

- API Gateway distributes requests
- Round-robin by default
- Health checks for service discovery
- Automatic failover on service failure

### Database Scaling

- **PostgreSQL**: Vertical scaling, read replicas
- **MongoDB**: Sharding, replication sets
- **Redis**: Cluster mode, replication

### Message Queue Scaling

RabbitMQ ensures reliable delivery:
- Durable queues persist messages
- Multiple consumers for load distribution
- Dead letter queues for failed messages
- Priority queues for important events

---

## Deployment Architecture

### Container Strategy

```
Docker Image Hierarchy:
    |
    +-- auth-service:latest
    +-- payments-service:latest
    +-- notifications-service:latest
    +-- api-gateway:latest
```

### Docker Compose Orchestration

Local development environment:
- 4 application services
- PostgreSQL database
- MongoDB database
- Redis cache
- RabbitMQ broker
- Prometheus monitoring
- Grafana dashboards

### CI/CD Pipeline (Future)

```
Code Push
    |
    v
GitHub Actions
    |
    +-- Run Tests
    |
    +-- Build Docker Images
    |
    +-- Push to Registry
    |
    +-- Deploy to Staging
    |
    +-- Run E2E Tests
    |
    +-- Deploy to Production
```

---

## Technology Decisions

### Why NestJS?

- Full TypeScript support
- Dependency injection framework
- Built-in validation and serialization
- Middleware/guard/interceptor patterns
- Excellent documentation
- Active community and ecosystem

### Why PostgreSQL for Auth?

- ACID compliance for user data integrity
- Relational schema suits user/role hierarchy
- Battle-tested for security
- Excellent JSON support
- Transaction support

### Why MongoDB for Payments?

- Flexible schema for different payment types
- High write throughput
- Built-in transactions (4.0+)
- Horizontal scaling via sharding
- Good for time-series payment data

### Why Redis for Cache?

- Sub-millisecond latency
- In-memory data structure store
- Excellent for template caching
- Supports complex data types
- Pub/Sub messaging

### Why RabbitMQ?

- Reliable message delivery
- Durable queues
- Flexible routing patterns
- Dead letter queues
- Cluster support for HA

---

## Future Enhancements

### Planned Features

- [ ] Service mesh (Istio) for advanced traffic management
- [ ] Distributed tracing (Jaeger) for request tracking
- [ ] Circuit breakers for fault tolerance
- [ ] CQRS pattern for read/write separation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Role-based access control (RBAC)
- [ ] Multi-tenancy support
- [ ] Data encryption at rest
- [ ] Backup and disaster recovery
- [ ] Kubernetes deployment manifests
- [ ] Automated scaling policies
- [ ] Custom business metrics

---

## Disaster Recovery

### Backup Strategy

- Daily automated backups
- Offsite backup storage
- Point-in-time recovery capability
- Regular restore testing

### High Availability

- Multi-instance services
- Database replication
- Load balancing
- Health checks and auto-failover

### Business Continuity

- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes
- Documented runbooks
- Regular disaster recovery drills