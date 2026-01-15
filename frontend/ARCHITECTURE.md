# Frontend - Estructura Profesional

## Status

✅ **Dev Server running** en http://localhost:5173

## Transformación Completada

### De MVP a Producción

```
ANTES (Quick MVP)
├── src/pages/*.jsx
├── src/utils/api.js
└── Sin tipado

AHORA (Profesional)
├── src/features/          # Módulos por feature
│   ├── auth/LoginPage.tsx
│   └── users/Dashboard.tsx
├── src/shared/            # Código compartido
│   ├── components/        # Componentes reutilizables
│   ├── hooks/            # Custom hooks
│   ├── services/         # API + business logic
│   ├── types/            # TypeScript interfaces
│   └── utils/
├── TypeScript (.tsx)
├── ESLint + Prettier
└── Env config por entorno
```

## Tecnologías

| Aspecto | Herramienta | Version |
|---------|------------|---------|
| Framework | React | 18.2.0 |
| Build Tool | Vite | 5.0.0 |
| Lenguaje | TypeScript | 5.3.0 |
| HTTP Client | Axios | 1.6.0 |
| Routing | React Router | 6.20.0 |
| Styling | Tailwind CSS | 3.4.0 |
| Linting | ESLint | 8.0.0 |
| Formatting | Prettier | 3.0.0 |

## Arquitectura

### Features-Based

Cada funcionalidad = carpeta independiente con su propio contexto:

```
src/features/auth/
├── LoginPage.tsx      # Componente principal
└── (index.ts para exports)

src/features/users/
├── Dashboard.tsx      # Componente principal
└── (index.ts para exports)
```

### Shared Layer

Código reutilizable y agnóstico:

```
src/shared/
├── components/
│   └── ProtectedRoute.tsx    # Guard de rutas
├── hooks/
│   ├── useAuth.ts            # Auth logic
│   ├── useUsers.ts           # Users data
│   └── index.ts
├── services/
│   ├── apiClient.ts          # Axios instance + interceptores
│   └── index.ts              # authService, userService
├── types/
│   └── index.ts              # Todas las interfaces
└── utils/
    └── (funciones helper)
```

## Patrones Implementados

### 1. Service Layer Tipado

```typescript
// services/index.ts
export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse>
  getToken: (): string | null
  isAuthenticated: (): boolean
}
```

### 2. Custom Hooks Reutilizables

```typescript
// hooks/useAuth.ts
const { user, isLoading, error, login, logout } = useAuth()

// hooks/useUsers.ts
const { users, isLoading, deleteUser, fetchUsers } = useUsers()
```

### 3. Protected Routes

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 4. API Client Global

```typescript
// Interceptores automáticos
- Request: Agrega token JWT
- Response: Auto-logout si 401
```

## Code Quality

### Linting

```bash
npm run lint
```

ESLint rules:
- Strict TypeScript mode
- React Hooks compliance
- No any types (warn)

### Formatting

```bash
npm run format
```

Prettier config:
- Semicolons
- Single quotes
- 2 space indent
- 100 char line width

## Flujo de Desarrollo

### Dev

```bash
npm run dev
```

Vite + HMR (Hot Module Replacement)
- Cambios en código = reload automático
- Preserva estado de componentes

### Build

```bash
npm run build
```

Genera `dist/` optimizado para producción.

### Preview

```bash
npm run preview
```

Simula el build localmente.

## Variables de Entorno

Copiar `.env.example` a `.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Microservices Dashboard
VITE_APP_VERSION=0.1.0
```

Usadas como: `import.meta.env.VITE_API_URL`

## Próximos Pasos

- [ ] Tests unitarios (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Error boundary components
- [ ] Toast notifications
- [ ] Formularios con validación
- [ ] Paginación en tabla
- [ ] Dark mode
- [ ] i18n (internacionalización)

## Comandos Útiles

```bash
# Dev con reload
npm run dev

# Build producción
npm run build

# Lint check
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format código
npm run format

# Preview build
npm run preview
```

## Debugging

Si hay errores en TypeScript:
1. Verifica `tsconfig.json`
2. Busca tipos en `src/shared/types/`
3. Usa `strict: true` para catch errores

Si el API falla:
1. Verifica `.env.local` con URLs correctas
2. Revisa `Network` tab en DevTools
3. Busca logs en `src/shared/services/apiClient.ts`

## Notas

- Todos los componentes son funcionales (React 18+ style)
- Hooks personalizados para lógica reutilizable
- TypeScript strict mode = menos bugs
- Services desacoplados = fácil testing
