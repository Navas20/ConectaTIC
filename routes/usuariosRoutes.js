// routes/usuariosRoutes.js
import express from "express";
import { obtenerUsuarios, crearUsuario } from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);

export default router;
