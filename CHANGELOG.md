# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Payments Service with complete payment processing system
  - Create payment endpoint
  - List all payments endpoint
  - Get payment by ID endpoint
  - Update payment status endpoint
  - Process payment endpoint (simulates approval/rejection)
  - Delete payment endpoint
  - Filter payments by user ID
  - MongoDB database integration with Mongoose
  - RabbitMQ event publishing (payment.created, payment.status.updated, payment.processed)
  - Unique transaction ID generation
  - Multiple payment methods support (credit_card, debit_card, paypal, bank_transfer)
  - Payment status management (pending, completed, failed, refunded)
  - Prometheus metrics endpoint
  - Health check endpoint
  - Winston structured logging
- Comprehensive test script for Payments Service
- Updated documentation with Payments Service details

### Technical Details - Payments Service
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Message Queue**: RabbitMQ
- **Monitoring**: Prometheus
- **Logging**: Winston

## [0.2.0] - 2025-12-02

### Added - Payments Service
- Complete payment processing microservice
- MongoDB integration
- Transaction management
- Event-driven architecture with RabbitMQ

## [0.1.0] - 2025-11-29

### Added
- Initial project structure with microservices architecture
- Auth Service with full authentication system
  - User registration endpoint
  - User login endpoint  
  - JWT token generation and validation
  - Protected routes with JWT guards
  - PostgreSQL database integration with TypeORM
  - RabbitMQ event publishing
  - Prometheus metrics endpoint
  - Health check endpoint
  - Winston structured logging
- Docker Compose configuration for infrastructure
  - PostgreSQL database
  - MongoDB database
  - Redis cache
  - RabbitMQ message broker
  - Prometheus monitoring
  - Grafana dashboards
- Comprehensive test script for Auth Service
- Project documentation (README, Architecture docs)

### Technical Details
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Message Queue**: RabbitMQ
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston
- **Testing**: Jest

## [0.1.0] - 2025-11-29

### Initial Release
- Project scaffolding
- Auth Service implementation
- Basic infrastructure setup