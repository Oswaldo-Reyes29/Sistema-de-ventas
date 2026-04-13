const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
  registrarVenta, 
  listarVentas, 
  obtenerDetalleVenta 
} = require('../controllers/ventaController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'vendedor'), registrarVenta);
router.get('/', authMiddleware, roleMiddleware('admin', 'vendedor'), listarVentas);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), obtenerDetalleVenta);

module.exports = router;