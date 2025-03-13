const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    }
  },
  { timestamps: true }
);

// Hash password before saving, but avoid double hashing
userSchema.pre('save', async function (next) {
  // If password hasn't been modified, just continue
  if (!this.isModified('password')) return next();
  
  // If the password already appears to be hashed, skip hashing
  if (
    this.password.startsWith('$2a$') ||
    this.password.startsWith('$2b$') ||
    this.password.startsWith('$2y$')
  ) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');
