const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  productosBajoStock, 
  ventasPorFecha,
  resumenDashboard
} = require('../controllers/reporteController');

const router = express.Router();

router.get('/stock-bajo', authMiddleware, productosBajoStock);
router.get('/ventas-por-fecha', authMiddleware, ventasPorFecha);
router.get('/dashboard', authMiddleware, resumenDashboard);

module.exports = router;