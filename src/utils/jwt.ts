const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES_IN;

module.exports.signToken = function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
};

module.exports.verifyToken = function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
};
