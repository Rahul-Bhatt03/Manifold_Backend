// routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, UserDetails, updateUser, verifyPassword, updatePassword } from "../controllers/AuthController.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/user-details/:id',UserDetails)
router.patch(`/update-user/:id`,updateUser)
router.post('/verify-password/:id', verifyPassword);
router.patch('/update-password/:id', updatePassword);


export default router;
