const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
  listarUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  toggleUsuarioActivo, 
  eliminarUsuario 
} = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), listarUsuarios);
router.post('/', authMiddleware, roleMiddleware('admin'), crearUsuario);
router.put('/:id', authMiddleware, roleMiddleware('admin'), actualizarUsuario);
router.patch('/:id/toggle-activo', authMiddleware, roleMiddleware('admin'), toggleUsuarioActivo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), eliminarUsuario);

module.exports = router;