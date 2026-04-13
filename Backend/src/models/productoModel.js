const { pool } = require('../config/db');

const findAll = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY id');
    return rows;
  } catch (error) {
    throw error;
  }
};

const search = async (termino) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM productos WHERE (LOWER(nombre) LIKE LOWER(?) OR LOWER(codigo) LIKE LOWER(?)) AND activo = true`,
      [`%${termino}%`, `%${termino}%`]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const create = async (productoData) => {
  const { codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida } = productoData;
  try {
    const [result] = await pool.query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nombre, descripcion, precio_compra, precio_venta, stock_actual || 0, stock_minimo || 0, unidad_medida || 'unidad']
    );
    const [newProduct] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    return newProduct[0];
  } catch (error) {
    throw error;
  }
};

const update = async (id, productoData) => {
  const { codigo, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida } = productoData;
  try {
    await pool.query(
      `UPDATE productos SET codigo=?, nombre=?, descripcion=?, precio_compra=?, precio_venta=?, stock_minimo=?, unidad_medida=?
       WHERE id = ?`,
      [codigo, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida, id]
    );
    const [updated] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return updated[0];
  } catch (error) {
    throw error;
  }
};

const toggleActivo = async (id, activo) => {
  try {
    await pool.query('UPDATE productos SET activo = ? WHERE id = ?', [activo, id]);
    const [updated] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return updated[0];
  } catch (error) {
    throw error;
  }
};

const remove = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const getLowStock = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE stock_actual <= stock_minimo ORDER BY stock_actual ASC');
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAll,
  search,
  findById,
  create,
  update,
  toggleActivo,
  remove,
  getLowStock
};