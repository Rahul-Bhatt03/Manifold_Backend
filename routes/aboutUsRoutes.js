import express from 'express';
import {
  getAllAbouts,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout
} from '../controllers/AboutusController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getAllAbouts);
router.get('/:id', getAboutById);
router.post('/', protect, upload.single('image'), createAbout);
router.patch('/:id', protect, upload.single('image'), updateAbout);
router.delete('/:id', protect, deleteAbout);

export default router;