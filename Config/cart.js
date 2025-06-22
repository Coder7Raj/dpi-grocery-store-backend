const Cart = require("../models/cart.module");

exports.addCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart with one item and default quantity (if schema has default)
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      // Check if product already exists in cart
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index === -1) {
        // Product not found in cart, so add it with quantity 1
        cart.items.push({ productId, quantity: 1 });
      }
      // If found, do nothing (do NOT increase quantity)
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the cart by userId and populate product details in items
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE item from cart
exports.deleteCartItem = async (req, res) => {
  const userId = req.user.id; // ✅ from middleware
  console.log("uu", userId);
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
