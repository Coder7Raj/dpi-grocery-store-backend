const Order = require('../models/order.module');
const Product = require('../models/product.module');
const User = require('../models/user.module');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, address } = req.body;

    const product = await Product.findById({_id:productId});
    const user = await User.findById({_id:userId});

    if (!product || !user) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    const totalPrice = product.price * quantity;

    // Optional: check user balance
    if (user.walletBalance < totalPrice) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct balance
    user.walletBalance -= totalPrice;

    // Create order
    const newOrder = new Order({
      user: user._id,
      product: product._id,
      quantity,
      totalPrice,
      address
    });

    await newOrder.save();
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (error) {
    res.status(500).json({ message: 'Order failed', error: error.message });
  }
};


// statu update by admin
// controllers/orderController.js


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(orderId)
    const { status } = req.body;

    // Validate status value
    const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the order and update status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
