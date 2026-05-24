const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    // kiểm tra email hoặc sdt đã tồn tại
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email hoặc số điện thoại đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { account, password } = req.body;

    // login bằng email hoặc sdt
    const user = await User.findOne({
      $or: [
        { email: account },
        { phone: account },
      ],
    });

    if (!user) {
      return res.status(400).json({
        message: "Email hoặc số điện thoại không tồn tại",
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
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/google", async (req, res) => {
  try {
    const { credential, age, height, weight, gender, goal } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Gmail này đã được sử dụng",
      });
    }

    user = await User.create({
      fullName: name,
      email,
      avatar: picture,
      password: "google-login",
      phone: "",
      age,
      height,
      weight,
      gender,
      goal,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng ký Google thành công",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Google register failed",
      error: error.message,
    });
  }
});
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Tài khoản Google này chưa được đăng ký",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập Google thành công",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Google login failed",
      error: error.message,
    });
  }
});
module.exports = router;