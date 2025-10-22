const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

module.exports = async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};
