import mongoose = require('mongoose');

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model<IUser>('User', UserSchema);
