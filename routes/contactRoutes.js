// routes/contactRoutes.js
import express from 'express';
import {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/ContactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createContact);
router.get('/:id', protect, getContactById);
router.patch('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

export default router;
