const mongoose = require('mongoose');
const Habit = require('../models/Habit');
const TrackLog = require('../models/TrackLog');
const dateUtil = require('../utils/date');

module.exports.createHabit = async function createHabit(req: any, res: any) {
  try {
    const user = req.user;
    const { title, description, frequency = 'daily', tags = [], reminderTime = null } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const habit = await Habit.create({
      user: user._id,
      title,
      description,
      frequency,
      tags,
      reminderTime
    });
    res.status(201).json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getHabits = async function getHabits(req: any, res: any) {
  try {
    const user = req.user;
    const page = Math.max(parseInt(String(req.query.page || '1'), 10), 1);
    const limit = Math.max(parseInt(String(req.query.limit || '10'), 10), 1);
    const tag = req.query.tag ? String(req.query.tag) : null;

    const query: any = { user: user._id };
    if (tag) query.tags = tag;

    const total = await Habit.countDocuments(query);
    const habits = await Habit.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ data: habits, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getHabit = async function getHabit(req: any, res: any) {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const habit = await Habit.findOne({ _id: id, user: user._id });
    if (!habit) return res.status(404).json({ error: 'Not found' });
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.updateHabit = async function updateHabit(req: any, res: any) {
  try {
    const user = req.user;
    const { id } = req.params;
    const payload = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const habit = await Habit.findOneAndUpdate({ _id: id, user: user._id }, payload, { new: true });
    if (!habit) return res.status(404).json({ error: 'Not found' });
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.deleteHabit = async function deleteHabit(req: any, res: any) {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const habit = await Habit.findOneAndDelete({ _id: id, user: user._id });
    if (!habit) return res.status(404).json({ error: 'Not found' });

    await TrackLog.deleteMany({ habit: id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.trackHabit = async function trackHabit(req: any, res: any) {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const habit = await Habit.findOne({ _id: id, user: user._id });
    if (!habit) return res.status(404).json({ error: 'Not found' });

    const date = dateUtil.todayISO();

    try {
      const log = await TrackLog.create({ habit: id, user: user._id, date });
      return res.status(201).json({ message: 'Tracked for today', log });
    } catch (err: any) {
      if (err && (err.code === 11000 || err.code === '11000')) {
        return res.status(400).json({ error: 'Already tracked today' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getHabitHistory = async function getHabitHistory(req: any, res: any) {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const habit = await Habit.findOne({ _id: id, user: user._id });
    if (!habit) return res.status(404).json({ error: 'Not found' });

    const days = dateUtil.lastNDays(7); 
    const logs = await TrackLog.find({ habit: id, date: { $in: days } }).lean();

    const presentDates = new Set(logs.map((l: any) => l.date));
    const history = days.map((d: string) => ({ date: d, completed: presentDates.has(d) }));

    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].completed) streak++;
      else break;
    }

    res.json({ habitId: id, history, streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
