import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../utils/upload.js'; 

const uploadRouter = express.Router();

// Properly ordered middleware chain:
uploadRouter.post(
  '/rescue',
  userAuth,            
  upload.single('image'), 
  uploadImage          
);

export default uploadRouter;