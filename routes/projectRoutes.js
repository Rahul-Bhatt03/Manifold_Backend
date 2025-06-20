import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/ProjectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', protect, upload.single('image'), createProject);
router.patch('/:id', protect, upload.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

export default router;