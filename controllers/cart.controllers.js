import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
 const { productId, size, color, quantity, guestId, userId } = req.body;
 try {
  const product = await Product.findById(productId).exec();
  if (!product) {
   return res.status(404).json({ error: "Product not found" });
  }
  let cart = await getCartByUserIdorGuestId(userId, guestId);
  if (cart) {
   const productIndex = cart.products.findIndex(
    (item) =>
     item.productId.toString() === productId &&
     item.size === size &&
     item.color === color
   );
   if (productIndex !== -1) {
    cart.products[productIndex].quantity += quantity;
   } else {
    cart.products.push({
     productId,
     name: product.name,
     image: product.images[0].url,
     price: product.price,
     color,
     size,
     quantity,
    });
   }
   cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
   );
   await cart.save();
   return res.json(cart);
  } else {
   cart = await Cart.create({
    user: userId ? userId : null,
    guestId: guestId ? guestId : `guest_${new Date().getTime()}`,
    products: [
     {
      productId,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      color,
      size,
      quantity,
     },
    ],
    totalPrice: product.price * quantity,
   });
   res.status(201).json(cart);
  }
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to add product to cart" });
 }
};

export const getCart = async (req, res) => {
 const { userId, guestId } = req.query;
 try {
  const cart = await getCartByUserIdorGuestId(userId, guestId);
  if (!cart) {
   return res.status(404).json({ error: "Cart not found" });
  }
  res.json(cart);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to retrieve cart" });
 }
};

export const updateCart = async (req, res) => {
 const { productId, size, color, quantity } = req.body;
 try {
  const cart = await Cart.findOne({ user: req.user._id }).exec();
  if (!cart) {
   return res.status(404).json({ error: "Cart not found" });
  }
  const productIndex = cart.products.findIndex(
   (item) => item.productId.toString() === productId
  );
  if (productIndex === -1) {
   return res.status(404).json({ error: "Product not found in cart" });
  }
  cart.products[productIndex].size = size;
  cart.products[productIndex].color = color;
  cart.products[productIndex].quantity = quantity;
  await cart.save();
  res.json(cart);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to update cart" });
 }
};

export const removeFromCart = async (req, res) => {
 const { productId, size, color, guestId, userId } = req.body;
 try {
  let cart = await getCartByUserIdorGuestId(userId, guestId);
  if (!cart) {
   return res.status(404).json({ error: "Cart not found" });
  }
  const productIndex = cart.products.findIndex(
   (item) =>
    item.productId.toString() === productId &&
    item.size === size &&
    item.color === color
  );
  if (productIndex === -1) {
   return res.status(404).json({ error: "Product not found in cart" });
  }
  cart.products.splice(productIndex, 1);
  cart.totalPrice = cart.products.reduce(
   (total, item) => total + item.price * item.quantity,
   0
  );
  await cart.save();
  res.json(cart);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to remove product from cart" });
 }
};

// Update product quantity in cart for a guest or logged in user
export const updateProductQuantity = async (req, res) => {
 const { productId, quantity, guestId, userId, size, color } = req.body;
 try {
  const cart = await getCartByUserIdorGuestId(userId, guestId);
  if (!cart) {
   return res.status(404).json({ error: "Cart not found" });
  }
  const productIndex = cart.products.findIndex(
   (item) =>
    item.productId.toString() === productId &&
    item.size === size &&
    item.color === color
  );
  if (productIndex > -1) {
   if (quantity > 0) {
    cart.products[productIndex].quantity = quantity;
   } else {
    cart.products.splice(productIndex, 1);
   }
   cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
   );
   await cart.save();
   return res.json(cart);
  } else {
   return res.status(404).json({ error: "Product not found in cart" });
  }
 } catch (error) {
  console.error(error);
  return res
   .status(500)
   .json({ error: "Failed to update product quantity in cart" });
 }
};

// Merge guest cart into user cart on login
export const mergeGuestCartIntoUserCart = async (req, res) => {
 const { guestId } = req.body;
 try {
  // find the guest cart and user cart
  const guestCart = await Cart.findOne({ guestId }).exec();
  const userCart = await Cart.findOne({ user: req.user._id }).exec();
  if (guestCart) {
   if (guestCart.products.length === 0) {
    return res.status(400).json({ error: "Guest cart is empty" });
   }
   if (userCart) {
    guestCart.products.forEach((guestProduct) => {
     const userProductIndex = userCart.products.findIndex(
      (userProduct) =>
       userProduct.productId.toString() === guestProduct.productId.toString() &&
       userProduct.size === guestProduct.size &&
       userProduct.color === guestProduct.color
     );
     if (userProductIndex !== -1) {
      userCart.products[userProductIndex].quantity += guestProduct.quantity;
     } else {
      userCart.products.push(guestProduct);
     }
    });
    userCart.totalPrice = userCart.products.reduce(
     (total, item) => total + item.price * item.quantity,
     0
    );
    await userCart.save();
    await Cart.deleteOne({ guestId }).exec();
    res.json(userCart);
   } else {
    //user has no cart, assign the guest cart to the user
    guestCart.user = req.user._id;
    guestCart.guestId = null;
    await guestCart.save();
    res.json(guestCart);
   }
  } else {
   if (userCart) {
    // guest cart has already been merged into user cart, return user cart
    return res.status(200).json(userCart);
   }
   res.status(404).json({ error: "Guest cart not found" });
  }
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to merge guest cart into user cart" });
 }
};

const getCartByUserIdorGuestId = async (userId, guestId) => {
 if (!userId && !guestId) {
  return null;
 } else if (userId) {
  return await Cart.findOne({ user: userId }).exec();
 }
 return await Cart.findOne({ guestId }).exec();
};
