import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
   trim: true,
  },
  description: {
   type: String,
   required: true,
   trim: true,
  },
  price: {
   type: Number,
   required: true,
   min: 0,
  },
  countInStock: {
   type: Number,
   required: true,
   default: 0,
   min: 0,
  },
  discountPrice: {
   type: Number,
   min: 0,
  },
  sku: {
   type: String,
   required: true,
   trim: true,
   unique: true,
  },
  category: {
   type: String,
   required: true,
   trim: true,
  },
  brand: {
   type: String,
   trim: true,
  },
  sizes: {
   type: [String],
   required: true,
  },
  colors: {
   type: [String],
   required: true,
  },
  collections: {
   type: [String],
   required: true,
  },
  material: {
   type: String,
   trim: true,
  },
  gender: {
   type: String,
   required: true,
   enum: ["Men", "Women", "Unisex"],
  },
  images: [
   {
    url: {
     type: String,
     required: true,
    },
    altText: {
     type: String,
     trim: true,
    },
   },
  ],
  isFeatured: {
   type: Boolean,
   default: false,
  },
  isPublished: {
   type: Boolean,
   default: false,
  },
  rating: {
   type: Number,
   default: 0,
   min: 0,
   max: 5,
  },
  numReviews: {
   type: Number,
   default: 0,
   min: 0,
  },
  tags: {
   type: [String],
  },
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  metaTitle: {
   type: String,
   trim: true,
  },
  metaDescription: {
   type: String,
   trim: true,
  },
  metaKeywords: {
   type: [String],
  },
  dimensions: {
   length: {
    type: Number,
    min: 0,
   },
   width: {
    type: Number,
    min: 0,
   },
   height: {
    type: Number,
    min: 0,
   },
  },
  weight: {
   type: Number,
   min: 0,
  },
 },
 { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
