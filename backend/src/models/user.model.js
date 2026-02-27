const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 20 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /.+@.+\..+/ },
    age: { type: Number, required: true, min: 1, max: 100 },
    city: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
