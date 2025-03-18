import mongoose from "mongoose";

const checkoutItemSchema = new mongoose.Schema(
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

const checkoutSchema = new mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  checkoutItems: [checkoutItemSchema],
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
   enum: ["Paypal", "Credit Card", "Stripe"], //added by me
   default: "Stripe",
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
  paymentDetails: {
   type: mongoose.Schema.Types.Mixed,
  },
  isFinalized: {
   type: Boolean,
   default: false,
  },
  finalizedAt: Date,
 },
 { timestamps: true }
);

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
