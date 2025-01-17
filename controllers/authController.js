const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ username, email, password: hashedPassword, isAdmin: true });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(`User found for email ${email}:`, user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match for user ${email}:`, isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`JWT generated for user ${email}:`, token);

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: error.message });
  }
};
