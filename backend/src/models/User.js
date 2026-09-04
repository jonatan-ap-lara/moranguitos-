const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: function() { return !this.googleId; } },
  googleId: { type: String, unique: true, sparse: true },
  avatar: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  businessName: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);