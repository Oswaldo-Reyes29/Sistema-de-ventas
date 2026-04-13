const productoModel = require('../models/productoModel');

const listarProductos = async (req, res, next) => {
  try { res.json(await productoModel.findAll()); } catch (error) { next(error); }
};
const buscarProductos = async (req, res, next) => {
  const { termino } = req.query;
  if (!termino) return listarProductos(req, res, next);
  try { res.json(await productoModel.search(termino)); } catch (error) { next(error); }
};
const obtenerProducto = async (req, res, next) => {
  try {
    const prod = await productoModel.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(prod);
  } catch (error) { next(error); }
};
const crearProducto = async (req, res, next) => {
  try {
    const nuevo = await productoModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) { next(error); }
};
const actualizarProducto = async (req, res, next) => {
  try {
    const actualizado = await productoModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) { next(error); }
};
const toggleProductoActivo = async (req, res, next) => {
  try {
    const actualizado = await productoModel.toggleActivo(req.params.id, req.body.activo);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) { next(error); }
};
const eliminarProducto = async (req, res, next) => {
  try {
    const eliminado = await productoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { listarProductos, buscarProductos, obtenerProducto, crearProducto, actualizarProducto, toggleProductoActivo, eliminarProducto };