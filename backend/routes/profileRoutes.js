const express = require("express");
const multer = require("multer");
const path = require("path");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ===== BMI AUTO CALCULATE =====
const calculateBMI = (weight, height) => {
  let h = Number(height);
  const w = Number(weight);

  if (!h || !w) return 0;

  // nếu nhập 170 -> đổi thành 1.70m
  if (h > 3) {
    h = h / 100;
  }

  return Number((w / (h * h)).toFixed(1));
};

// ===== UPDATE PROFILE =====
router.put("/update", authMiddleware, async (req, res) => {
  try {
    console.log("TOKEN USER:", req.user);
    console.log("BODY:", req.body);

    const {
      age,
      height,
      weight,
      gender,
      goal,
      activity,
      workoutPlace,
      gymDays,
      bmi,
    } = req.body;

    // BMI ưu tiên tính tự động
    const finalBMI = bmi
      ? Number(bmi)
      : calculateBMI(weight, height);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        age,
        height,
        weight,
        gender,
        goal,
        activity,
        workoutPlace,
        gymDays: Number(gymDays || 3),
        bmi: finalBMI,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Cập nhật hồ sơ thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// ===== UPLOAD AVATAR =====
router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      user.avatar = req.file.filename;

      await user.save();

      res.json({
        message: "Upload avatar thành công",
        avatar: req.file.filename,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  }
);

module.exports = router;