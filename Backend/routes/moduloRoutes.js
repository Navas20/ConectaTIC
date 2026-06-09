import { Router } from 'express';
import {
  listarModulos,
  obtenerModulo,
  obtenerModuloCompleto,
  listarLecciones,
  listarEjercicios,
  obtenerProgreso,
  actualizarProgreso,
} from '../controllers/moduloController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', listarModulos);
router.get('/progreso', verificarToken, obtenerProgreso);
router.put('/progreso', verificarToken, actualizarProgreso);
router.get('/:moduloId/lecciones', listarLecciones);
router.get('/:moduloId/ejercicios', listarEjercicios);
router.get('/:id/completo', obtenerModuloCompleto);
router.get('/:id', obtenerModulo);

export default router;
