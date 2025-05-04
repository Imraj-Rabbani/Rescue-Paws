import mongoose from "mongoose";

const rescueImageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  caption: { 
    type: String,
    maxlength: [500, 'Caption cannot exceed 500 characters'] // Added validation
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Better naming convention (use PascalCase for models)
const RescueImage = mongoose.models.RescueImage || mongoose.model('RescueImage', rescueImageSchema);

export default RescueImage;