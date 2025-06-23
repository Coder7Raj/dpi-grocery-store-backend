const User = require("../models/user.module");

const isAdmin = async (req, res, next) => {
  try {
    // req.user should be set by authMiddleware
    const user = await User.findById(req.user.id); // or req.user._id

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = isAdmin;
