// controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1000m",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: `Email ${email} is already registered.` });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    const savedUser = await newUser.save();
    const accessToken = generateAccessToken(savedUser);

    return res.status(201).json({ user: savedUser, accessToken });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server Error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(401).json({ message: "User not found with this email." });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const accessToken = generateAccessToken(existingUser);
    return res.status(200).json({ user: existingUser, token: accessToken });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error during login" });
  }
};

export const UserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("UserDetails Error:", error.message);
    res.status(500).json({ message: "Server Error fetching user details" });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is being updated and if it already exists
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ 
        username: req.body.username,
        _id: { $ne: req.params.id } // Exclude current user
      });
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } 
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("UpdateUser Error:", error.message);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: validationErrors.join(', ') });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ message: `${field} already exists` });
    }
    
    res.status(500).json({ message: "Server Error updating user" });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(req.params.id).select("password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({ verified: true });
  } catch (error) {
    console.error("VerifyPassword Error:", error.message);
    res.status(500).json({ message: "Server Error verifying password" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Basic password validation
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    );

    // Remove password from response for security
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("UpdatePassword Error:", error.message);
    res.status(500).json({ message: "Server Error updating password" });
  }
};