import Cart from "../models/Cart.js";
import Checkout from "../models/Checkout.js";
import Order from "../models/Order.js";

export const createCheckout = async (req, res) => {
 const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
 if (!checkoutItems || checkoutItems.length === 0) {
  return res.status(400).json({ error: " Checkout items required" });
 }
 try {
  // Create checkout session
  const newCheckout = await Checkout.create({
   user: req.user._id,
   checkoutItems,
   shippingAddress,
   paymentMethod,
   totalPrice,
   paymentStatus: "Pending",
   isPaid: false,
  });
  await newCheckout.save();
  // Send response with session ID
  console.log(`Checkout created for user ${req.user._id}`);
  res.status(201).json(newCheckout);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to create checkout" });
 }
};

// Update checkout to mark as paid after successful payment
export const updateCheckout = async (req, res) => {
 const { paymentStatus, paymentDetails } = req.body;
 const { id } = req.params;
 try {
  const checkout = await Checkout.findById(id).exec();
  if (!checkout) {
   return res.status(404).json({ error: "Checkout not found" });
  }
  if (paymentStatus === "Paid") {
   checkout.paymentStatus = paymentStatus;
   checkout.paymentDetails = paymentDetails;
   checkout.isPaid = true;
   checkout.paidAt = Date.now();
   await checkout.save();
   console.log(`Checkout ${id} marked as paid`);
   return res.status(200).json(checkout);
  } else {
   res.status(400).json({ error: "Payment failed" });
  }
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to update checkout" });
 }
};

// Finalize checkout and convert to an order after payment is successful
export const finalizeCheckout = async (req, res) => {
 const { id } = req.params;
 try {
  const checkout = await Checkout.findById(id).exec();
  if (!checkout) {
   return res.status(404).json({ error: "Checkout not found" });
  }
  if (checkout.isPaid && !checkout.isFinalized) {
   const finalOrder = await Order.create({
    user: checkout.user,
    orderItems: checkout.checkoutItems,
    shippingAddress: checkout.shippingAddress,
    paymentMethod: checkout.paymentMethod,
    totalPrice: checkout.totalPrice,
    isPaid: true,
    paidAt: checkout.paidAt,
    paymentStatus: "Paid",
    paymentDetails: checkout.paymentDetails,
   });
   checkout.isFinalized = true;
   checkout.finalizedAt = Date.now();
   await checkout.save();
   await Cart.findOneAndDelete({ user: checkout.user }).exec();
   console.log(
    `Checkout ${id} finalized and converted to order ${finalOrder._id}`
   );
   res.status(200).json(finalOrder);
  } else if (checkout.isFinalized) {
   res.status(400).json({ error: "Checkout already finalized" });
  } else {
   res.status(400).json({ error: "Checkout not paid" });
  }
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to finalize checkout" });
 }
};
