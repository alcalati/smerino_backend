const User = require('./userModel');

// Encontrar un usuario por email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Crear un nuevo usuario
exports.createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

// Encontrar un usuario por ID
exports.findUserById = async (id) => {
  return await User.findById(id).select('-password'); // Excluir la contraseña en el resultado
};
