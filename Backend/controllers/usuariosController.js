import pool from "../config/db.js";

// GET: todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// POST: crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res
        .status(400)
        .json({ message: "nombre, correo y contrasena son obligatorios" });
    }

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)",
      [nombre, correo, contrasena]
    );

    res.status(201).json({
      message: "Usuario creado con éxito",
      id: result.insertId,
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);

    // Manejar correo duplicado
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    res.status(500).json({ message: "Error al crear usuario" });
  }
};


// PUT: actualizar progreso
export const actualizarProgreso = async (req, res) => {
  try {
    const { idUsuario, incremento } = req.body;

    if (!idUsuario || incremento == null) {
      return res
        .status(400)
        .json({ message: "idUsuario e incremento son obligatorios" });
    }

    const [resultadoUpdate] = await pool.query(
      "UPDATE usuarios SET progreso = LEAST(100, progreso + ?) WHERE id = ?",
      [incremento, idUsuario]
    );

    if (resultadoUpdate.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const [rows] = await pool.query(
      "SELECT progreso FROM usuarios WHERE id = ?",
      [idUsuario]
    );

    res.json({
      message: "Progreso actualizado",
      progreso: rows[0].progreso,
    });

  } catch (error) {
    console.error("Error al actualizar progreso:", error);
    res.status(500).json({ message: "Error al actualizar progreso" });
  }
};

