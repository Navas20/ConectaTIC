// models/usuario.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Crear conexión con la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "conectatic_bd",
});

// Modelo de Usuario
export const UsuarioModel = {
  // Obtener todos los usuarios
  async obtenerUsuarios() {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
  },

  // Crear un nuevo usuario
  async crearUsuario({ nombre, correo, contrasena }) {
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)",
      [nombre, correo, contrasena]
    );
    return result.insertId;
  },

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(id) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  },

  // Eliminar usuario
  async eliminarUsuario(id) {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
