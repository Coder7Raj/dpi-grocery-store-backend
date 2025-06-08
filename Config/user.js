
const User = require("../models/user.module")
// get all user by admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};


// search user
exports.searchUsersByName = async (req, res) => {
  const search = req.query.search || "";

  try {
    const users = await User.find({
      name: { $regex: search, $options: 'i' } // case-insensitive match
    }).select("-password"); // exclude password

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to search users",
      error: error.message
    });
  }
};