const express = require('express');
const { register, verifyEmail, login, getProfile , renewToken, saveFirstLoginAnswers, getProgress, updateProgress } = require('./userController.js');
const { authMiddleware , protect} = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta de registro
router.post('/register', register);

// Ruta de verificación de email
router.get('/verify/:token', verifyEmail);

// Ruta de inicio de sesión
router.post('/login', login);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, getProfile);

//renovar token inicio sesión
router.post('/renew-token', renewToken);

router.post('/first-login-answers', protect, saveFirstLoginAnswers);

router.get('/progress', protect, getProgress);
router.post('/update-progress', protect, updateProgress);


module.exports = router;
