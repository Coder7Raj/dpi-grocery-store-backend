const Cart = require("../models/cart.module");

exports.addCart = async (req, res) => {
  try {
       console.log("Request body:", req.body); // ADD THIS LINE

    const {  productId, quantity } = req.body;
    const userId = req.user.id;
 console.log(userId)
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Added to cart', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
