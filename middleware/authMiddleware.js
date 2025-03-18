import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function protectRoute(req, res, next) {
 try {
  if (
   !req.headers.authorization ||
   !req.headers.authorization.startsWith("Bearer ")
  ) {
   return res.status(401).json({ error: "Unauthorized - No token provided" });
  }
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password").exec();
  if (!user) {
   return res.status(401).json({ error: "Unauthorized - Invalid user" });
  }
  req.user = user;
  next();
 } catch (error) {
  console.error("JWT Verification Error:", error);
  if (error.name === "JsonWebTokenError") {
   return res.status(401).json({ error: "Unauthorized - Invalid token" });
  } else if (error.name === "TokenExpiredError") {
   return res.status(401).json({ error: "Unauthorized - Token expired" });
  } else {
   return res.status(500).json({ error: "Internal server error" });
  }
 }
}

// middleware to check if user is admin
export function isAdmin(req, res, next) {
 if (req.user.role !== "admin") {
  return res.status(401).json({ error: "Unauthorized - Not an admin" });
 }
 next();
}
