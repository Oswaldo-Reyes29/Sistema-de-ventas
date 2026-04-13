const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'bclwooyacjleem4nh2rc-mysql.services.clever-cloud.com',
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER || 'uxumtabrdukmzec1',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '4u8hUkUAQEfB5zeBB5LP',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'bclwooyacjleem4nh2rc',
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = { pool };