const { pool } = require('../config/db');

const create = async (compraData) => {
  const { proveedor_id, usuario_id, items } = compraData;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    let total = 0;
    for (const item of items) {
      total += item.cantidad * item.precio_unitario;
    }
    
    const [compraResult] = await connection.query(
      'INSERT INTO compras (proveedor_id, usuario_id, total) VALUES (?, ?, ?)',
      [proveedor_id, usuario_id, total]
    );
    const compra_id = compraResult.insertId;
    
    for (const item of items) {
      await connection.query(
        'INSERT INTO compras_detalle (compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [compra_id, item.producto_id, item.cantidad, item.precio_unitario]
      );
      await connection.query(
        'UPDATE productos SET stock_actual = stock_actual + ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }
    
    await connection.commit();
    return { compra_id, total };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findAll = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, p.nombre as proveedor_nombre, u.nombre as usuario_nombre
      FROM compras c
      JOIN proveedores p ON c.proveedor_id = p.id
      JOIN usuarios u ON c.usuario_id = u.id
      ORDER BY c.fecha DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    const [compra] = await pool.query('SELECT * FROM compras WHERE id = ?', [id]);
    if (compra.length === 0) return null;
    
    const [detalles] = await pool.query(`
      SELECT cd.*, p.nombre as producto_nombre, p.codigo as producto_codigo
      FROM compras_detalle cd
      JOIN productos p ON cd.producto_id = p.id
      WHERE cd.compra_id = ?
    `, [id]);
    
    return { compra: compra[0], detalles };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  findAll,
  findById
};