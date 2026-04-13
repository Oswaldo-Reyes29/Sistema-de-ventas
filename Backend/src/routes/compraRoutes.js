const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
  registrarCompra, 
  listarCompras, 
  obtenerDetalleCompra 
} = require('../controllers/compraController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), registrarCompra);
router.get('/', authMiddleware, roleMiddleware('admin', 'vendedor'), listarCompras);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), obtenerDetalleCompra);

module.exports = router;