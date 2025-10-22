import mongoose = require('mongoose');

export interface ITrackLog extends mongoose.Document {
  habit: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  date: string; 
  createdAt: Date;
  updatedAt: Date;
}

const Schema = mongoose.Schema;

const TrackLogSchema = new Schema({
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
}, { timestamps: true });

TrackLogSchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model<ITrackLog>('TrackLog', TrackLogSchema);
