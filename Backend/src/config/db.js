const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST,     // Railway usa MYSQLHOST
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10
});


const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida');
    connection.release();
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
  }
};

testConnection();

module.exports = { pool };