import mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  frequency: { type: String, enum: ['daily','weekly'], default: 'daily' },
  tags: { type: [String], default: [] },
  reminderTime: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
