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

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { age, height, weight, gender, goal } = req.body;

    const bmi = weight / (height * height);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        age,
        height,
        weight,
        gender,
        goal,
        bmi: Number(bmi.toFixed(2)),
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