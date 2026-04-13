const { pool } = require('../config/db');

const create = async ({ usuario_id, cliente_nombre, cliente_documento, items }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    let total = 0;
    for (const item of items) {
      const [rows] = await connection.query('SELECT precio_venta, stock_actual FROM productos WHERE id = ?', [item.producto_id]);
      if (rows.length === 0) throw new Error(`Producto ${item.producto_id} no existe`);
      if (rows[0].stock_actual < item.cantidad) throw new Error(`Stock insuficiente para producto ID ${item.producto_id}`);
      total += rows[0].precio_venta * item.cantidad;
    }
    const [ventaResult] = await connection.query('INSERT INTO ventas (usuario_id, cliente_nombre, cliente_documento, total) VALUES (?,?,?,?)', [usuario_id, cliente_nombre, cliente_documento, total]);
    const venta_id = ventaResult.insertId;
    for (const item of items) {
      const [prod] = await connection.query('SELECT precio_venta FROM productos WHERE id = ?', [item.producto_id]);
      await connection.query('INSERT INTO ventas_detalle (venta_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)', [venta_id, item.producto_id, item.cantidad, prod[0].precio_venta]);
      await connection.query('UPDATE productos SET stock_actual = stock_actual - ? WHERE id = ?', [item.cantidad, item.producto_id]);
    }
    await connection.commit();
    return { venta_id, total };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    ORDER BY v.fecha DESC
  `);
  return rows;
};
const findById = async (id) => {
  const [venta] = await pool.query('SELECT * FROM ventas WHERE id = ?', [id]);
  if (venta.length === 0) return null;
  const [detalles] = await pool.query(`
    SELECT vd.*, p.nombre as producto_nombre, p.codigo as producto_codigo
    FROM ventas_detalle vd
    JOIN productos p ON vd.producto_id = p.id
    WHERE vd.venta_id = ?
  `, [id]);
  return { venta: venta[0], detalles };
};
const findByDateRange = async (inicio, fin) => {
  const [rows] = await pool.query('SELECT * FROM ventas WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC', [inicio, fin]);
  return rows;
};
module.exports = { create, findAll, findById, findByDateRange };