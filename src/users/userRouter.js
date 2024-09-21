const express = require('express');
const { register, verifyEmail, login, getProfile , renewToken } = require('./userController.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta de registro
router.post('/register', register);

// Ruta de verificación de email
router.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`; // Cambia esta línea

  res.redirect(url); // Redirige al frontend
});

// Ruta de inicio de sesión
router.post('/login', login);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, getProfile);

//renovar token inicio sesión
router.post('/renew-token', renewToken);


module.exports = router;
