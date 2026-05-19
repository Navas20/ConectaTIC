import express from "express";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarProgreso,   // 👈 nuevo import
} from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);

// ✅ NUEVA RUTA PARA PROGRESO
router.put("/progreso", actualizarProgreso);

export default router;
