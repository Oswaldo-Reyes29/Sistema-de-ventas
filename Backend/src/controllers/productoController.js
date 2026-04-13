const productoModel = require('../models/productoModel');

const listarProductos = async (req, res, next) => {
  try {
    const productos = await productoModel.findAll();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const buscarProductos = async (req, res, next) => {
  const { termino } = req.query;
  if (!termino) return listarProductos(req, res, next);
  try {
    const productos = await productoModel.search(termino);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const obtenerProducto = async (req, res, next) => {
  const { id } = req.params;
  try {
    const producto = await productoModel.findById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const crearProducto = async (req, res, next) => {
  const { codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida } = req.body;
  try {
    const nuevoProducto = await productoModel.create({
      codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código de producto ya existe' });
    }
    next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida } = req.body;
  try {
    const productoActualizado = await productoModel.update(id, {
      codigo, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida
    });
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
};

const toggleProductoActivo = async (req, res, next) => {
  const { id } = req.params;
  const { activo } = req.body;
  try {
    const productoActualizado = await productoModel.toggleActivo(id, activo);
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarProducto = async (req, res, next) => {
  const { id } = req.params;
  try {
    const eliminado = await productoModel.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarProductos,
  buscarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  toggleProductoActivo,
  eliminarProducto
};