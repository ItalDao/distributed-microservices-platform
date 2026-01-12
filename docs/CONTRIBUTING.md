# Contributing Guidelines

Thank you for your interest in contributing to the Distributed Microservices Platform! This document provides guidelines and instructions for contributing to this project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

All contributors must abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive criticism
- Report inappropriate behavior privately
- Help maintain a safe community

---

## Getting Started

### Prerequisites

- Node.js 18.0.0+
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
- VS Code (recommended) with ESLint and Prettier extensions

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/distributed-microservices-platform.git
cd distributed-microservices-platform

# 3. Add upstream remote
git remote add upstream https://github.com/ItalDao/distributed-microservices-platform.git

# 4. Create feature branch
git checkout -b feature/your-feature-name

# 5. Start infrastructure
cd infrastructure
docker-compose up -d

# 6. Install dependencies
npm run install:all

# 7. Start services in development mode
npm run dev
```

---

## Development Workflow

### Branch Naming Convention

Follow these naming patterns:

```
feature/description          # New feature
bugfix/description          # Bug fix
docs/description            # Documentation
refactor/description        # Code refactoring
test/description            # Test additions
chore/description           # Maintenance tasks
```

**Example**:
- `feature/add-user-validation`
- `bugfix/fix-auth-token-expiry`
- `docs/update-api-specs`

### Local Development Steps

```bash
# 1. Ensure you're on main and up-to-date
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Make your changes
# Edit files, add features, fix bugs

# 4. Run tests
npm run test
npm run test:e2e

# 5. Format code
npm run lint:fix

# 6. Commit changes (see commit format below)
git add .
git commit -m "feat: add new validation feature"

# 7. Push to your fork
git push origin feature/your-feature
```

---

## Coding Standards

### TypeScript Guidelines

**Type Safety**:
- Enable strict mode in tsconfig.json
- Always define return types explicitly
- Avoid `any` type; use union types or generics
- Use strict null checks

```typescript
// Good
function getUserById(id: string): Promise<User | null> {
  // Implementation
}

// Bad
function getUserById(id: any): any {
  // Implementation
}
```

**Naming Conventions**:
- Classes: PascalCase (`UserService`, `AuthModule`)
- Functions: camelCase (`getUserById`, `validateEmail`)
- Constants: UPPER_SNAKE_CASE (`MAX_USERS`, `API_TIMEOUT`)
- Interfaces: PascalCase with 'I' prefix (`IUser`, `IAuthService`)

**Code Structure**:
```typescript
// 1. Imports
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

// 2. Decorators
@Injectable()

// 3. Class definition
export class UserService {
  // 4. Constructor
  constructor(private userRepository: UserRepository) {}

  // 5. Public methods
  async getUser(id: string): Promise<User> {}

  // 6. Private methods
  private validateInput(data: any): void {}
}
```

### NestJS Best Practices

**Module Organization**:
```
feature/
  ├── feature.controller.ts
  ├── feature.service.ts
  ├── feature.module.ts
  ├── dto/
  │   ├── create-feature.dto.ts
  │   └── update-feature.dto.ts
  ├── entities/
  │   └── feature.entity.ts
  └── test/
      └── feature.service.spec.ts
```

**Dependency Injection**:
```typescript
// Use constructor injection
@Injectable()
export class FeatureService {
  constructor(
    private repository: FeatureRepository,
    private logger: LoggerService,
  ) {}
}
```

**Error Handling**:
```typescript
// Use appropriate HTTP exceptions
throw new BadRequestException('Invalid input');
throw new NotFoundException('User not found');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Access denied');
throw new ConflictException('Email already exists');
```

### Code Formatting

**ESLint Configuration**:
```bash
# Run linter
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

**Prettier Configuration**:
- Line length: 100
- Tab width: 2
- Single quotes: true
- Semicolons: true
- Trailing commas: es5

---

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Test additions or changes
- **chore**: Build, dependency, or configuration changes
- **ci**: CI/CD pipeline changes

### Scope

Specify the affected component:
- `auth-service`
- `payments-service`
- `notifications-service`
- `api-gateway`
- `database`
- `infra`
- `docs`

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end
- Limit to 50 characters

### Body

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points if necessary

### Footer

- Reference issue if applicable: `Fixes #123`
- Break changes: `BREAKING CHANGE: description`

### Examples

```
feat(auth-service): add email validation

Implement comprehensive email validation using regex pattern and 
DNS verification. Prevents invalid emails from being registered
in the system.

Fixes #456
```

```
fix(payments-service): resolve race condition in payment processing

Race condition in concurrent payment processing has been fixed by
implementing proper locking mechanism with database transactions.

- Acquire write lock before payment update
- Verify lock before processing
- Release lock after transaction completion

Fixes #789
```

```
docs: update API specifications with new endpoints

Add documentation for the new notification endpoints and update
all code examples to reflect current implementation.
```

---

## Pull Request Process

### Before Creating PR

1. **Update main branch**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Rebase your branch**:
   ```bash
   git rebase main
   # Fix any conflicts
   git push -f origin feature/your-feature
   ```

3. **Run all tests**:
   ```bash
   npm run test
   npm run test:cov
   npm run test:e2e
   ```

4. **Check code quality**:
   ```bash
   npm run lint
   npm run lint:fix
   ```

### Creating the PR

1. **Write descriptive title**:
   - Use the same format as commits
   - Example: "feat(auth-service): add user email verification"

2. **Provide detailed description**:
   ```markdown
   ## Description
   Brief description of changes

   ## Changes Made
   - Change 1
   - Change 2
   - Change 3

   ## Related Issues
   Fixes #123
   Related to #456

   ## Type of Change
   - [x] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How Has This Been Tested?
   Describe the test cases

   ## Checklist
   - [x] Tests pass
   - [x] Code follows style guidelines
   - [x] Documentation updated
   - [x] No new warnings generated
   ```

3. **Link related issues**:
   - Use "Fixes #123" to auto-close issues
   - Use "Related to #456" for related issues

### PR Review Process

**What reviewers look for**:
- Code quality and standards adherence
- Test coverage (>80% required)
- Documentation completeness
- Performance implications
- Security considerations
- Breaking changes documentation

**Addressing feedback**:
- Make requested changes
- Respond to all comments
- Push changes to same branch
- Request re-review when done

### Merging Guidelines

**Requirements before merge**:
- At least 2 approvals from maintainers
- All checks passing
- No conflicts with main branch
- Tests passing (100%)
- Code coverage maintained or improved
- Documentation updated

**Merge strategy**: Squash and merge (for clean history)

---

## Testing Requirements

### Test Structure

**Unit Tests** (>80% coverage):
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const user = { id: '123', email: 'test@example.com' };
      jest.spyOn(repository, 'findById').mockResolvedValue(user);

      const result = await service.getUserById('123');

      expect(result).toEqual(user);
      expect(repository.findById).toHaveBeenCalledWith('123');
    });

    it('should throw not found error', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.getUserById('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

### Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test -- user.service.spec.ts
```

### Coverage Requirements

- **Overall**: Minimum 80%
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

---

## Documentation Guidelines

### Code Comments

**When to comment**:
- Complex business logic
- Non-obvious algorithms
- Workarounds for known issues
- Links to external resources

**Good comments**:
```typescript
// Business rule: User must have verified email before payment
// See GDPR compliance requirement: https://docs.example.com/gdpr-compliance
private async validateUserEmailVerification(userId: string): Promise<void> {
  // Implementation
}
```

**Avoid comments**:
```typescript
// Bad: State the obvious
// Increment counter
counter++;

// Bad: Misleading comments
// This method does everything
async processPayment() {}
```

### Documentation Files

**README Update**:
- Add new features to feature list
- Update API endpoints if changed
- Add setup steps for new services

**Architecture Update**:
- Document new components
- Update flow diagrams
- Explain design decisions

**API Specification Update**:
- Document all endpoints
- Include request/response examples
- Describe error cases

**Deployment Guide Update**:
- Document new infrastructure
- Add deployment steps
- Include troubleshooting

---

## Issue Reporting

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Environment
- OS: Windows/macOS/Linux
- Node.js version: 18.0.0
- npm/yarn version: 8.0.0
- Service: auth-service/payments-service/etc

## Additional Context
Screenshots, logs, error messages
```

### Feature Request Template

```markdown
## Description
What feature would you like to add

## Motivation
Why is this feature needed

## Implementation Ideas
How could this be implemented (optional)

## Related Issues
Links to related issues

## Priority
- High: Critical for users
- Medium: Valuable enhancement
- Low: Nice to have
```

---

## Development Tips

### Debugging

**VS Code Debug Configuration**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/dist/main.js",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

**Debug Commands**:
```bash
# Start service with debugger
node --inspect-brk dist/main.js

# Or in VS Code, use the debug configuration
```

### Performance Testing

```bash
# Use Apache Bench
ab -n 1000 -c 10 http://localhost:3000/health

# Use Artillery for load testing
artillery quick --count 100 --num 1000 http://localhost:3000
```

---

## Getting Help

- **Questions**: GitHub Discussions
- **Bugs**: GitHub Issues with bug label
- **Features**: GitHub Issues with feature label
- **Chat**: Discord community (if available)
- **Email**: maintainers@example.com

---

## License

By contributing, you agree that your contributions will be licensed under the same MIT License as the project.

---

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- GitHub acknowledgments
- Release notes

Thank you for contributing to make this project better!
