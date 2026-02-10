# Documentation Quick Reference

Fast access to all documentation for the Distributed Microservices Platform.

> [!TIP]
> Use the API Gateway base URL for client integrations.

---

## Core Documentation

### Getting Started
- **[README.md](./README.md)** - Project overview, quick start, technology stack
- **[FAQ.md](./FAQ.md)** - Frequently asked questions and answers
- **[Quick Start Guide](./README.md#quick-start-guide)** - Installation steps

### Architecture & Design
- **[Architecture Overview](./docs/architecture.md)** - System design, components, patterns
- **[System Architecture Diagram](./docs/architecture.md#architecture-diagram)** - Visual overview
- **[Technology Decisions](./docs/architecture.md#technology-decisions)** - Why we chose each tech

### API & Integration
- **[API Specifications](./docs/api-specs.md)** - Complete API documentation
- **[Authentication API](./docs/api-specs.md#authentication-api)** - User auth endpoints
- **[Payments API](./docs/api-specs.md#payments-api)** - Payment endpoints
- **[Notifications API](./docs/api-specs.md#notifications-api)** - Notification endpoints

### Configuration & Setup
- **[Configuration Guide](./docs/CONFIGURATION.md)** - Environment variables and setup
- **[Auth Service Config](./docs/CONFIGURATION.md#auth-service-configuration)** - Auth service setup
- **[Payments Service Config](./docs/CONFIGURATION.md#payments-service-configuration)** - Payments setup
- **[Notifications Service Config](./docs/CONFIGURATION.md#notifications-service-configuration)** - Notifications setup
- **[API Gateway Config](./docs/CONFIGURATION.md#api-gateway-configuration)** - Gateway setup

### Deployment & Operations
- **[Deployment Guide](./docs/deployment.md)** - Production deployment
- **[Environment Setup](./docs/deployment.md#environment-setup)** - Dev, staging, production
- **[Docker Deployment](./docs/deployment.md#docker-compose-deployment)** - Docker setup
- **[Kubernetes Deployment](./docs/deployment.md#kubernetes-deployment-advanced)** - K8s setup
- **[Monitoring](./docs/deployment.md#monitoring-and-health-checks)** - Metrics and logs
- **[Scaling](./docs/deployment.md#scaling-strategies)** - Scaling strategies
- **[Troubleshooting](./docs/deployment.md#troubleshooting)** - Common issues

### Development & Contributing
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Coding Standards](./CONTRIBUTING.md#coding-standards)** - Code style guidelines
- **[Testing Requirements](./CONTRIBUTING.md#testing-requirements)** - Test guidelines
- **[Commit Format](./CONTRIBUTING.md#commit-message-format)** - Git commit format
- **[Pull Request Process](./CONTRIBUTING.md#pull-request-process)** - PR guidelines

### Project Information
- **[Changelog](./CHANGELOG.md)** - Version history and updates
- **[License](./LICENSE)** - MIT License
- **[Contributors](./CONTRIBUTORS.md)** - Recognition and guidelines
- **[Documentation Summary](./DOCUMENTATION_SUMMARY.md)** - Changes and improvements

---

## Services Overview

### Auth Service
- **Port**: 3001
- **Database**: PostgreSQL
- **Key Features**: User registration, login, JWT validation
- **Documentation**: [Architecture - Auth Service](./docs/architecture.md#auth-service)
- **API**: [Authentication API](./docs/api-specs.md#authentication-api)
- **Configuration**: [Auth Config](./docs/CONFIGURATION.md#auth-service-configuration)

### Payments Service
- **Port**: 3002
- **Database**: MongoDB
- **Key Features**: Payment processing, transaction management
- **Documentation**: [Architecture - Payments Service](./docs/architecture.md#payments-service)
- **API**: [Payments API](./docs/api-specs.md#payments-api)
- **Configuration**: [Payments Config](./docs/CONFIGURATION.md#payments-service-configuration)

### Notifications Service
- **Port**: 3003
- **Cache**: Redis
- **Key Features**: Email notifications, template management
- **Documentation**: [Architecture - Notifications Service](./docs/architecture.md#notifications-service)
- **API**: [Notifications API](./docs/api-specs.md#notifications-api)
- **Configuration**: [Notifications Config](./docs/CONFIGURATION.md#notifications-service-configuration)

### API Gateway
- **Port**: 3000
- **Key Features**: Request routing, rate limiting, authentication
- **Documentation**: [Architecture - API Gateway](./docs/architecture.md#api-gateway)
- **Configuration**: [Gateway Config](./docs/CONFIGURATION.md#api-gateway-configuration)

---

## Common Tasks

### I want to...

#### Get Started
1. Read [README.md](./README.md)
2. Follow [Quick Start Guide](./README.md#quick-start-guide)
3. Check [FAQ.md](./FAQ.md) for help

#### Set Up Development Environment
1. Read [CONTRIBUTING.md - Getting Started](./CONTRIBUTING.md#getting-started)
2. Follow installation steps
3. Check [Configuration Guide](./docs/CONFIGURATION.md)

#### Understand the Architecture
1. Read [Architecture Overview](./docs/architecture.md)
2. Review [System Architecture Diagram](./docs/architecture.md#architecture-diagram)
3. Check [Technology Decisions](./docs/architecture.md#technology-decisions)

#### Use the APIs
1. Read [API Specifications](./docs/api-specs.md)
2. Find your endpoint (Auth/Payments/Notifications)
3. Copy the example request
4. Check error responses section

#### Deploy to Production
1. Read [Deployment Guide](./docs/deployment.md)
2. Choose deployment method (Docker/K8s/Cloud)
3. Follow environment setup
4. Review [Security Checklist](./docs/deployment.md#security-checklist)

#### Contribute Code
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Follow [Coding Standards](./CONTRIBUTING.md#coding-standards)
3. Write tests per [Testing Requirements](./CONTRIBUTING.md#testing-requirements)
4. Follow [Commit Format](./CONTRIBUTING.md#commit-message-format)

#### Find Configuration Options
1. Go to [Configuration Guide](./docs/CONFIGURATION.md)
2. Find your service section
3. Copy environment variable example
4. Update .env file

#### Troubleshoot Issues
1. Check [FAQ.md - Troubleshooting](./FAQ.md#troubleshooting)
2. Review [Deployment Guide - Troubleshooting](./docs/deployment.md#troubleshooting)
3. Check logs: `docker-compose logs service-name`
4. Open GitHub issue if needed

#### Monitor the System
1. Read [Architecture - Observability](./docs/architecture.md#observability)
2. Access [Prometheus](http://localhost:9090) (metrics)
3. Access [Grafana](http://localhost:3004) (dashboards)
4. Check logs in `logs/` directory

#### Scale Services
1. Read [Architecture - Scalability](./docs/architecture.md#scalability-design)
2. Review [Deployment - Scaling](./docs/deployment.md#scaling-strategies)
3. Configure auto-scaling (if using Kubernetes)
4. Monitor performance metrics

---

## Quick Links

### Infrastructure
- Docker Compose config: `infrastructure/docker-compose.yml`
- Prometheus config: `infrastructure/prometheus/prometheus.yml`
- Grafana dashboards: `infrastructure/grafana/dashboards/`

### Services
- Auth Service: `services/auth-service/`
- Payments Service: `services/payments-service/`
- Notifications Service: `services/notifications-service/`
- API Gateway: `services/api-gateway/`

### Configuration Files
- Auth .env template: `services/auth-service/.env.example`
- Payments .env template: `services/payments-service/.env.example`
- Notifications .env template: `services/notifications-service/.env.example`
- Gateway .env template: `services/api-gateway/.env.example`

### Testing
- Test commands: `npm run test`, `npm run test:e2e`
- Coverage: `npm run test:cov`
- Auth test script: `test-auth.js`
- Payments test script: `test-payments.js`

---

## Environment Variables Quick Reference

### Auth Service (.env)
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
RABBITMQ_URL=amqp://...
```

### Payments Service (.env)
```bash
NODE_ENV=development
PORT=3002
MONGODB_URL=mongodb://...
RABBITMQ_URL=amqp://...
```

### Notifications Service (.env)
```bash
NODE_ENV=development
PORT=3003
REDIS_URL=redis://...
RABBITMQ_URL=amqp://...
SMTP_HOST=smtp.example.com
```

### API Gateway (.env)
```bash
NODE_ENV=development
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
PAYMENTS_SERVICE_URL=http://localhost:3002
NOTIFICATIONS_SERVICE_URL=http://localhost:3003
JWT_SECRET=your-secret-key
```

See [Configuration Guide](./docs/CONFIGURATION.md) for complete options.

---

## API Endpoints Quick Reference

### Auth Service
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get profile (auth required)
- `GET /auth/validate` - Validate token (auth required)
- `GET /auth/users` - List users (auth required)
- `GET /auth/users/:id` - Get user (auth required)
- `DELETE /auth/users/:id` - Delete user (auth required)

### Payments Service
- `POST /payments/create` - Create payment
- `GET /payments` - List payments
- `GET /payments/:id` - Get payment
- `PUT /payments/:id/status` - Update status
- `POST /payments/:id/process` - Process payment
- `DELETE /payments/:id` - Delete payment

### Notifications Service
- `POST /notifications/send` - Send notification
- `GET /notifications/stats` - Get statistics

### Common
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

See [API Specifications](./docs/api-specs.md) for complete documentation.

---

## Default Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| API Gateway | http://localhost:3000 | JWT Auth |
| Auth Service | http://localhost:3001 | - |
| Payments Service | http://localhost:3002 | - |
| Notifications Service | http://localhost:3003 | - |
| Prometheus | http://localhost:9090 | None |
| Grafana | http://localhost:3004 | admin/admin |
| RabbitMQ Management | http://localhost:15672 | guest/guest |

---

## Support & Resources

### Documentation
- **Main Docs**: All files in this directory
- **GitHub**: https://github.com/ItalDao/distributed-microservices-platform
- **Issues**: https://github.com/ItalDao/distributed-microservices-platform/issues

### Author
- **Name**: Matias
- **GitHub**: [@ItalDao](https://github.com/ItalDao)
- **Profile**: https://github.com/ItalDao

### Learning Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Docker Documentation](https://docs.docker.com/)

---

## Documentation Navigation

```
You are here: QUICK_REFERENCE.md

├── README.md (Start here)
├── FAQ.md (Questions)
├── CHANGELOG.md (Updates)
├── CONTRIBUTING.md (Development)
├── LICENSE (Legal)
├── CONTRIBUTORS.md (Credits)
├── DOCUMENTATION_SUMMARY.md (Changes)
└── docs/
    ├── architecture.md (Design)
    ├── api-specs.md (API)
    ├── deployment.md (Operations)
    └── CONFIGURATION.md (Setup)
```

---

## Version Information

- **Platform Version**: 0.4.0
- **Last Updated**: January 11, 2026
- **Documentation Version**: 2.0
- **Status**: Production Ready

---

**Last Updated**: January 11, 2026
**Author**: Matias (@ItalDao)
**License**: MIT
