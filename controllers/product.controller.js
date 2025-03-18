import Product from "../models/Product.js";

export const getProductBySort = async (req, res) => {
 const {
  collection,
  size,
  color,
  gender,
  minPrice,
  maxPrice,
  sortBy,
  category,
  search,
  material,
  brand,
  limit,
  tag,
 } = req.query;
 // console.log("Received query parameters:", req.query);
 try {
  const query = {};
  if (collection && collection.toLowerCase() !== "all") {
   query.collections = collection;
  }
  if (category && category.toLowerCase() !== "all") {
   query.category = category;
  }
  if (material) {
   query.material = { $in: material.toLowerCase().split(",") };
  }
  if (brand) {
   query.brand = { $in: brand.toLowerCase().split(",") };
  }
  if (size) {
   query.sizes = { $in: size.toUpperCase().split(",") }; // Ensure consistent case
  }
  if (color) {
   query.colors = { $in: color.split(",").map((c) => c.toLowerCase()) }; // Normalize colors
  }
  if (gender) {
   query.gender = gender;
  }
  if (tag) {
   query.tags = { $in: tag.toLowerCase().split(",") };
  }
  if (minPrice || maxPrice) {
   query.price = {};
   if (minPrice) query.price.$gte = Number(minPrice);
   if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
   query.$or = [
    { name: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } },
   ];
  }
  let sort = {};
  if (sortBy) {
   switch (sortBy) {
    case "priceAsc":
     sort = { price: 1 };
     break;
    case "priceDesc":
     sort = { price: -1 };
     break;
    case "popularity":
     sort = { numReviews: -1 };
     break;
    default:
     break;
   }
  }
  const products = await Product.find(query)
   .sort(sort)
   .limit(Number(limit) || 10)
   .exec();

  res.json(products);
 } catch (error) {
  console.error("Error retrieving products:", error);
  res.status(500).json({ error: "Failed to retrieve products" });
 }
};

export const getProductById = async (req, res) => {
 const productId = req.params.id;
 try {
  const product = await Product.findById(productId).exec();
  if (!product) {
   return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve product" });
 }
};

export const getSimilarProducts = async (req, res) => {
 const productId = req.params.id;
 try {
  const product = await Product.findById(productId).exec();
  if (!product) {
   return [];
  }
  const similarProducts = await Product.find({
   _id: { $ne: productId },
   gender: product.gender,
   category: product.category,
  })
   .limit(4)
   .exec();
  res.json(similarProducts);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve similar products" });
 }
};

export const bestSeller = async (req, res) => {
 try {
  const product = await Product.findOne().sort({ numReviews: -1 });
  res.json(product);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve best seller products" });
 }
};

export const newArrivals = async (req, res) => {
 try {
  const products = await Product.find().sort({ createdAt: -1 }).limit(8);
  res.json(products);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve new arrivals products" });
 }
};
