import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/BlogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, upload.single('image'), createBlog);
router.patch('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;