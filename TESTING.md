# Testing Guide

## Frontend Tests (Vitest + React Testing Library)

### Installation
```bash
cd frontend
npm install
```

### Run Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure
- `src/features/auth/LoginPage.spec.tsx` - Login component tests
- `src/features/users/Dashboard.spec.tsx` - Dashboard component tests
- `src/shared/hooks/useAuth.spec.ts` - Auth hook tests
- `src/shared/services/apiClient.spec.ts` - API client tests

### What's Tested
✅ Component rendering
✅ User interactions (input, button clicks)
✅ State management (hooks)
✅ API client functionality
✅ Error handling
✅ Loading states

---

## Backend Tests (Jest)

### Auth Service Tests
```bash
cd services/auth-service

# Run tests
npm test

# Run specific test file
npm test -- auth.service.spec.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

**Test Files:**
- `src/auth/auth.service.spec.ts` - Authentication logic tests
- `src/users/users.service.spec.ts` - User management tests

### What's Tested
✅ User registration with validation
✅ Login with credentials
✅ Password hashing
✅ JWT token generation
✅ Error scenarios (duplicate email, invalid password, etc.)
✅ User CRUD operations

---

## Test Coverage

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
