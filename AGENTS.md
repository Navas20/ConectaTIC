# AGENTS.md - ConectaTIC

## Project Structure

```
ConectaTIC/
├── Backend/              # Node.js + Express API
│   ├── server.js        # Entry point (port 3000)
│   ├── config/db.js     # MySQL connection
│   ├── controllers/     # authController.js, usuariosController.js
│   ├── routes/          # auth.js, usuariosRoutes.js
│   ├── middlewares/     # authMiddleware.js (JWT verification)
│   └── models/          # usuario.js
└── frontend/
    └── conectatic_app/  # Flutter app
        └── lib/main.dart  # Entry point
```

## Commands

- **Backend**: `cd Backend && npm run dev` (runs on http://localhost:3000)
- **Frontend**: `cd frontend/conectatic_app && flutter run`

## API Endpoints

- Base URL: `http://localhost:3000/api/auth`
- Routes: `auth.js` handles auth endpoints, `usuariosRoutes.js` handles user management
- Database: MySQL (configured in `Backend/config/db.js`)

## Important Details

- Frontend uses `10.0.2.2` to reach localhost from Android emulator
- JWT authentication with bcrypt password hashing
- No formal tests configured (`npm test` is a placeholder)

## Key Files

- `README_DOCUMENTACION.md` - Explains all documentation and code comments
- `DOCUMENTACION_PROYECTO.md` - Full project architecture and API docs
- `GUIA_CONCEPTOS_CLAVE.md` - Technical concepts guide