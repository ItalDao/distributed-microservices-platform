# Frontend Dashboard

React + Vite frontend para el proyecto de microservicios.

## Inicio Rápido

```bash
cd frontend
npm install
npm run dev
```

Accede a http://localhost:5173

## Estructura

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          (Autenticación)
│   │   └── Dashboard.jsx      (Listar usuarios)
│   ├── utils/
│   │   └── api.js             (API calls + interceptores)
│   ├── App.jsx                (Rutas)
│   ├── main.jsx               (Entry point)
│   └── index.css              (Tailwind)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## Funcionalidades

### ✅ Login
- Email + Password
- Guarda JWT en localStorage
- Redirect a dashboard

### ✅ Dashboard Users
- Tabla de usuarios
- Botón eliminar
- Logout

## Próximos

- Crear Pagos
- Enviar Notificaciones
- Métricas en tiempo real

## Deploy

```bash
npm run build
# Genera carpeta dist/
```
