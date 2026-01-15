# Frontend Dashboard

React + Vite + TypeScript frontend para el proyecto de microservicios.

## Estructura Profesional

```
frontend/
├── src/
│   ├── features/                    # Feature modules
│   │   ├── auth/                    # Authentication feature
│   │   │   └── LoginPage.tsx
│   │   └── users/                   # Users feature
│   │       └── Dashboard.tsx
│   ├── shared/                      # Shared code
│   │   ├── components/              # Reusable UI components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUsers.ts
│   │   │   └── index.ts
│   │   ├── services/                # API & business logic
│   │   │   ├── apiClient.ts
│   │   │   └── index.ts
│   │   ├── types/                   # TypeScript types
│   │   │   └── index.ts
│   │   └── utils/                   # Utility functions
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── .env.example                     # Environment template
├── .eslintrc.cjs                    # ESLint config
├── .prettierrc.json                 # Prettier config
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── tailwind.config.js               # Tailwind CSS config
└── package.json
```

## Inicio Rápido

```bash
cd frontend
npm install
npm run dev
```

Accede a http://localhost:5173

## Scripts

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Características

### Authentication
- Login con JWT token
- Token almacenado en localStorage
- Auto-logout si token expira (401)
- Route protection con ProtectedRoute

### Users Management
- Listar todos los usuarios
- Eliminar usuarios
- Estados de carga y error
- Actualización de datos en tiempo real

### Code Quality
- **TypeScript**: Strict mode habilitado
- **ESLint**: Reglas React + TypeScript
- **Prettier**: Code formatting automático
- **Tailwind CSS**: Utility-first CSS framework

## Configuración de Entorno

### Variables disponibles

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Microservices Dashboard
VITE_APP_VERSION=0.1.0
```

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
# Luego editar los valores según tu entorno
```

## Patrones Implementados

### Services Layer
Los servicios (`apiClient`, `authService`, `userService`) manejan:
- Llamadas HTTP con Axios
- Gestión de headers de autenticación
- Manejo centralizado de errores

### Custom Hooks
- `useAuth()`: Manejo de autenticación
- `useUsers()`: Gestión de usuarios

### Protected Routes
Solo usuarios autenticados pueden acceder a `/dashboard`

## Próximas Funcionalidades

- Crear/Editar usuarios
- Gestión de pagos
- Envío de notificaciones
- Dashboard de métricas
- Tests automatizados

