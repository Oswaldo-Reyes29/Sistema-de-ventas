const { pool } = require('../config/db');

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM productos ORDER BY id');
  return rows;
};
const search = async (termino) => {
  const [rows] = await pool.query(`SELECT * FROM productos WHERE (LOWER(nombre) LIKE LOWER(?) OR LOWER(codigo) LIKE LOWER(?)) AND activo = true`, [`%${termino}%`, `%${termino}%`]);
  return rows;
};
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0];
};
const create = async (data) => {
  const { codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida } = data;
  const [result] = await pool.query(`INSERT INTO productos (codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida) VALUES (?,?,?,?,?,?,?,?)`, [codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual || 0, stock_minimo || 0, unidad_medida || 'unidad']);
  const [newProd] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
  return newProd[0];
};
const update = async (id, data) => {
  const { codigo, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida } = data;
  await pool.query(`UPDATE productos SET codigo=?, nombre=?, descripcion=?, precio_compra=?, precio_venta=?, stock_minimo=?, unidad_medida=? WHERE id=?`, [codigo, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida, id]);
  return findById(id);
};
const toggleActivo = async (id, activo) => {
  await pool.query('UPDATE productos SET activo=? WHERE id=?', [activo, id]);
  return findById(id);
};
const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM productos WHERE id=?', [id]);
  return result.affectedRows > 0;
};
const getLowStock = async () => {
  const [rows] = await pool.query('SELECT * FROM productos WHERE stock_actual <= stock_minimo ORDER BY stock_actual ASC');
  return rows;
};
module.exports = { findAll, search, findById, create, update, toggleActivo, remove, getLowStock };