const User = require("../models/user.module")
// POST /api/wallet/transfer
// exports.transfer = async (req, res) => {
  
//   const { senderPayId, receiverPayId, amount, note } = req.body;

//   const sender = await User.findOne({ payId: senderPayId });
//     const receiver = await User.findOne({ payId: receiverPayId });

//   if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
//   if (sender.walletBalance < amount) return res.status(400).json({ message: 'Insufficient balance' });

//   // Deduct and update balances
//   sender.walletBalance -= amount;
//   receiver.walletBalance += amount;

//   // Add transactions
//   const transaction = {
//     type: 'transfer',
//     amount,
//     date: new Date(),
//     from: sender.payId,
//     to: receiver.payId,
//     note,
//     status: 'success'
//   };

//   sender.transactions.push({ ...transaction, type: 'debit' });
//   receiver.transactions.push({ ...transaction, type: 'credit' });

//   await sender.save();
//   await receiver.save();

//   res.status(200).json({ message: 'Transfer successful' });
// };






// POST /api/wallet/transfer
exports.transfer = async (req, res) => {
  try {
    const senderId = req.user.id; // ✅ get sender ID from middleware
    const { receiverPayId, amount, note } = req.body;

    if (!receiverPayId || !amount) {
      return res.status(400).json({ message: "Receiver Pay ID and amount are required" });
    }

    // ✅ Find sender and receiver
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ payId: receiverPayId });
    console.log(sender)

    if (!sender) return res.status(404).json({ message: "Sender not found" });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    if (sender.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // ✅ Adjust balances
    sender.walletBalance -= amount;
    receiver.walletBalance += amount;

    // ✅ Create transaction object
    const transaction = {
      type: "transfer",
      amount,
      date: new Date(),
      from: sender.payId,
      to: receiver.payId,
      note,
      status: "success",
    };

    // ✅ Add transaction history
    sender.transactions.push({ ...transaction, type: "debit" });
    receiver.transactions.push({ ...transaction, type: "credit" });

    // ✅ Save updated users (no re-creation)
    await sender.save();
    await receiver.save();

    res.status(200).json({
  message: "Transfer successful",
  sender: {
    payId: sender.payId,
    newBalance: sender.walletBalance,
  },
  receiver: {
    payId: receiver.payId,
    newBalance: receiver.walletBalance,
  },
  transaction
});

  } catch (error) {
    console.error("Transfer Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// get balance
// exports.getBalance = async (req, res) => {
//   const { payId } = req.params;
//   const user = await User.findOne({ payId });

//   if (!user) return res.status(404).json({ message: 'User not found' });

//   res.status(200).json({ balance: user.walletBalance });
// };
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// history
// exports.getHistory = async (req, res) => {
//   const { payId } = req.params;
//   const user = await User.findOne({ payId });

//   if (!user) return res.status(404).json({ message: 'User not found' });

//   res.status(200).json({ transactions: user.transactions.reverse() });
// };
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ transactions: user.transactions.reverse() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// added balance via coin

exports.useCoinToAddBalance = async (req, res) => {
  try {
    const userId = req.user.id; // assuming authMiddleware is applied
    const { coinsToUse } = req.body;

    if (!coinsToUse || coinsToUse <= 0) {
      return res.status(400).json({ message: "Invalid coin amount" });
    }

    const user = await User.findById(userId);
    if (!user || user.coins < coinsToUse) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    const balanceToAdd = coinsToUse * 200;

    user.coins -= coinsToUse;
    user.walletBalance += balanceToAdd;

    await user.save();

    res.status(200).json({
      message: `Added ৳${balanceToAdd} to wallet using ${coinsToUse} coin(s)`,
      newBalance: user.walletBalance,
      remainingCoins: user.coins
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// buy token
exports.useBalanceToBuyCoin = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user
    const { coinsToBuy } = req.body;

    if (!coinsToBuy || coinsToBuy <= 0) {
      return res.status(400).json({ message: "Invalid coin amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCost = coinsToBuy * 300;

    if (user.walletBalance < totalCost) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct balance and add coins
    user.walletBalance -= totalCost;
    user.coins += coinsToBuy;

    await user.save();

    res.status(200).json({
      message: `Purchased ${coinsToBuy} coin(s) for ৳${totalCost}`,
      newBalance: user.walletBalance,
      totalCoins: user.coins
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

