const userService = require('./userService');
const userRepository = require('./userRepository');
const nodemailer = require('nodemailer');

// Registro de usuario
exports.register = async (req, res) => {
  const { name, lastName, email, password, birthDate, height, weight, phoneNumber } = req.body;
  try {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Usuario ya registrado' });

    const hashedPassword = await userService.hashPassword(password);
    const newUser = await userRepository.createUser({ name, lastName, email, password: hashedPassword, birthDate, height, weight, phoneNumber });

    const token = userService.generateToken(newUser);

    // Configurar nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verifica tu correo',
      html: `<h2>Verificación de cuenta</h2><p>Por favor haz click <a href="${process.env.CLIENT_URL}/verify-email/${token}">aquí</a> para confirmar tu cuenta.</p>`,
    };

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
  console.log('Token recibido en la verificación:', req.params.token);

  try {
    const decoded = userService.verifyToken(token);
    const user = await userRepository.findUserByEmail(decoded.email);

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    user.confirmed = true; // Marca al usuario como confirmado
    await user.save();

    res.json({ message: 'Correo verificado exitosamente.' });
  } catch (error) {
    console.error('Error en la verificación:', error);
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    if (!user.confirmed) return res.status(400).json({ message: 'Por favor, verifica tu correo antes de iniciar sesión.' });

    const isPasswordValid = await userService.comparePassword(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = userService.generateToken(user);

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener perfil de usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Renovar token
exports.renewToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = userService.verifyToken(token);
    const newToken = userService.generateToken({ email: decoded.email, id: decoded.id });

    res.json({ token: newToken });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};
