import { getDb } from '../config/db.js';

export const UsuarioModel = {
  // ============================================================
  // Buscar usuario por correo
  // ============================================================
  async findByEmail(correo) {
    try {
      const db = getDb();
      const result = await db.query(
        'SELECT id, nombre, correo, password, progreso FROM usuarios WHERE correo = $1',
        [correo]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error en findByEmail:', error.message);
      throw error;
    }
  },

  // ============================================================
  // Buscar usuario por ID
  // ============================================================
  async findById(id) {
    try {
      const db = getDb();
      const result = await db.query(
        'SELECT id, nombre, correo, progreso FROM usuarios WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error en findById:', error.message);
      throw error;
    }
  },

  // ============================================================
  // Obtener todos los usuarios
  // ============================================================
  async getAll() {
    try {
      const db = getDb();
      const result = await db.query(
        'SELECT id, nombre, correo, progreso FROM usuarios ORDER BY id DESC'
      );
      return result.rows || [];
    } catch (error) {
      console.error('❌ Error en getAll:', error.message);
      throw error;
    }
  },

  // ============================================================
  // Crear nuevo usuario
  // ============================================================
  async create({ nombre, correo, password }) {
    try {
      const db = getDb();
      const result = await db.query(
        'INSERT INTO usuarios (nombre, correo, password, progreso) VALUES ($1, $2, $3, 0) RETURNING id',
        [nombre, correo, password]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Error en create:', error.message);
      throw error;
    }
  },

  // ============================================================
  // Actualizar usuario (por ID)
  // ============================================================
  async updateById(id, updates) {
    try {
      const allowedFields = ['nombre', 'correo'];
      const updateFields = {};

      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
          updateFields[key] = updates[key];
        }
      });

      if (Object.keys(updateFields).length === 0) {
        return this.findById(id);
      }

      const db = getDb();
      const keys = Object.keys(updateFields);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const values = Object.values(updateFields);

      await db.query(
        `UPDATE usuarios SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id]
      );

      return this.findById(id);
    } catch (error) {
      console.error('❌ Error en updateById:', error.message);
      throw error;
    }
  },

  // ============================================================
  // Actualizar progreso del usuario
  // ============================================================
  async updateProgress(id, incremento) {
    try {
      const user = await this.findById(id);
      if (!user) return null;

      const nuevoProgreso = Math.min(100, Math.max(0, user.progreso + incremento));

      const db = getDb();
      await db.query(
        'UPDATE usuarios SET progreso = $1 WHERE id = $2',
        [nuevoProgreso, id]
      );

      return nuevoProgreso;
    } catch (error) {
      console.error('❌ Error en updateProgress:', error.message);
      throw error;
    }
  },

  // ============================================================
  // Eliminar usuario por ID
  // ============================================================
  async deleteById(id) {
    try {
      const db = getDb();
      const result = await db.query(
        'DELETE FROM usuarios WHERE id = $1',
        [id]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('❌ Error en deleteById:', error.message);
      throw error;
    }
  }
};

export default UsuarioModel;