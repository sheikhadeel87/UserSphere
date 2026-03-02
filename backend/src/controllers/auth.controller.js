const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if max admins reached (limit to 3)
      const adminCount = await Admin.countDocuments();
      if (adminCount >= 3) {
        return res.status(403).json({ message: 'Registration closed. Maximum admin limit reached.' });
      }
  
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Create admin
      const admin = await Admin.create({ name, email, password });
      
      // Generate token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.status(201).json({
        token,
        user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', details: error.message });
    }
  };

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Invalid email or password' });
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
        return next(error);
    }
};

async function getMe (req, res) {
    res.json({ user: req.user });
  };

module.exports = { register, login, getMe };