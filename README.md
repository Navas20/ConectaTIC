# ConectaTIC — App Universitaria

[![Tests](https://img.shields.io/badge/tests-67%20passed-brightgreen)](https://github.com/Navas20/ConectaTIC)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-blue)](https://flutter.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

App móvil + backend que conecta estudiantes y docentes de la Universidad de La Guajira. Permite gestionar horarios, calificaciones, notificaciones y comunicación académica.

## Tech Stack

| Frontend | Backend | Base de Datos | DevOps |
|---|---|---|---|
| Flutter 3.x | Express.js | PostgreSQL | Vercel Serverless |
| Riverpod | JWT (bcrypt + refresh) | Migraciones SQL | CI/CD |
| GoRouter | Helmet.js | | ESLint |

## Características

- 15+ pantallas con navegación GoRouter
- Autenticación JWT con access + refresh tokens y bcrypt
- 8 endpoints REST documentados
- Rate limiting, CORS, sanitización anti SQL injection
- Arquitectura MVC modular con componentes reutilizables (-40% código)
- 67 tests automatizados: unitarios, integración y seguridad

## Testing

```
Mocha + Chai + Supertest

67 tests:
  ✓ Unitarios (controllers, models, utils)
  ✓ Integración (endpoints, middleware)
  ✓ Seguridad (SQL injection, XSS, CSRF, rate limit)
  ✓ Validación de inputs
  ✓ Autenticación JWT
```

## Instalación

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev

# Frontend
cd frontend
flutter pub get
flutter run
```

## SCRUM

Sprints de 2 semanas con planificación, daily y retrospectiva. Desarrollo guiado por historias de usuario priorizadas.
