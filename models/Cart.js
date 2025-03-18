import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
 {
  productId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Product",
   required: true,
  },
  name: String,
  image: String,
  price: Number,
  color: String,
  size: String,
  quantity: {
   type: Number,
   default: 1,
   min: 1,
  },
 },
 { _id: false }
);

const cartSchema = new mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
  },
  guestId: String,
  products: [cartItemSchema],
  totalPrice: {
   type: Number,
   default: 0,
   readOnly: true,
  },
 },
 { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
