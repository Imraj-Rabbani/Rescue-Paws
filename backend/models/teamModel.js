import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  activities: [{
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('Team', teamSchema);
