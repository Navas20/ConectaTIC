// controllers/usuariosController.js
import { UsuarioModel } from "../models/usuario.js";

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevoId = await UsuarioModel.crearUsuario({ nombre, correo, contrasena });
    res.status(201).json({ message: "Usuario creado con éxito", id: nuevoId });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};
