import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },  // ✅ fix here
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },    // ✅ and here
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TeamInvite', inviteSchema);
