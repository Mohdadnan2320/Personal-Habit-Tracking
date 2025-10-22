const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const rateLimitMiddleware = require('./middleware/rateLimit');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(rateLimitMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.get('/', (req: any, res: any) => res.json({ ok: true, msg: 'Habit Tracker API' }));

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
