const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'ngo', 'admin'], default: 'user' },
  greenPoints: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema); 