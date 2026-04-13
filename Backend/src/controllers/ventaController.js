const ventaModel = require('../models/ventaModel');

const registrarVenta = async (req, res, next) => {
  const { cliente_nombre, cliente_documento, items } = req.body;
  const usuario_id = req.user.id;
  
  if (!cliente_nombre || !cliente_nombre.trim()) {
    return res.status(400).json({ error: 'El nombre del cliente es requerido' });
  }
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Debe incluir al menos un producto' });
  }
  
  try {
    const resultado = await ventaModel.create({ 
      usuario_id, 
      cliente_nombre, 
      cliente_documento, 
      items 
    });
    res.status(201).json({ 
      mensaje: 'Venta registrada exitosamente', 
      venta_id: resultado.venta_id,
      total: resultado.total
    });
  } catch (error) {
    next(error);
  }
};

const listarVentas = async (req, res, next) => {
  try {
    const ventas = await ventaModel.findAll();
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

const obtenerDetalleVenta = async (req, res, next) => {
  const { id } = req.params;
  try {
    const venta = await ventaModel.findById(id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarVenta,
  listarVentas,
  obtenerDetalleVenta
};