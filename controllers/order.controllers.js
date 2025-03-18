import Order from "../models/Order.js";

export const getMyOrders = async (req, res) => {
 try {
  const orders = await Order.find({ user: req.user._id })
   .sort({ createdAt: -1 })
   .exec();
  res.json(orders);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve orders" });
 }
};

export const getOrderById = async (req, res) => {
 const orderId = req.params.id;
 try {
  const order = await Order.findById(orderId)
   .populate("user", "name email")
   .exec();
  if (!order) {
   return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve order" });
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
