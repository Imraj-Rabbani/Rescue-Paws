import RescueImage from "../models/imageModel.js";
import upload  from '../utils/upload.js'; // Uncomment this
import fs from 'fs';
import path from 'path';

// Ensure upload directory exists
const initUploadDir = () => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'rescue-images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};
initUploadDir();


export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = `/uploads/rescue-images/${req.file.filename}`;
    const caption = req.body.caption;
    const { userId } = req;

    const rescueImage = new RescueImage({
      userId,
      imageUrl,
      caption,
      createdAt: new Date(),
    });

    await rescueImage.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl,
      caption,
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up uploaded file if error occurred
    if (req.file) {
      fs.unlinkSync(path.join(process.cwd(), req.file.path));
    }
    
    res.status(500).json({ error: "Server error during upload" });
  }
};