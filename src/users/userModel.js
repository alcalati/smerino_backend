const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  birthDate: Date,
  height: Number,
  weight: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: String,
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Otros campos del formulario completo.
});
const User = mongoose.model('User', userSchema);
module.exports = User;
