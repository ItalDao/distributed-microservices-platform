# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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