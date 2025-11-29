# System Architecture

## Overview

This is a distributed microservices platform demonstrating enterprise-grade architecture patterns and best practices.

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

### Auth Service (IMPLEMENTED)

**Purpose**: Centralized authentication and user management

**Technology Stack**:
- Framework: NestJS
- Database: PostgreSQL
- ORM: TypeORM
- Authentication: JWT + Passport
- Message Queue: RabbitMQ

**Features**:
- User registration with email/password
- Login with JWT token generation
- Token validation
- Password hashing with bcrypt
- Protected routes with JWT guards
- Event publishing (user.registered, user.login)

**Database Schema**:
```sql
Table: users
- id: UUID (Primary Key)
- email: VARCHAR (Unique)
- password: VARCHAR (Hashed)
- firstName: VARCHAR
- lastName: VARCHAR
- isActive: BOOLEAN
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

**API Endpoints**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (Protected)
- `GET /auth/validate` - Validate JWT token (Protected)
- `GET /users` - List all users (Protected)
- `GET /users/:id` - Get user by ID (Protected)
- `DELETE /users/:id` - Delete user (Protected)
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

**Events Published**:
- `user.registered` - When a new user registers
- `user.login` - When a user logs in

### Payments Service (PLANNED)

**Purpose**: Handle payment processing and transaction history

**Technology Stack**:
- Framework: NestJS
- Database: MongoDB
- Message Queue: RabbitMQ

**Features**:
- Create payment transactions
- Process payments
- View payment history
- Event publishing (payment.created, payment.completed)

### Notifications Service (PLANNED)

**Purpose**: Send notifications to users

**Technology Stack**:
- Framework: NestJS
- Cache: Redis
- Email: Nodemailer
- Message Queue: RabbitMQ

**Features**:
- Email notifications
- Template caching
- Event-driven notifications
- Rate limiting

### API Gateway (PLANNED)

**Purpose**: Single entry point for all client requests

**Features**:
- Request routing
- Rate limiting
- Authentication middleware
- Load balancing
- Request/response logging

## Communication Patterns

### Synchronous Communication
- Client → API Gateway (HTTP/REST)
- API Gateway → Microservices (HTTP/REST)

### Asynchronous Communication
- Microservices → RabbitMQ → Other Microservices (Events)

## Event-Driven Architecture

### Current Events

**Auth Service Events**:
- `user.registered`: Published when a user registers
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```

- `user.login`: Published when a user logs in
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```

## Observability

### Logging
- Structured logging with Winston
- Log levels: error, warn, info, debug
- Logs stored in: `logs/error.log` and `logs/combined.log`

### Metrics
- Prometheus metrics exposed at `/metrics`
- Default metrics: CPU, memory, HTTP requests
- Custom business metrics (to be implemented)

### Monitoring
- Grafana dashboards (to be configured)
- Real-time metrics visualization
- Alerting (to be configured)

## Database Strategy

### Polyglot Persistence
Each service uses the database best suited for its needs:
- **Auth Service**: PostgreSQL (relational data, ACID compliance)
- **Payments Service**: MongoDB (flexible schema, high write throughput)
- **Notifications Service**: Redis (caching, fast lookups)

### Database per Service Pattern
- Each service owns its database
- No direct database access between services
- Data consistency through events

## Security

### Authentication
- JWT tokens with configurable expiration
- Bcrypt password hashing (10 rounds)
- Bearer token authentication

### Authorization
- Route-level guards
- Role-based access control (to be implemented)

### Network Security
- CORS enabled for all origins (configure for production)
- Rate limiting (to be implemented in API Gateway)

## Scalability

### Horizontal Scaling
- Stateless services
- Load balancing through API Gateway
- Multiple service instances can run simultaneously

### Message Queue
- RabbitMQ ensures reliable message delivery
- Durable queues for persistence
- Multiple consumers for load distribution

## Development Workflow

### Local Development
1. Start infrastructure with Docker Compose
2. Run services in development mode
3. Use hot reload for rapid development

### Testing
- Unit tests with Jest
- Integration tests
- E2E tests
- Test script for manual testing

### CI/CD (Planned)
- GitHub Actions workflows
- Automated testing
- Docker image building
- Automated deployment

## Future Enhancements

- [ ] Complete Payments Service
- [ ] Complete Notifications Service
- [ ] Implement API Gateway
- [ ] Add Redis caching layer
- [ ] Configure Grafana dashboards
- [ ] Implement rate limiting
- [ ] Add circuit breakers
- [ ] Implement distributed tracing
- [ ] Add API documentation with Swagger
- [ ] Implement RBAC
- [ ] Add integration tests
- [ ] Configure CI/CD pipeline
- [ ] Production deployment configuration