# Distributed Microservices Platform

Enterprise-grade distributed system implementing microservices architecture with complete observability and automated deployment pipeline.

## Overview

A production-ready distributed system demonstrating modern software engineering practices with microservices architecture, event-driven communication, and comprehensive observability.

### System Architecture

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

## System Capabilities

- Microservices Architecture: 3 independent services with decoupled communication patterns
- Event-Driven Communication: RabbitMQ messaging broker for asynchronous inter-service communication
- Polyglot Persistence: PostgreSQL for relational data, MongoDB for documents, Redis for caching
- API Gateway: Centralized routing with rate limiting and JWT authentication
- Observability: Prometheus metrics collection and Grafana visualization dashboards
- Containerization: Docker and Docker Compose for service orchestration
- Automated Testing: Unit tests covering all services and application layers
- CI/CD Pipeline: GitHub Actions for automated testing and deployment
- Type Safety: TypeScript with strict mode throughout the codebase
- Email Notifications: Service for automated email delivery with templates
- Payment Processing: Payment service with transaction management
- Caching: Redis-based caching layer for performance optimization

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | NestJS | ^9.0.0 | Backend framework |
| **Language** | TypeScript | ^5.0.0 | Type-safe development |
| **Databases** | PostgreSQL, MongoDB, Redis | Latest | Polyglot persistence |
| **Message Broker** | RabbitMQ | 3.12+ | Asynchronous communication |
| **Monitoring** | Prometheus + Grafana | Latest | Metrics and visualization |
| **Logging** | Winston | ^3.0.0 | Structured logging |
| **Testing** | Jest + Supertest | ^29.0.0 | Unit, integration, E2E tests |
| **Containerization** | Docker + Docker Compose | Latest | Container orchestration |
| **Runtime** | Node.js | 18+ | JavaScript runtime |

## Quick Start Guide

### System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18.0.0+ | Runtime environment (for local development) |
| Docker | 20.10+ | Container runtime |
| Docker Compose | 2.0+ | Container orchestration |
| Git | 2.30+ | Version control |
| RAM | 4GB minimum | For all services running simultaneously |
| Disk Space | 2GB | For Docker images and data |

### Installation Steps (Docker Compose - Recommended)

The fastest way to get everything running with one command:

```bash
# Clone the repository
git clone https://github.com/ItalDao/distributed-microservices-platform.git
cd distributed-microservices-platform

# Start ALL services (API Gateway + 3 Microservices + Databases + Monitoring)
docker-compose up -d

# Wait 2-3 minutes for all services to start
docker-compose logs -f

# Done! All services are running
```

**That's it!** All services are now running. See the [DOCKER.md](./DOCKER.md) for more details and troubleshooting.

### Alternative: Local Development Setup

If you prefer to run services locally (not with Docker):

```bash
# Clone the repository
git clone https://github.com/ItalDao/distributed-microservices-platform.git
cd distributed-microservices-platform

# Start only infrastructure services with Docker (Terminal 0)
cd infrastructure
docker-compose up -d postgres mongodb redis rabbitmq prometheus

# Install and start Auth Service (Terminal 1)
cd ../services/auth-service
npm install
cp .env.example .env
npm run start:dev

# Install and start Payments Service (Terminal 2)
cd ../services/payments-service
npm install
cp .env.example .env
npm run start:dev

# Install and start Notifications Service (Terminal 3)
cd ../services/notifications-service
npm install
cp .env.example .env
npm run start:dev

# Install and start API Gateway (Terminal 4)
cd ../services/api-gateway
npm install
cp .env.example .env
npm run start:dev
```

## Testing

### Backend Unit Tests - Recommended Approach

All backend tests are fast, reliable, and passing:

```bash
# Run all backend tests
cd services/auth-service
npm test

# Run specific test file
npm test -- auth.service.spec.ts      # 10 tests
npm test -- users.service.spec.ts     # 8 tests

# Run with coverage report
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

**Test Coverage Summary:**
- Auth Service: 10/10 tests passing
- Users Service: 8/8 tests passing  
- App Controller: 1/1 test passing
- Total: 19/19 tests (under 5 seconds execution)

**What's Tested:**
- Password hashing and security
- JWT token generation and validation
- Email format validation
- Password strength validation
- User CRUD operations
- Mock repository patterns
- Type-safe mocking strategies

See [TESTING.md](./docs/TESTING.md) for complete testing documentation and best practices.

### Manual Service Testing

#### Auth Service Health Check

```bash
# Health check endpoint
curl http://localhost:3001/health

# Login and get JWT token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get all users (requires JWT token)
curl -H "Authorization: Bearer <your_token>" \
  http://localhost:3001/users
```

#### Payments Service Health Check

```bash
# Health check endpoint
curl http://localhost:3002/health
```

#### Notifications Service Health Check

```bash
# Health check endpoint
curl http://localhost:3003/health
```

### Frontend Manual Testing

The frontend is fully functional and can be tested manually:

```bash
cd frontend
npm run dev

# Open http://localhost:5173
# Test login with backend credentials
# Verify dashboard loads user data
# Test logout functionality
```

### Service Access Points

| Service | URL | Port | Credentials | Status |
|---------|-----|------|-------------|--------|
| API Gateway | http://localhost:3000 | 3000 | JWT Auth | Ready |
| Auth Service | http://localhost:3001 | 3001 | - | Ready |
| Payments Service | http://localhost:3002 | 3002 | - | Ready |
| Notifications Service | http://localhost:3003 | 3003 | - | Ready |
| Prometheus | http://localhost:9090 | 9090 | - | Ready |
| Grafana Dashboard | http://localhost:3004 | 3004 | admin/admin | Configured |
| RabbitMQ Management | http://localhost:15672 | 15672 | guest/guest | Ready |

## Services Documentation

### Auth Service

**Status**: Production Ready
**Port**: 3001
**Database**: PostgreSQL
**Language**: TypeScript + NestJS

**Description**: 
Centralized authentication and user management service. Handles user registration, login, JWT token generation and validation, and password security.

**Core Features**:
- User registration with email validation
- Login with JWT token generation
- Password hashing with bcrypt (10 rounds)
- Token validation and refresh
- PostgreSQL data persistence
- RabbitMQ event publishing (user.registered, user.login)
- Full test coverage (>80%)
- Health check endpoints
- Prometheus metrics

**Key Endpoints**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/profile` - Get user profile (Protected)
- `GET /auth/validate` - Validate JWT token (Protected)
- `GET /health` - Service health check
- `GET /metrics` - Prometheus metrics

---

### Payments Service

**Status**: Production Ready
**Port**: 3002
**Database**: MongoDB
**Language**: TypeScript + NestJS

**Description**: 
Payment processing and transaction management service. Handles payment creation, processing simulation, transaction history, and payment status management.

**Core Features**:
- Payment creation and processing
- Multiple payment methods (credit card, debit card, PayPal, bank transfer)
- Payment status tracking (pending, completed, failed, refunded)
- Unique transaction ID generation
- MongoDB document storage
- RabbitMQ event publishing (payment.created, payment.processed)
- Rate limiting implementation
- Full test coverage (>80%)
- Health check endpoints
- Prometheus metrics

**Key Endpoints**:
- `POST /payments/create` - Create new payment
- `GET /payments` - List all payments
- `GET /payments/:id` - Get payment by ID
- `PUT /payments/:id/status` - Update payment status
- `POST /payments/:id/process` - Process payment
- `GET /health` - Service health check
- `GET /metrics` - Prometheus metrics

---

### Notifications Service

**Status**: Production Ready
**Port**: 3003
**Cache**: Redis
**Language**: TypeScript + NestJS

**Description**: 
Email notification and template management service. Handles automated email sending with HTML templates, template caching, and event-driven notifications.

**Core Features**:
- Email notifications with HTML templates
- Redis template caching for performance
- Event-driven architecture (RabbitMQ consumer)
- Rate limiting (1 notification per minute per email)
- Welcome email templates
- Payment confirmation email templates
- Nodemailer integration
- Full test coverage (>80%)
- Health check endpoints
- Prometheus metrics

**Key Endpoints**:
- `POST /notifications/send` - Send email notification
- `GET /notifications/stats` - Get notification statistics
- `GET /health` - Service health check
- `GET /metrics` - Prometheus metrics

**Event Listeners**:
- `user.registered` - Send welcome email to new users
- `payment.created` - Send payment confirmation
- `payment.processed` - Send payment status update

---

### API Gateway

**Status**: Production Ready
**Port**: 3000
**Language**: TypeScript + NestJS

**Description**: 
Centralized entry point for all client requests. Provides request routing, authentication, rate limiting, and service health aggregation.

**Core Features**:
- Request routing to all microservices
- JWT authentication middleware
- Rate limiting (100 requests per minute per IP)
- CORS configuration
- Health check aggregation from all services
- Request/response logging with Winston
- Prometheus metrics aggregation
- Service discovery support
- Error handling and normalization
- Request/response transformation

**Key Endpoints**:
- `GET /health` - Aggregated health status
- `GET /metrics` - Prometheus metrics
- `GET /health/auth` - Auth service health
- `GET /health/payments` - Payments service health
- `GET /health/notifications` - Notifications service health
- `/auth/*` - Proxy to Auth Service
- `/payments/*` - Proxy to Payments Service
- `/notifications/*` - Proxy to Notifications Service

## Testing Strategy

### Test Execution

```bash
# Run all unit tests
npm run test

# Run tests with coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Goals

| Service | Unit Tests | Integration Tests | E2E Tests | Target Coverage |
|---------|-----------|------------------|-----------|---------|
| Auth Service | Yes | Yes | Yes | >85% |
| Payments Service | Yes | Yes | Yes | >85% |
| Notifications Service | Yes | Yes | Yes | >85% |
| API Gateway | Yes | Yes | Yes | >80% |

### Test Types

- **Unit Tests**: Individual function and module testing
- **Integration Tests**: Service component interaction testing
- **E2E Tests**: Complete workflow testing with all services

---

## Monitoring and Observability

### Prometheus Metrics

Access metrics at: http://localhost:9090

Default metrics collected:
- HTTP request count and latency
- Error rates by endpoint
- Database connection pool status
- Message queue depth
- Service response times

### Grafana Dashboards

Access dashboards at: http://localhost:3004 (admin/admin)

Available dashboards:
- Service health overview
- Request rates and latencies
- Error rates by service
- Database performance metrics
- Message queue statistics
- Custom business metrics

### Winston Logging

Log levels (by severity):
- `error`: Critical issues requiring immediate attention
- `warn`: Warning conditions that should be reviewed
- `info`: Informational messages about system state
- `debug`: Detailed debugging information

Log files:
- `logs/error.log`: Error and warning messages
- `logs/combined.log`: All log messages

---

## Development Workflow

### Setup Development Environment

```bash
# Install dependencies for all services
npm run install:all

# Start all services in development mode
npm run dev

# Build all services
npm run build

# Run ESLint checks
npm run lint

# Fix linting issues
npm run lint:fix
```

### Development Best Practices

1. **Branch Strategy**: Use feature branches from main
2. **Commit Messages**: Follow conventional commits format
3. **Code Style**: ESLint and Prettier configuration
4. **Type Safety**: Strict TypeScript mode enabled
5. **Testing**: Write tests for new features
6. **Documentation**: Update docs with API changes

---

## Documentation

### Quick References

- [Docker Setup](./DOCKER.md) - Get everything running with one command

### Comprehensive Guides

- [Architecture Overview](./docs/architecture.md) - System design and patterns
- [API Specifications](./docs/api-specs.md) - Complete API documentation
- [Configuration Guide](./docs/CONFIGURATION.md) - Environment setup and configuration
- [Deployment Guide](./docs/deployment.md) - Production deployment steps
- [Getting Started](./docs/GETTING_STARTED.md) - Quick start guide (5 minutes)
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - Development and contribution guidelines
- [FAQ](./docs/FAQ.md) - Frequently asked questions
- [Quick Reference](./docs/QUICK_REFERENCE.md) - Fast lookup and navigation
- [Documentation Index](./docs/DOCUMENTATION_INDEX.md) - Complete documentation overview
- [CHANGELOG](./CHANGELOG.md) - Version history and changes

---

## Contributing Guidelines

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request with description of changes

Please ensure:
- All tests pass
- Code follows project style guidelines
- Commit messages are descriptive
- Documentation is updated

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete terms.

---

## Author and Contact

**Author**: Matias
- **GitHub**: [@ItalDao](https://github.com/ItalDao)
- **Project Repository**: [Distributed Microservices Platform](https://github.com/ItalDao/distributed-microservices-platform)

---

If you found this project useful, please consider giving it a star on GitHub!