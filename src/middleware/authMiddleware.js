const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // El token se suele pasar en el header de Authorization como "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadimos la información del usuario al objeto req para usarlo en las rutas
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;