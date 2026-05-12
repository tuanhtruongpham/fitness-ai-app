const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "Đăng ký thành công",
      user: {
  id: user._id,
  email: user.email,
},
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
});

module.exports = router;
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Sai mật khẩu",
      });
    }
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
   res.json({
  message: "Đăng nhập thành công",
  token,
  user: {
    id: user._id,
    email: user.email,
  },
});
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
});