const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (allowedRoles.includes(req.user.rol)) {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
  };
};

module.exports = roleMiddleware;