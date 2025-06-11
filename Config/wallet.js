const User = require("../models/user.module")
// POST /api/wallet/transfer
exports.transfer = async (req, res) => {
  const { senderPayId, receiverPayId, amount, note } = req.body;

  const sender = await User.findOne({ payId: senderPayId });
    const receiver = await User.findOne({ payId: receiverPayId });

  if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
  if (sender.walletBalance < amount) return res.status(400).json({ message: 'Insufficient balance' });

  // Deduct and update balances
  sender.walletBalance -= amount;
  receiver.walletBalance += amount;

  // Add transactions
  const transaction = {
    type: 'transfer',
    amount,
    date: new Date(),
    from: sender.payId,
    to: receiver.payId,
    note,
    status: 'success'
  };

  sender.transactions.push({ ...transaction, type: 'debit' });
  receiver.transactions.push({ ...transaction, type: 'credit' });

  await sender.save();
  await receiver.save();

  res.status(200).json({ message: 'Transfer successful' });
};

// get balance
exports.getBalance = async (req, res) => {
  const { payId } = req.params;
  const user = await User.findOne({ payId });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({ balance: user.walletBalance });
};
