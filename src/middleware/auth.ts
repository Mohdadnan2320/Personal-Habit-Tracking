const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
