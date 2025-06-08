// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  image: { type: String, default: "" },
  isVerified: { type: Boolean, default: false }  ,
  profileImage: {
  type: String,
  default: ""
}

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
