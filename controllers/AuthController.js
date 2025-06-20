// controllers/userController.js
import bcrypt from "bcrypt";
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
