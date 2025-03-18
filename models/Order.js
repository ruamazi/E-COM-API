import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
 {
  productId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Product",
   required: true,
  },
  name: {
   type: String,
   required: true,
  },
  image: {
   type: String,
   required: true,
  },
  price: {
   type: Number,
   required: true,
  },
  quantity: {
   type: Number,
   required: true,
  },
  size: String,
  color: String,
 },
 { _id: false }
);

const orderSchema = new mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
   address: {
    type: String,
    required: true,
   },
   city: {
    type: String,
    required: true,
   },
   postalCode: {
    type: String,
    required: true,
   },
   country: {
    type: String,
    required: true,
   },
   phone: String,
  },
  paymentMethod: {
   type: String,
   //    enum: ["Paypal", "Credit Card", "Stripe"], //added by me
   //    default: "Stripe",
  },
  totalPrice: {
   type: Number,
   required: true,
  },
  isPaid: {
   type: Boolean,
   default: false,
  },
  paidAt: Date,
  paymentStatus: {
   type: String,
   enum: ["Pending", "Paid", "Failed"],
   default: "Pending",
  },
  status: {
   type: String,
   enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
   default: "Processing",
  },
  //   paymentDetails: {
  //    type: mongoose.Schema.Types.Mixed,
  //   },
  isDelivered: {
   type: Boolean,
   default: false,
  },
  deliveredAt: Date,
 },
 { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
