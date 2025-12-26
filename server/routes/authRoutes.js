import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Simple email format check
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the 'pre save' hook in the model
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        completedSteps: user.completedSteps,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        completedSteps: user.completedSteps,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Update user profile (name/email)
// @route   PUT /api/auth/update
// @access  Private
router.put('/update', protect, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      // Check if new email is already taken
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;

    const updated = await user.save();

    res.json({ _id: updated._id, name: updated.name, email: updated.email, completedSteps: updated.completedSteps });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  try {
    // Include password for verification
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // Will be hashed by pre('save') hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

export default router;