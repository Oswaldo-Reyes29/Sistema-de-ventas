const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor', 
    mensaje: err.message 
  });
};

module.exports = errorMiddleware;