const rateLimit = require('express-rate-limit');

const windowMin = parseInt(process.env.RATE_LIMIT_WINDOW_MIN || '60', 10);
const maxReq = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

const limiter = rateLimit({
  windowMs: windowMin * 60 * 1000,
  max: maxReq,
  message: { error: `Too many requests. Limit is ${maxReq} per ${windowMin} minutes` },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;
