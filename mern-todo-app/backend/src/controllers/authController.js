const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const userSafe = { _id: newUser._id, username: newUser.username, email: newUser.email };
    return res.status(201).json({ user: userSafe });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user' ,error:error.message});
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    const userSafe = { _id: user._id, username: user.username, email: user.email };
    return res.status(200).json({ token, user: userSafe });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in' });
  }
};

exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  return res.status(200).json({ user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
};
