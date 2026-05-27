const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("🔥 REGISTER API CALLED:", req.body);

    const { fullName, phone, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
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

    console.log("✅ USER SAVED:", user.email);
    console.log("📩 ABOUT TO SEND EMAIL:", user.email);

    await sendEmail({
      to: user.email,
      subject: "Welcome to Fitness AI App",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h1>Welcome ${user.fullName} 👋</h1>

          <p>Your account has been created successfully.</p>
          <p>Thanks for joining Fitness AI App.</p>

          <ul>
            <li>Track workouts</li>
            <li>Track calories</li>
            <li>Track water intake</li>
            <li>AI workout suggestions</li>
          </ul>

          <h3>Stay healthy and consistent 💪</h3>
        </div>
      `,
    });

    console.log("✅ WELCOME EMAIL FUNCTION DONE");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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
    console.error("❌ REGISTER ERROR:", error.message);

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

    const user = await User.findOne({
      $or: [{ email: account }, { phone: account }],
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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

// GOOGLE REGISTER
router.post("/google", async (req, res) => {
  try {
    console.log("🔥 GOOGLE REGISTER API CALLED");

      const {
    credential,
    age,
    height,
    weight,
    gender,
    goal,
    activity,
    trainingMonths,
    workoutPlace,
    gymDays,
    bmi,
  } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
if (user) {
  return res.status(400).json({
    message: "Gmail này đã được sử dụng, vui lòng đăng nhập",
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
    activity,
    trainingMonths,
    workoutPlace,
    gymDays,
    bmi,
  });

    console.log("✅ GOOGLE USER CREATED:", user.email);
    console.log("📩 ABOUT TO SEND GOOGLE WELCOME EMAIL:", user.email);

   sendEmail({
  to: user.email,
  subject: "Welcome to Fitness AI App",
  html: `
    <div style="font-family: Arial; padding: 20px;">
      <h1>Welcome ${user.fullName} 👋</h1>

      <p>Your account has been created successfully.</p>
      <p>Thanks for joining Fitness AI App.</p>

      <ul>
        <li>Track workouts</li>
        <li>Track calories</li>
        <li>Track water intake</li>
        <li>AI workout suggestions</li>
      </ul>

      <h3>Stay healthy and consistent 💪</h3>
    </div>
  `,
}).catch((error) => {
  console.log("❌ Send email error:", error.message);
});

console.log("✅ WELCOME EMAIL FUNCTION DONE");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng ký Google thành công",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ GOOGLE REGISTER ERROR:", error.message);

    res.status(500).json({
      message: "Google register failed",
      error: error.message,
    });
  }
});

// GOOGLE LOGIN
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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