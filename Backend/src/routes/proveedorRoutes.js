const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
  listarProveedores, 
  obtenerProveedor,
  crearProveedor, 
  actualizarProveedor, 
  eliminarProveedor 
} = require('../controllers/proveedorController');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), listarProveedores);
router.get('/:id', authMiddleware, roleMiddleware('admin'), obtenerProveedor);
router.post('/', authMiddleware, roleMiddleware('admin'), crearProveedor);
router.put('/:id', authMiddleware, roleMiddleware('admin'), actualizarProveedor);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), eliminarProveedor);

module.exports = router;