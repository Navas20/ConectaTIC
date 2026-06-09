import { getDb } from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const obtenerModulos = async () => {
  const db = getDb();
  const result = await db.query(
    'SELECT id, titulo, descripcion, icono, color, video_path, orden FROM modulos ORDER BY orden'
  );
  return result.rows;
};

export const obtenerModuloPorId = async (id) => {
  const db = getDb();
  const result = await db.query(
    'SELECT id, titulo, descripcion, icono, color, video_path, orden FROM modulos WHERE id = $1',
    [id]
  );
  if (!result.rows[0]) throw ApiError.notFound('Módulo no encontrado');
  return result.rows[0];
};

export const obtenerLeccionesPorModulo = async (moduloId) => {
  const db = getDb();
  const result = await db.query(
    'SELECT id, modulo_id, titulo, contenido, icono, orden FROM lecciones WHERE modulo_id = $1 ORDER BY orden',
    [moduloId]
  );
  return result.rows;
};

export const obtenerEjerciciosPorModulo = async (moduloId) => {
  const db = getDb();
  const result = await db.query(
    `SELECT id, modulo_id, tipo, pregunta, opciones, correcto, orden_palabras, orden_correcto, explicacion, orden
     FROM ejercicios WHERE modulo_id = $1 ORDER BY orden`,
    [moduloId]
  );
  return result.rows.map(e => ({
    ...e,
    opciones: e.opciones ? JSON.parse(e.opciones) : null,
    orden_palabras: e.orden_palabras ? JSON.parse(e.orden_palabras) : null,
    orden_correcto: e.orden_correcto ? JSON.parse(e.orden_correcto) : null,
  }));
};

export const obtenerProgresoUsuario = async (usuarioId) => {
  const db = getDb();
  const result = await db.query(
    `SELECT pu.id, pu.modulo_id, m.titulo, pu.leccion_actual, pu.leccion_completada, pu.quiz_completado, pu.ultimo_acceso
     FROM progreso_usuario pu
     JOIN modulos m ON m.id = pu.modulo_id
     WHERE pu.usuario_id = $1
     ORDER BY m.orden`,
    [usuarioId]
  );
  return result.rows;
};

export const actualizarProgresoModulo = async (usuarioId, moduloId, datos) => {
  const db = getDb();
  const existente = await db.query(
    'SELECT id FROM progreso_usuario WHERE usuario_id = $1 AND modulo_id = $2',
    [usuarioId, moduloId]
  );

  if (existente.rows[0]) {
    const sets = [];
    const valores = [];
    let idx = 1;
    if (datos.leccion_actual !== undefined) {
      sets.push(`leccion_actual = $${idx++}`);
      valores.push(datos.leccion_actual);
    }
    if (datos.leccion_completada !== undefined) {
      sets.push(`leccion_completada = $${idx++}`);
      valores.push(datos.leccion_completada);
    }
    if (datos.quiz_completado !== undefined) {
      sets.push(`quiz_completado = $${idx++}`);
      valores.push(datos.quiz_completado);
    }
    sets.push(`ultimo_acceso = CURRENT_TIMESTAMP`);
    valores.push(existente.rows[0].id);
    await db.query(
      `UPDATE progreso_usuario SET ${sets.join(', ')} WHERE id = $${idx}`,
      valores
    );
  } else {
    await db.query(
      `INSERT INTO progreso_usuario (usuario_id, modulo_id, leccion_actual, leccion_completada, quiz_completado)
       VALUES ($1, $2, $3, $4, $5)`,
      [usuarioId, moduloId, datos.leccion_actual || 0, datos.leccion_completada || false, datos.quiz_completado || false]
    );
  }

  return obtenerProgresoUsuario(usuarioId);
};

export default {
  obtenerModulos,
  obtenerModuloPorId,
  obtenerLeccionesPorModulo,
  obtenerEjerciciosPorModulo,
  obtenerProgresoUsuario,
  actualizarProgresoModulo,
};
