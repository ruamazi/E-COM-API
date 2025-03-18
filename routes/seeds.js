import { Router } from "express";
import { products } from "../data.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

const router = Router();

router.get("/products", async (req, res) => {
 try {
  await Product.deleteMany({});
  await User.deleteMany({});
  await Cart.deleteMany({});
  const createAdmin = await User.create({
   name: "Admin",
   email: "admin@gmail.com",
   password: "Mohsininho123@",
   role: "admin",
  });
  const userId = createAdmin._id;
  await Product.insertMany(
   products.map((product) => ({ ...product, user: userId }))
  );

  res.json({ message: "seeded" });
 } catch (error) {
  logger.error(error);
  res.status(500).json({ error: "Failed to seed data" });
 }
});

export default router;
