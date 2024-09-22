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
      html: `<h2>Verificación de cuenta</h2><p>Por favor haz click <a href="${process.env.CLIENT_URL}/verify-email/${token}">aquí</a> para confirmar tu cuenta.</p>`,
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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    if (!user.confirmed) return res.status(400).json({ message: 'Por favor, verifica tu correo antes de iniciar sesión.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirigir al formulario de preguntas si no se han completado
    if (!user.firstLoginQuestions || Object.keys(user.firstLoginQuestions).length === 0) {
      return res.json({ message: 'Redirigiendo a las preguntas', redirect: '/questions', token });
    }

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Guardar respuestas de las preguntas del primer inicio de sesión
exports.saveFirstLoginAnswers = async (req, res) => {
  try {
    const { category, answers } = req.body; // Recibimos la categoría y las respuestas del frontend
    const userId = req.user._id; // ID del usuario (asumiendo que está autenticado)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizamos la sección correspondiente de firstLoginAnswers
    if (category === 'Datos personales') {
      user.firstLoginAnswers.personalData = answers;
      user.registrationProgress = 'physiologicalData';
    } else if (category === 'Datos fisiológicos-patológicos') {
      user.firstLoginAnswers.physiologicalData = answers;
      user.registrationProgress = 'habits';
    } else if (category === 'Hábitos') {
      user.firstLoginAnswers.habits = answers;
      user.registrationProgress = 'generalQuestions';
    } else if (category === 'Cuestiones Generales') {
      user.firstLoginAnswers.habits = answers;
      user.registrationProgress = 'foodPreferences';
    } else if (category === 'Comida') {
      user.firstLoginAnswers.habits = answers;
      user.registrationProgress = 'training';
    } else if (category === 'Entrenamiento') {
      user.firstLoginAnswers.habits = answers;
      user.registrationProgress = 'caseDescription';
    } else if (category === 'Descripción del Caso') {
      user.firstLoginAnswers.habits = answers;
      user.registrationProgress = 'additionalInfo';
    } else if (category === 'Datos de Interés Adicional') {
      user.firstLoginAnswers.habits = answers;
      user.registrationProgress = 'personalData';
    }

    // Guardamos el progreso en la base de datos
    await user.save();

    return res.status(200).json({ message: 'Respuestas guardadas correctamente', progress: user.registrationProgress });
  } catch (error) {
    return res.status(500).json({ message: 'Error al guardar las respuestas', error });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { progress } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizamos el progreso del usuario
    user.registrationProgress = progress;
    await user.save();

    return res.status(200).json({ message: 'Progreso actualizado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el progreso', error });
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ email: decoded.email, id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: newToken });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};
