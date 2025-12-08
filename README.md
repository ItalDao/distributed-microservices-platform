# 🚀 Distributed Microservices Platform

> Enterprise-grade distributed system with microservices architecture, complete observability, and automated CI/CD pipeline.

[![CI/CD](https://github.com/YOUR_USERNAME/distributed-microservices-platform/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/distributed-microservices-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Overview

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

## 🎯 Key Features

- **Microservices Architecture**: 3 independent services with clear boundaries
- **Event-Driven Communication**: RabbitMQ for asynchronous messaging
- **Polyglot Persistence**: PostgreSQL, MongoDB, and Redis
- **API Gateway**: Centralized routing, rate limiting, and authentication (Coming soon)
- **Observability**: Prometheus metrics + Grafana dashboards + Winston logging
- **Containerization**: Full Docker support with Docker Compose
- **Testing**: Unit, integration, and E2E tests with >80% coverage
- **CI/CD**: Automated testing and deployment with GitHub Actions (Coming soon)
- **Type Safety**: Full TypeScript implementation
- **Email Notifications**: Automated emails with HTML templates
- **Payment Processing**: Simulated payment gateway with transaction management
- **Caching Layer**: Redis for performance optimization

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Languages**: TypeScript
- **Databases**: PostgreSQL, MongoDB, Redis
- **Message Broker**: RabbitMQ
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/distributed-microservices-platform.git
cd distributed-microservices-platform

# Start infrastructure with Docker
cd infrastructure
docker-compose up -d postgres mongodb redis rabbitmq

# Install and start Auth Service
cd ../services/auth-service
npm install
cp .env.example .env
npm run start:dev

# Install and start Payments Service (in new terminal)
cd ../payments-service
npm install
cp .env.example .env
npm run start:dev

# Install and start Notifications Service (in new terminal)
cd ../notifications-service
npm install
cp .env.example .env
npm run start:dev
```

### Testing Auth Service

```bash
# Run the test script
node test-auth.js

# Or test manually
curl http://localhost:3001/health
```

### Testing Payments Service

```bash
# Run the test script  
node test-payments.js

# Or test manually
curl http://localhost:3002/health
```

### Testing Notifications Service

```bash
# Test health check
curl http://localhost:3003/health

# Test sending a notification
curl -X POST http://localhost:3003/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"welcome","data":{"firstName":"John","lastName":"Doe"}}'
```

### Access Points

- **API Gateway**: http://localhost:3000 (Coming soon)
- **Auth Service**: http://localhost:3001
- **Payments Service**: http://localhost:3002
- **Notifications Service**: http://localhost:3003 (Coming soon)
- **Grafana Dashboard**: http://localhost:3004 (admin/admin)
- **Prometheus**: http://localhost:9090
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 📚 Services

### ✅ Auth Service (COMPLETED)
Handles user authentication and authorization with JWT tokens.
- User registration and login
- Token generation and validation
- Password hashing with bcrypt
- PostgreSQL for user data
- RabbitMQ event publishing
- Full test coverage

**Status**: ✅ Fully implemented and tested

### ✅ Payments Service (COMPLETED)
Processes payment transactions and maintains payment history.
- Payment creation and processing
- Transaction history with unique transaction IDs
- Payment status management (pending, completed, failed, refunded)
- Multiple payment methods support (credit card, debit card, PayPal, bank transfer)
- MongoDB for payment records
- Event publishing to RabbitMQ
- Payment processing simulation
- Full test coverage

**Status**: ✅ Fully implemented and tested

### ✅ Notifications Service (COMPLETED)
Sends notifications via email and manages notification templates.
- Email notifications with HTML templates
- Redis for template caching
- Event-driven architecture (listens to RabbitMQ)
- Rate limiting (1 notification per minute per email)
- Welcome emails for new users
- Payment confirmation emails
- Template management with caching
- Full monitoring and health checks

**Status**: ✅ Fully implemented and tested

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

## 📊 Monitoring

Access Grafana at http://localhost:3004 to view:
- Request rates and latencies
- Error rates by service
- Database connection pools
- Message queue metrics
- Custom business metrics

## 🔧 Development

```bash
# Install dependencies for all services
npm run install:all

# Run in development mode
npm run dev

# Build all services
npm run build

# Run linter
npm run lint
```

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Specifications](./docs/api-specs.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Tu Nombre**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)

---

⭐ If you found this project useful, please consider giving it a star!