import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../utils/upload.js'; // Import Multer configuration

const uploadRouter = express.Router();

// Properly ordered middleware chain:
uploadRouter.post(
  '/rescue',
  userAuth,            // 1. First authenticate user
  upload.single('image'), // 2. Then handle file upload
  uploadImage          // 3. Finally process the upload
);

export default uploadRouter;