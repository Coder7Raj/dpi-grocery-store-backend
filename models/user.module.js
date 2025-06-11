const mongoose = require("mongoose");
const transactionSchema = require("./transection.module.js");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  isAdmin: { type: Boolean, default: false },
  image: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String, default: "" },
  payId: { type: String, unique: true },
  walletBalance: { type: Number, default: 500 },
  transactions: [transactionSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
