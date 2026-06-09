import * as moduloService from '../services/moduloService.js';
import { successResponse } from '../utils/responseFormatter.js';
import ApiError from '../utils/ApiError.js';

export const listarModulos = async (req, res, next) => {
  try {
    const modulos = await moduloService.obtenerModulos();
    return successResponse(res, 200, 'Módulos obtenidos', modulos);
  } catch (error) {
    next(error);
  }
};

export const obtenerModulo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw ApiError.badRequest('ID de módulo inválido');
    const modulo = await moduloService.obtenerModuloPorId(id);
    return successResponse(res, 200, 'Módulo obtenido', modulo);
  } catch (error) {
    next(error);
  }
};

export const obtenerModuloCompleto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw ApiError.badRequest('ID de módulo inválido');
    const modulo = await moduloService.obtenerModuloPorId(id);
    const lecciones = await moduloService.obtenerLeccionesPorModulo(id);
    const ejercicios = await moduloService.obtenerEjerciciosPorModulo(id);
    return successResponse(res, 200, 'Módulo completo obtenido', {
      ...modulo,
      lecciones,
      ejercicios,
    });
  } catch (error) {
    next(error);
  }
};

export const listarLecciones = async (req, res, next) => {
  try {
    const moduloId = parseInt(req.params.moduloId);
    if (isNaN(moduloId)) throw ApiError.badRequest('ID de módulo inválido');
    const lecciones = await moduloService.obtenerLeccionesPorModulo(moduloId);
    return successResponse(res, 200, 'Lecciones obtenidas', lecciones);
  } catch (error) {
    next(error);
  }
};

export const listarEjercicios = async (req, res, next) => {
  try {
    const moduloId = parseInt(req.params.moduloId);
    if (isNaN(moduloId)) throw ApiError.badRequest('ID de módulo inválido');
    const ejercicios = await moduloService.obtenerEjerciciosPorModulo(moduloId);
    return successResponse(res, 200, 'Ejercicios obtenidos', ejercicios);
  } catch (error) {
    next(error);
  }
};

export const obtenerProgreso = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const progreso = await moduloService.obtenerProgresoUsuario(usuarioId);
    return successResponse(res, 200, 'Progreso obtenido', progreso);
  } catch (error) {
    next(error);
  }
};

export const actualizarProgreso = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const { modulo_id, leccion_actual, leccion_completada, quiz_completado } = req.body;
    if (!modulo_id) throw ApiError.badRequest('modulo_id es requerido');
    const progreso = await moduloService.actualizarProgresoModulo(usuarioId, modulo_id, {
      leccion_actual,
      leccion_completada,
      quiz_completado,
    });
    return successResponse(res, 200, 'Progreso actualizado', progreso);
  } catch (error) {
    next(error);
  }
};
