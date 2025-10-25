const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
const registerUser = async (req, res) => {
  try {
    console.log('Register user request received:', req.body);
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    if (user) {
      console.log('User registered successfully:', user.id);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        rewards: user.rewards,
        token: generateToken(user.id)
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    // Check for user email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', user.id);
    
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (user && isMatch) {
      console.log('Login successful for user:', user.id);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        rewards: user.rewards,
        token: generateToken(user.id)
      });
    } else {
      console.log('Invalid credentials for user:', user.id);
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    console.log('Get user profile request for user:', req.user.id);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      rewards: req.user.rewards
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    console.log('Update user profile request for user:', req.user.id, 'with data:', req.body);
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        console.log('Email already in use:', email);
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update user
    const [updated] = await User.update(
      { name, email },
      { where: { id: req.user.id } }
    );
    
    if (updated) {
      const user = await User.findByPk(req.user.id);
      console.log('User profile updated:', user.id);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        rewards: user.rewards
      });
    } else {
      console.log('User not found for update:', req.user.id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};