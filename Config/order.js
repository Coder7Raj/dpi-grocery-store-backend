const Order = require("../models/order.module");
const Product = require("../models/product.module");
const User = require("../models/user.module");

const Cart = require("../models/cart.module");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // assuming user from auth middleware
    const { address } = req.body;

    // Get user's cart with items
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price of all cart items
    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.productId.price * item.quantity;
    });

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < totalPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct balance
    user.walletBalance -= totalPrice;
    await user.save();
    // Reward 1 coin for orders above ৳1000
    if (totalPrice >= 1000) {
      user.coins += 1;
      await user.save(); // save updated coins
    }

    // Create order with all cart items
    const newOrder = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      totalPrice,
      address,
      status: "pending",
    });

    // Inside placeOrder loop:
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      product.stock -= item.quantity;
      await product.save();
    }

    await newOrder.save();

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Order failed", error: error.message });
  }
};
// statu update by admin
// controllers/orderController.js

// controllers/orderController.js

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(orderId);
    console.log("fsdjflksd");
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("items.product", "title image");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get pending all order

exports.getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "pending" })
      .populate("user", "name email") // optional: show user info
      .populate("items.product", "title image"); // show product info

    res.status(200).json({ orders: pendingOrders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending orders",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "title image") // populate product and select title + image
      .sort({ createdAt: -1 }); // latest orders first

    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};
