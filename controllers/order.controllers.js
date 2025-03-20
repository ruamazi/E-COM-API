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
  const order = await Order.findById(orderId).exec();
  if (!order) {
   return res.status(404).json({ error: "Order not found" });
  }
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  if (
   (order.status !== "Delivered" && order.status !== "Cancelled") ||
   order.createdAt > threeMonthsAgo
  ) {
   return res.status(400).json({
    error:
     "Only orders that are 'Delivered' or 'Cancelled' and older than 3 months can be deleted.",
   });
  }
  await Order.findByIdAndDelete(orderId);
  res.json({ message: "Order deleted successfully" });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to delete order" });
 }
};
