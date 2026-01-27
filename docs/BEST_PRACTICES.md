# Development Best Practices

## Code Quality Standards

### TypeScript Configuration
```bash
# All projects use strict TypeScript mode
# Enable in tsconfig.json:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### ESLint & Prettier Configuration
All services follow strict linting rules:
- TypeScript ESLint rules enabled
- Prettier auto-formatting on save
- Pre-commit hooks with husky
- No console.log in production code (use Winston logger)

### Import/Export Patterns
```typescript
// Recommended: Named imports
import { UserService } from './user.service';
import { Logger } from '@nestjs/common';

// Recommended: Barrel exports (index.ts)
export * from './auth.service';
export * from './user.service';

// Avoid: Default exports
export default class UserService { }

// Avoid: Wildcard imports
import * as services from './services';
```

### Error Handling Best Practices
```typescript
// Recommended: Use custom exceptions
throw new BadRequestException('Email already exists');
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException('User not found');

// Avoid: Generic Error class
throw new Error('Something went wrong');
```

### Logging Standards
```typescript
// Recommended: Structured logging with Winston
this.logger.debug('Processing user login', { email });
this.logger.info('User logged in successfully', { userId });
this.logger.warn('Multiple failed login attempts', { email, attempts });
this.logger.error('Database connection failed', error);

// Avoid: Console logging
console.log('User logged in');
console.error(error);
```

## Testing Best Practices

### Unit Test Structure
```typescript
// Recommended: Arrange-Act-Assert pattern
describe('UserService', () => {
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
  });

  it('should create user successfully', async () => {
    // Arrange
    const userData = { email: 'test@example.com', password: 'hash' };
    mockUserRepository.save.mockResolvedValue({ id: '123', ...userData });

    // Act
    const result = await userService.create(userData);

    // Assert
    expect(result.email).toBe('test@example.com');
    expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
  });
});
```

### Mock Best Practices
```typescript
// Recommended: Type-safe mocks
const mockRepository: {
  findOne: jest.Mock;
  save: jest.Mock;
  delete: jest.Mock;
} = {
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

// Recommended: Return specific mocks
mockRepository.findOne.mockResolvedValue({ id: '123', email: 'test@example.com' });
mockRepository.save.mockResolvedValue({ id: '123', email: 'test@example.com' });

// Avoid: Using 'any' without type
const mockRepository: any = { ... };
```

### Test Naming Conventions
```typescript
// Recommended: Descriptive test names
it('should validate password with at least 8 characters')
it('should reject email format without @ symbol')
it('should throw 409 conflict when user already exists')
it('should update user profile successfully')

// Avoid: Vague test names
it('should work')
it('test password')
it('validation')
```

## Git Workflow

### Branch Naming
```bash
# Feature branch
git checkout -b feat/user-authentication

# Bug fix branch
git checkout -b fix/token-expiration-issue

# Documentation
git checkout -b docs/testing-guide

# Improvement/refactor
git checkout -b refactor/simplify-auth-logic
```

### Commit Message Format
```bash
# Recommended: Clear, conventional commits
git commit -m "feat(auth): implement JWT token validation"
git commit -m "fix(users): resolve null pointer in profile update"
git commit -m "docs(readme): add deployment instructions"
git commit -m "test(auth): add password strength tests"

# Avoid: Vague messages
git commit -m "fix stuff"
git commit -m "Update"
git commit -m "work in progress"
```

### Commit Scope Format
```
feat(scope): description
^    ^       ^
|    |       |
|    |       +-- Description: what the commit does
|    |
|    +-- Scope: section affected (auth, users, payments, etc)
|
+-- Type: feat, fix, docs, style, refactor, test, chore
```

## Code Organization

### Directory Structure Rules
```
src/
├── shared/          # Shared utilities, constants, types
├── features/        # Feature modules (auth, users, etc)
├── services/        # Business logic
├── controllers/     # Request handlers (API Gateway only)
├── decorators/      # Custom decorators
├── guards/          # NestJS guards
├── middleware/      # Custom middleware
├── config/          # Configuration files
└── main.ts         # Application entry point
```

### Module Organization
```typescript
// Recommended: Organized barrel exports
// services/index.ts
export * from './auth.service';
export * from './user.service';
export * from './token.service';

// Usage in other files
import { AuthService, UserService } from './services';
```

## Performance Best Practices

### Database Queries
```typescript
// Recommended: Use pagination for large datasets
const users = await repository.find({
  skip: (page - 1) * limit,
  take: limit,
  order: { createdAt: 'DESC' },
});

// Recommended: Select only needed fields
const users = await repository.find({
  select: ['id', 'email', 'firstName'],
});

// Avoid: Fetching all rows without pagination
const users = await repository.find();
```

### Caching Strategy
```typescript
// Recommended: Cache frequently accessed data
const user = await this.cacheService.get(`user:${id}`, () =>
  this.userRepository.findOne(id),
);

// Recommended: Invalidate cache on updates
await this.userRepository.save(user);
await this.cacheService.invalidate(`user:${id}`);
```

## Security Best Practices

### Password Security
```typescript
// Recommended: Hash passwords with bcrypt
const hashedPassword = await bcrypt.hash(password, 10);
const isValidPassword = await bcrypt.compare(password, hashedPassword);

// Avoid: Store plaintext passwords
const hashedPassword = Buffer.from(password).toString('base64');
```

### JWT Token Management
```typescript
// Recommended: Short expiration times
const token = this.jwtService.sign(payload, {
  expiresIn: '15m', // Short-lived access token
});

// Recommended: Validate token before use
const decoded = this.jwtService.verify(token);

// Avoid: Long expiration times
const token = this.jwtService.sign(payload, {
  expiresIn: '365d',
});
```

### Input Validation
```typescript
// Recommended: Validate all inputs
@IsEmail()
@IsNotEmpty()
email: string;

@MinLength(8)
@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
password: string;

// Avoid: No validation
email: string;
password: string;
```

## Environment Variables

### .env File Management
```bash
# Recommended: Use .env.example as template
# .env.example (committed to repo)
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your-secret-key
NODE_ENV=development

# .env (never commit to repo)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=actual-secret-key-here
NODE_ENV=development

# Usage in code
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is required');
```

## Documentation Standards

### Code Comments
```typescript
// Recommended: Explain WHY, not WHAT
// Use email as unique identifier to support account recovery
const user = await repository.findByEmail(email);

// Avoid: Comments state the obvious
// Find user by email
const user = await repository.findByEmail(email);
```

### README Files
Every service should have a README with:
- Service description
- Installation steps
- Environment variables needed
- How to run locally
- API endpoints
- Testing instructions

### API Documentation
```typescript
// Recommended: JSDoc comments
/**
 * Register a new user
 * @param {RegisterDto} data - User registration data
 * @returns {Promise<UserDto>} Created user object
 * @throws {BadRequestException} If email already exists
 */
@Post('register')
register(@Body() data: RegisterDto): Promise<UserDto>
```

## Review Checklist

Before committing code:
- All tests passing
- ESLint and TypeScript no errors
- No console.log statements
- Error handling implemented
- Input validation added
- Comments added for complex logic
- No hardcoded values (use env vars)
- Performance considered (no N+1 queries)
- Security practices followed
- Commit message follows conventions
- Branch name follows conventions

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Testing Framework](https://jestjs.io)
- [Git Conventional Commits](https://www.conventionalcommits.org)
- [OWASP Security Guidelines](https://owasp.org)
