# Testing Guide

## Backend Tests (Jest) - Recommended Approach

All backend tests are fast, reliable, and comprehensive.

> [!IMPORTANT]
> Status: Completed. 19/19 backend unit tests pass.

### Auth Service Tests
```bash
cd services/auth-service

# Run all tests
npm test

# Run specific test file
npm test -- auth.service.spec.ts
npm test -- users.service.spec.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Coverage:**
- **auth.service.spec.ts** - 10/10 tests passing
  - Password hashing and validation
  - JWT token generation
  - Email format validation
  - Password strength validation
  - Repository mocking

- **users.service.spec.ts** - 8/8 tests passing
  - User CRUD operations
  - FindAll, FindById, Update, Delete
  - Mock repository patterns

- **app.controller.spec.ts** - 1 test passing

**Total Backend: 19/19 tests passing in under 5 seconds**

### Test Structure
```
services/auth-service/src/
├── auth/
│   └── auth.service.spec.ts (10 tests)
├── users/
│   └── users.service.spec.ts (8 tests)
└── app.controller.spec.ts (1 test)
```

### Best Practices Implemented
- Pure unit tests without framework dependencies
- Proper TypeScript typing for mocks
- ESLint suppressions for test-specific patterns
- Clear test descriptions (Arrange-Act-Assert)
- Isolated tests with beforeEach setup
- Mock functions for external dependencies

---

## Frontend Testing (Manual Testing Recommended)

The frontend is fully functional and tested manually:

> [!NOTE]
> Playwright E2E smoke test is available for login + dashboard.

### Manual Testing Checklist
```
Login Flow
  - Navigate to http://localhost:5173/login
  - Test with credentials from backend
  - Verify redirect to dashboard

Dashboard Page
  - Verify user table loads with real data
  - Test logout functionality
  - Verify authentication protection

API Integration
  - Verify API calls use correct JWT token
  - Test error handling
  - Verify localStorage token management

Responsive Design
  - Test on desktop and mobile viewports
  - Verify Tailwind CSS styling
  - Test form interactions
```

### Run Frontend Locally
```bash
cd frontend

# Install dependencies
npm install

# Development server (HMR enabled)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Frontend is fully functional at: http://localhost:5173

> [!TIP]
> For E2E: run `npm run test:e2e` or `npx playwright test e2e/auth.spec.ts --project=chromium`.

---

## Backend Service Coverage

| Service | Test File | Tests | Status |
|---------|-----------|-------|--------|
| Auth Service | auth.service.spec.ts | 10 | Passing |
| Users Service | users.service.spec.ts | 8 | Passing |
| App Controller | app.controller.spec.ts | 1 | Passing |

### What's Tested
- User registration with validation
- Login with credentials
- Password hashing
- JWT token generation
- Error scenarios (duplicate email, invalid password, etc.)
- User CRUD operations

---

## Test Coverage Goals

### Frontend Coverage Target
- Components: 85%+
- Hooks: 90%+
- Services: 95%+

### Backend Coverage Target
- Services: 90%+
- Controllers: 85%+
- Guards/Middleware: 80%+

---

## Running All Tests

### Run backend tests
```bash
cd services/auth-service && npm test -- --coverage
cd services/payments-service && npm test -- --coverage
cd services/notifications-service && npm test -- --coverage
```

### Run frontend tests
```bash
cd frontend && npm run test:coverage
```

---

## CI/CD Integration

Tests should run automatically on:
- Pre-commit (husky)
- Pull requests (GitHub Actions)
- Before deployment

Example test command for CI:
```bash
npm test -- --coverage --run
```

---

## Debugging Tests

### Use console.log in tests
```typescript
it('should do something', () => {
  console.log('Debug info:', variable);
  expect(something).toBe(expected);
});
```

### Use debugger
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

### Run single test
```bash
npm test -- LoginPage.spec.tsx
```

---

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it

2. **Use Descriptive Test Names**
   ```typescript
   it('should display error message when login fails', () => {})
   ```

3. **Keep Tests Isolated**
   - Each test should be independent
   - Use beforeEach/afterEach for cleanup

4. **Mock External Dependencies**
   - Mock API calls
   - Mock router navigation
   - Mock localStorage

5. **Test User Interactions**
   - Use userEvent instead of fireEvent when possible
   - Test form submissions
   - Test button clicks

---

## Common Issues & Solutions

### Issue: Tests timeout
**Solution:** Increase timeout in vitest.config.ts
```typescript
test: {
  testTimeout: 10000,
}
```

### Issue: Component not rendering
**Solution:** Ensure providers are wrapped (BrowserRouter, etc.)
```typescript
render(
  <BrowserRouter>
    <Component />
  </BrowserRouter>
);
```

### Issue: localStorage not working
**Solution:** Already mocked in setup.ts, clear before each test
```typescript
beforeEach(() => {
  localStorage.clear();
});
```

---

## Next Steps

1. Run `npm test` to execute all tests
2. Review coverage reports
3. Add tests for new features
4. Integrate with CI/CD pipeline
