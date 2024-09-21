const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Registro de usuario
exports.register = async (req, res) => {
  const { name, lastName, email, password, birthDate, height, weight, phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Usuario ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, lastName, email, password: hashedPassword, birthDate, height, weight, phoneNumber });

    // Guardar usuario
    await newUser.save();

    // Generar token de verificación
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Configurar nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Tu correo de Gmail
        pass: process.env.GMAIL_PASS, // Tu contraseña de aplicación o la contraseña de tu cuenta
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true, // Para ver mensajes de depuración
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verifica tu correo',
      html: `<h2>Verificación de cuenta</h2><p>Por favor haz click <a href="${process.env.CLIENT_URL}/auth/verify/${token}">aquí</a> para confirmar tu cuenta.</p>`,
    };

    // Enviar correo de confirmación
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error al enviar el correo:', error);
      }
      console.log('Correo enviado:', info.response);
    });

    res.status(201).json({ message: 'Usuario registrado. Verifica tu correo.' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
};

// Confirmación de correo
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    user.confirmed = true; // Marca al usuario como confirmado
    await user.save();

    res.json({ message: 'Correo verificado, puedes iniciar sesión' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por el email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // Comprobar si el usuario ha confirmado su correo
    if (!user.confirmed) return res.status(400).json({ message: 'Por favor, verifica tu correo antes de iniciar sesión.' });

    // Comparar la contraseña ingresada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar un token JWT
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Responder con el token
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // No devolvemos la contraseña
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.renewToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ email: decoded.email, id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: newToken });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};
