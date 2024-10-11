const express = require('express');
const { register, verifyEmail, login, getProfile, renewToken } = require('./userController.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta de registro
router.post('/register', register);

// Ruta de verificación de email (con token como parámetro)
router.get('/verify-email/:token', verifyEmail);

// Ruta de inicio de sesión
router.post('/login', login);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, getProfile);

// Ruta para renovar el token de inicio de sesión
router.post('/renew-token', renewToken);

module.exports = router;
