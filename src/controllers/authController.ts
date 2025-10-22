const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtUtil = require('../utils/jwt');

module.exports.register = async function register(req: any, res: any) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'User registered successfully. Please log in.' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports.login = async function login(req: any, res: any) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwtUtil.signToken({ id: user._id });
    res.json({ message: 'Logged in', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
