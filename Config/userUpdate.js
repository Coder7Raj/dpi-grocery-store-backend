const User = require("../models/user.module");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you use auth middleware
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log(image);
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (image) updatedFields.profileImage = image;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
