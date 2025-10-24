import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRoutes from "./routes/usuariosRoutes.js"; // ✅ Importaciones primero

dotenv.config(); // ✅ Cargar variables de entorno

const app = express(); // ✅ Crear la app ANTES de usarla

app.use(cors());
app.use(express.json());

// ✅ Aquí ya puedes usar la app
app.use("/api/usuarios", usuariosRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
