const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Progress = require("../models/Progress");
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

  if (h > 3) {
    h = h / 100;
  }

  return Number((w / (h * h)).toFixed(1));
};

// ===== UPDATE PROFILE =====
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      avatar,
      password,
      age,
      height,
      weight,
      targetWeight,
      gender,
      goal,
      activity,
      workoutPlace,
      gymDays,
      bmi,
      trainingFocus,
      dietType,
    } = req.body;

    const oldUser = await User.findById(req.user.id);

    const updateData = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (age !== undefined) updateData.age = Number(age);
    if (height !== undefined) updateData.height = Number(height);
    if (weight !== undefined) updateData.weight = Number(weight);
    if (targetWeight !== undefined)
      updateData.targetWeight = Number(targetWeight);
    if (gender !== undefined) updateData.gender = gender;
    if (goal !== undefined) updateData.goal = goal;
    if (activity !== undefined) updateData.activity = activity;
    if (workoutPlace !== undefined) updateData.workoutPlace = workoutPlace;
    if (trainingFocus !== undefined) updateData.trainingFocus = trainingFocus;
    if (dietType !== undefined) updateData.dietType = dietType;
    if (gymDays !== undefined) updateData.gymDays = Number(gymDays);

    const finalWeight =
      weight !== undefined ? Number(weight) : Number(oldUser?.weight);

    const finalHeight =
      height !== undefined ? Number(height) : Number(oldUser?.height);

    if (bmi !== undefined) {
      updateData.bmi = Number(bmi);
    } else if (finalWeight && finalHeight) {
      updateData.bmi = calculateBMI(finalWeight, finalHeight);
    }

    if (weight !== undefined && oldUser?.goalStartWeight === undefined) {
      updateData.goalStartWeight = Number(weight);
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    console.log("UPDATE DATA:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    if (weight !== undefined) {
      await Progress.create({
        userId: req.user.id,
        weight: Number(weight),
        bmi: updateData.bmi || updatedUser.bmi || 0,
        bodyFat: 0,
        note: `Updated weight: ${weight}kg`,
      });
    }

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