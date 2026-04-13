const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
  listarProductos, 
  buscarProductos, 
  obtenerProducto, 
  crearProducto, 
  actualizarProducto, 
  toggleProductoActivo, 
  eliminarProducto 
} = require('../controllers/productoController');

const router = express.Router();

router.get('/', authMiddleware, listarProductos);
router.get('/buscar', authMiddleware, buscarProductos);
router.get('/:id', authMiddleware, obtenerProducto);
router.post('/', authMiddleware, roleMiddleware('admin'), crearProducto);
router.put('/:id', authMiddleware, roleMiddleware('admin'), actualizarProducto);
router.patch('/:id/toggle-activo', authMiddleware, roleMiddleware('admin'), toggleProductoActivo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), eliminarProducto);

module.exports = router;