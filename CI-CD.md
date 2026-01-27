# CI/CD Pipeline Guide

## Overview

This project uses GitHub Actions for continuous integration and continuous deployment. The pipeline automatically runs tests, scans for security issues, and can deploy to production.

## Automated Workflows

### 1. Tests Workflow (.github/workflows/tests.yml)

**Trigger**: Push to main or develop branches, Pull Requests

**Jobs:**
- **test-backend**: Runs unit tests for all 3 microservices
  - Installs dependencies
  - Runs Jest test suite
  - Uploads coverage reports to Codecov
  
- **test-frontend**: Runs frontend tests (optional)
  - Installs dependencies
  - Runs Vitest
  - Generates coverage reports

Backend tests: 19/19 passing in under 5 seconds

### 2. Security Workflow (.github/workflows/security.yml)

**Trigger**: Push to main branch, Weekly schedule (Monday 00:00 UTC)

**Jobs:**
- **dependency-scan**: Scans for vulnerable npm packages
  - Runs npm audit on all services
  - Fails if moderate or higher vulnerabilities found
  
- **code-scan**: Static code analysis with CodeQL
  - Analyzes TypeScript/JavaScript code
  - Detects potential security issues
  - Generates SARIF report
  
- **docker-scan**: Scans Docker images for vulnerabilities
  - Uses Trivy to scan images
  - Reports to GitHub Security tab

### 3. Deploy Workflow (.github/workflows/deploy.yml)

**Trigger**: Push to main branch (manual trigger available)

**Jobs:**
- **deploy**: Builds and pushes Docker images
  - Requires Docker Hub credentials
  - Builds all service images
  - Pushes to Docker registry
  - Deploys to production

Status: Ready for configuration

### 4. Documentation Workflow (.github/workflows/documentation.yml)

**Trigger**: Changes to docs/ or .md files on main

**Jobs:**
- **build-docs**: Validates markdown and checks links
  - Validates markdown syntax
  - Checks all links are valid
  - Builds documentation site
  
- **deploy-docs**: Deploys to GitHub Pages

## Setup Instructions

### 1. Required GitHub Secrets

For deployment to work, add these secrets to your repository settings (`Settings > Secrets and variables > Actions`):

```
DOCKER_USERNAME       # Docker Hub username
DOCKER_PASSWORD       # Docker Hub personal access token
```

#### How to create Docker credentials:
```bash
# 1. Create account at https://hub.docker.com
# 2. Generate access token:
#    - Account Settings > Security > New Access Token
# 3. Add to GitHub Secrets:
#    - DOCKER_USERNAME: your-docker-username
#    - DOCKER_PASSWORD: your-access-token (not password!)
```

### 2. Enable GitHub Actions

1. Go to repository **Settings**
2. Click **Actions** in left sidebar
3. Select "Allow all actions and reusable workflows"
4. Click **Save**

### 3. Enable GitHub Pages (for documentation)

1. Go to repository **Settings**
2. Click **Pages** in left sidebar
3. Under "Source", select `GitHub Actions`
4. Save

## Workflow Details

### Test Workflow

```yaml
# Matrix strategy tests each service independently
strategy:
  matrix:
    service: [auth-service, payments-service, notifications-service]
```

**What gets tested:**
- auth-service: 10/10 unit tests
- users-service: 8/8 unit tests
- app-controller: 1/1 test
- **Total**: 19 tests in parallel

**Performance**: ~5-6 seconds total

### Security Workflow

**npm audit levels:**
- `low` - Ignored
- `moderate` - Warnings
- `high/critical` - Fails build

**CodeQL languages:** JavaScript, TypeScript

**Trivy scanning:** All Docker images for CVEs

### Deploy Workflow

```bash
# Steps:
1. Checkout code
2. Setup Docker Buildx (multi-arch builds)
3. Login to Docker Hub (using secrets)
4. Build images for: auth-service, payments-service, notifications-service
5. Push images: your-username/service-name:latest
```

**Manual deployment:**
- Go to **Actions** tab
- Select **Deploy** workflow
- Click **Run workflow**

## Monitoring & Results

### View Workflow Results

1. Go to **Actions** tab in repository
2. Click on workflow name
3. Select specific run
4. View job logs and status

### Check Test Results

```bash
# View test summary in workflow logs
# Look for: "Tests: 19 passed, 19 total"

# View coverage reports
# Coverage HTML reports available as artifacts
```

### View Security Reports

1. Go to **Security** tab
2. Click **Code scanning alerts**
3. View identified issues
4. Review and close alerts as needed

## Best Practices

### Branch Protection Rules

Enable for `main` branch:
1. Require status checks to pass before merging
2. Require test workflows to pass
3. Dismiss stale pull request approvals when new commits are pushed
4. Require code review before merge

**Setup:**
1. Go to **Settings > Branches**
2. Click **Add rule** under "Branch protection rules"
3. Enter `main` as branch name pattern
4. Enable the options above

### Pull Request Checks

The pipeline automatically:
- Runs all tests when PR is created
- Reports coverage changes
- Checks for security issues
- Validates code quality
- Blocks merge if tests fail

### Local Testing Before Push

```bash
# Run tests locally before pushing
cd services/auth-service
npm test

# Check for linting issues
npm run lint

# Format code
npm run format

# Then push only if all pass
git push origin feat/my-feature
```

## Troubleshooting

### Tests Failing in CI but Passing Locally

Common causes:
1. **Environment variables**: CI doesn't have .env file
   - Solution: Use GitHub Secrets for sensitive data
   
2. **Node version mismatch**: Local vs CI
   - Solution: Specify `node-version: '20'` in workflow
   
3. **Database not available**: Tests require real DB
   - Solution: Use mocks (our tests do this)

### Docker Build Failing

```bash
# Check Docker credentials
# Make sure DOCKER_USERNAME and DOCKER_PASSWORD secrets are set

# Debug locally:
docker build -t test-image .
docker run test-image npm test
```

### Workflow Not Triggering

**Check:**
1. Branch is `main` or `develop` (for tests)
2. Workflow file exists at `.github/workflows/name.yml`
3. Workflow syntax is valid (GitHub shows errors)
4. Actions are enabled in repository settings

## Examples

### Example: Adding a New Service

When adding a new service:

1. **Create service folder**: `services/new-service/`
2. **Add tests**: `src/**/*.spec.ts`
3. **Update test workflow**:
   ```yaml
   strategy:
     matrix:
       service: [auth-service, payments-service, notifications-service, new-service]
   ```
4. **Push and watch CI run tests**

### Example: Fixing a Failed Test

```bash
# 1. See what failed in Actions tab
# 2. Run locally
cd services/auth-service
npm test

# 3. Fix the issue
# 4. Run tests again to verify
npm test

# 5. Commit and push
git add .
git commit -m "fix(tests): resolve timeout issue"
git push
```

## Advanced Configuration

### Custom Coverage Threshold

Edit `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

### Parallel Test Execution

Add to workflow:
```yaml
- name: Run tests in parallel
  run: npm test -- --runInBand=false --maxWorkers=4
```

### Upload Test Artifacts

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
    flags: backend
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [CodeQL Action](https://github.com/github/codeql-action)
- [Trivy GitHub Action](https://github.com/aquasecurity/trivy-action)
