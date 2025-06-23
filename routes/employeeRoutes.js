// routes/employeeRoutes.js
import express from 'express';
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  getOrgChart,
  updateEmployee,
} from '../controllers/EmployeeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('image'), createEmployee);
router.get('/org-chart', getOrgChart);
router.get('/', getAllEmployees);
router.get('/:id', getEmployee);
router.put('/:id', upload.single('image'), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;