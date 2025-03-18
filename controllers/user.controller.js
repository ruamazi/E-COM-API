import User from "../models/User.js";
import {
 createPayload,
 createToken,
 verifyUserIdType,
} from "../utils/helpers.js";
import { validateRegistration } from "../utils/validation.js";

export const registerUaer = async (req, res) => {
 const { name, email, password } = req.body;
 try {
  const validationError = validateRegistration(name, email, password);
  if (validationError) {
   return res.status(400).json({ error: validationError });
  }
  const existingUser = await User.findOne({
   $or: [{ name }, { email }],
  }).exec();
  if (existingUser) {
   return res.status(400).json({ error: "Email already exists" });
  }
  const user = await User.create({ name, email, password });
  const payload = createPayload(user);
  const token = createToken(payload);
  res.status(201).json({
   token,
   user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "customer",
   },
  });
 } catch (err) {
  console.error("Registration error:", err);
  res.status(500).json({ error: "Registration failed" });
 }
};

export const loginUser = async (req, res) => {
 try {
  const { email, password } = req.body;
  if (!email || !password) {
   return res.status(400).json({ error: "email and password required" });
  }
  const user = await User.findOne({ email }).exec();
  if (!user) {
   return res.status(401).json({ error: "Invalid credentials" });
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
   return res.status(401).json({ error: "Invalid credentials" });
  }
  const payload = createPayload(user);
  const token = createToken(payload);
  res.json({
   token,
   user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
   },
  });
 } catch (err) {
  console.error("Login error:", err);
  res.status(500).json({ error: "Authentication failed" });
 }
};

export const getUserById = async (req, res) => {
 const userId = req.params.id;
 if (!verifyUserIdType(userId)) {
  return res.status(400).json({ error: "Invalid user ID" });
 }
 try {
  const user = await User.findById(userId).exec();
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  res.json({
   user: {
    name: user.name,
    email: user.email,
    role: user.role,
   },
  });
 } catch (err) {
  console.error("Get user error:", err);
  res.status(500).json({ error: "Failed to retrieve user" });
 }
};

export const changeRole = async (req, res) => {
 const userId = req.params.id;
 const { role } = req.body;
 if (!verifyUserIdType(userId)) {
  return res.status(400).json({ error: "Invalid user ID" });
 }
 try {
  const user = await User.findByIdAndUpdate(
   userId,
   { role },
   { new: true }
  ).exec();
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  res.json({ message: "Role updated successfully" });
 } catch (err) {
  console.error("Change role error:", err);
  res.status(500).json({ error: "Failed to update role" });
 }
};
