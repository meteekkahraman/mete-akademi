const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ 
  username: { type: String, required: true, unique: true }, 
  firstName: String, lastName: String, email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, role: { type: String, default: 'student' },
  xp: { type: Number, default: 0 }, title: { type: String, default: 'Çaylak' },
  friends: [{ type: String }],
  currentRoom: { id: { type: String, default: 'offline' }, topic: { type: String, default: '' }, enteredAt: { type: Date, default: null } },
  isBanned: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);