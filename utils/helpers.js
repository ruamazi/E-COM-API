import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const createPayload = (user) => {
 return {
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
 };
};

export const createToken = (payload) => {
 return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyUserIdType = (id) => {
 return mongoose.Types.ObjectId.isValid(id);
};
