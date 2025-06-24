const User = require("../models/user.module");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

async function generatePayId() {
  const lastUser = await User.findOne().sort({ createdAt: -1 }); // Make sure createdAt exists

  let nextId = 1001;

  if (lastUser?.payId) {
    const lastId = parseInt(lastUser.payId.split("-")[1]);
    if (!isNaN(lastId)) {
      nextId = lastId + 1;
    }
  }

  return `PAY-${nextId}`;
}

// const isProduction = process.env.NODE_ENV === "production";
// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const payId = await generatePayId();

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      payId,
    });
    await newUser.save();

    // Generate email verification token
    const emailToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const url = `http://localhost:5000/api/auth/verify/${emailToken}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    await transporter
      .sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `<p>Click this link to verify your email:</p><a href="${url}">${url}</a>`,
      })
      .catch((err) => {
        console.error("Error sending email:", err);
      });

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      })
      .status(200)
      .json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      })
      .status(200)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          image: user.image,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
