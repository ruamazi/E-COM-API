import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { validateRegistration } from "../utils/validation.js";

// export const getAdminDashboard = (req, res) => {
//  res.json({ message: "Welcome to the admin dashboard" });
// };

export const getAllUsers = async (req, res) => {
 try {
  const users = await User.find().exec();
  res.json(users);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve users" });
 }
};

export const addNewUser = async (req, res) => {
 const { name, email, password, role } = req.body;
 try {
  const validationError = validateRegistration(name, email, password);
  if (validationError) {
   return res.status(400).json({ error: validationError });
  }
  const userExists = await User.findOne({ email }).exec();
  if (userExists) {
   return res.status(400).json({ error: "User already exists" });
  }
  const user = await User.create({
   name,
   email,
   password,
   role: role || "customer",
  });
  res.status(201).json({ message: "User added successfully", user });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to add new user" });
 }
};

export const updateUser = async (req, res) => {
 const userId = req.params.id;
 const { name, email, role } = req.body;
 try {
  const user = await User.findByIdAndUpdate(
   userId,
   { name, email, role: role.toLowerCase() },
   { new: true }
  ).exec();
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  res.json({ message: "User updated successfully", user });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to update user" });
 }
};

export const deleteUser = async (req, res) => {
 const userId = req.params.id;
 try {
  const user = await User.findByIdAndDelete(userId).exec();
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  res.json({ message: "User deleted successfully" });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to delete user" });
 }
};

export const getAllProducts = async (req, res) => {
 try {
  const products = await Product.find().exec();
  res.json(products);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve products" });
 }
};

export const createProduct = async (req, res) => {
 const {
  name,
  description,
  price,
  discountPrice,
  countInStock,
  sku,
  category,
  brand,
  sizes,
  colors,
  collections,
  material,
  gender,
  images,
  isFeatured,
  isPublished,
  rating,
  numReviews,
  tags,
  metaTitle,
  metaDescription,
  metaKeywords,
  dimensions,
  weight,
 } = req.body;
 if (
  !name ||
  !description ||
  !price ||
  !countInStock ||
  !sku ||
  !category ||
  !sizes ||
  !colors ||
  !collections ||
  !gender ||
  !images
 ) {
  return res.status(400).json({ error: "Missing required fields" });
 }
 try {
  const product = await Product.create({
   name,
   description,
   price,
   discountPrice,
   countInStock,
   sku,
   category,
   brand,
   sizes,
   colors,
   collections,
   material,
   gender,
   images,
   isFeatured,
   isPublished,
   rating,
   numReviews,
   tags,
   metaTitle,
   metaDescription,
   metaKeywords,
   dimensions,
   weight,
   user: req.user._id,
  });
  res.status(201).json(product);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to create product" });
 }
};

export const updateProduct = async (req, res) => {
 const productId = req.params.id;
 const {
  name,
  description,
  price,
  countInStock,
  sku,
  category,
  sizes,
  colors,
  collections,
  brand,
  material,
  gender,
  images,
  isFeatured,
  isPublished,
  rating,
  numReviews,
  tags,
  metaTitle,
  metaDescription,
  metaKeywords,
  dimensions,
  weight,
  discountPrice,
 } = req.body;
 try {
  const product = await Product.findByIdAndUpdate(
   productId,
   {
    name,
    description,
    price,
    countInStock,
    sku,
    category,
    sizes,
    colors,
    collections,
    gender,
    images,
    isFeatured,
    isPublished,
    rating,
    numReviews,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    weight,
    brand,
    material,
    discountPrice,
   },
   { new: true }
  ).exec();
  res.json(product);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to update product" });
 }
};

export const deleteProduct = async (req, res) => {
 const productId = req.params.id;
 try {
  const product = await Product.findByIdAndDelete(productId).exec();
  if (!product) {
   return res.status(404).json({ error: "Product not found" });
  }
  res.json({ message: "Product deleted successfully" });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to delete product" });
 }
};

export const getAllOrders = async (req, res) => {
 try {
  const orders = await Order.find().populate("user", "name email").exec();
  //get total orders
  const totalOrders = orders.length;
  //get total sales
  const totalSales = orders.reduce(
   (total, order) => total + order.totalPrice,
   0
  );
  res.json({ orders, totalOrders, totalSales });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve orders" });
 }
};

export const updateOrderStatus = async (req, res) => {
 const orderId = req.params.id;
 const { status } = req.body;
 try {
  const order = await Order.findById(orderId)
   .populate("user", "name email")
   .exec();
  if (!order) {
   return res.status(404).json({ error: "Order not found" });
  }
  order.status = status || order.status;
  order.isDelivered = status === "Delivered" ? true : order.isDelivered;
  order.deliveredAt = status === "Delivered" ? Date.now() : order.deliveredAt;
  await order.save();
  res.json({ message: "Order status updated successfully", order });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to update order status." });
 }
};

export const deleteOrder = async (req, res) => {
 const orderId = req.params.id;
 try {
  const order = await Order.findByIdAndDelete(orderId).exec();
  if (!order) {
   return res.status(404).json({ error: "Order not found" });
  }
  res.json({ message: "Order deleted successfully" });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to delete order" });
 }
};
