import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/ServiceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', protect, upload.single('image'), createService);
router.patch('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

export default router;