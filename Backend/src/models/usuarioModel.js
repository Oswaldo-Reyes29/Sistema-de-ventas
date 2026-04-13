const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const findAll = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY id'
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const create = async (usuarioData) => {
  const { nombre, email, password, rol } = usuarioData;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol || 'vendedor']
    );
    const [newUser] = await pool.query(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?',
      [result.insertId]
    );
    return newUser[0];
  } catch (error) {
    throw error;
  }
};

const update = async (id, usuarioData) => {
  const { nombre, email, rol } = usuarioData;
  try {
    await pool.query(
      'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
      [nombre, email, rol, id]
    );
    const [updated] = await pool.query(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?',
      [id]
    );
    return updated[0];
  } catch (error) {
    throw error;
  }
};

const toggleActivo = async (id, activo) => {
  try {
    await pool.query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, id]);
    const [updated] = await pool.query(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?',
      [id]
    );
    return updated[0];
  } catch (error) {
    throw error;
  }
};

const remove = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const verifyCredentials = async (email, password) => {
  try {
    const user = await findByEmail(email);
    if (!user) return null;
    if (!user.activo) return null;
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return null;
    
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  toggleActivo,
  remove,
  verifyCredentials
};