const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/rbac');
const bcrypt = require('bcryptjs');

// GET /api/users - Admin can see all employees
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users - Admin can add new employees
router.post('/users', auth, isAdmin, async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || 'MEMBER',
      phone
    });

    res.status(201).json({ message: 'Employee added', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

module.exports = router;
