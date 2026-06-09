import { getDb } from '../config/db.js';

export const UsuarioModel = {
  async findByEmail(correo) {
    try {
      const db = getDb();
      const [rows] = await db.query(
        'SELECT id, nombre, correo, password, progreso FROM usuarios WHERE correo = ?',
        [correo]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('❌ Error en findByEmail:', error.message);
      throw error;
    }
  },

  async findById(id) {
    try {
      const db = getDb();
      const [rows] = await db.query(
        'SELECT id, nombre, correo, progreso FROM usuarios WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('❌ Error en findById:', error.message);
      throw error;
    }
  },

  async getAll() {
    try {
      const db = getDb();
      const [rows] = await db.query(
        'SELECT id, nombre, correo, progreso FROM usuarios ORDER BY id DESC'
      );
      return rows;
    } catch (error) {
      console.error('❌ Error en getAll:', error.message);
      throw error;
    }
  },

  async create({ nombre, correo, password }) {
    try {
      const db = getDb();
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, correo, password, progreso) VALUES (?, ?, ?, 0)',
        [nombre, correo, password]
      );
      return result.insertId;
    } catch (error) {
      console.error('❌ Error en create:', error.message);
      throw error;
    }
  },

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
      const setClause = keys.map((key) => `${key} = ?`).join(', ');
      const values = Object.values(updateFields);

      await db.query(
        `UPDATE usuarios SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return this.findById(id);
    } catch (error) {
      console.error('❌ Error en updateById:', error.message);
      throw error;
    }
  },

  async updateProgress(id, incremento) {
    try {
      const user = await this.findById(id);
      if (!user) return null;

      const nuevoProgreso = Math.min(100, Math.max(0, user.progreso + incremento));

      const db = getDb();
      await db.query(
        'UPDATE usuarios SET progreso = ? WHERE id = ?',
        [nuevoProgreso, id]
      );

      return nuevoProgreso;
    } catch (error) {
      console.error('❌ Error en updateProgress:', error.message);
      throw error;
    }
  },

  async deleteById(id) {
    try {
      const db = getDb();
      const [result] = await db.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Error en deleteById:', error.message);
      throw error;
    }
  }
};

export default UsuarioModel;