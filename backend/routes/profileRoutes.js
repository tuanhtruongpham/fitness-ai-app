const fs = require("fs");
const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
destination: function (req, file, cb) {
  cb(null, uploadDir);
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

    const finalBMI = bmi ? Number(bmi) : calculateBMI(weight, height);

   const currentUser = await User.findById(req.user.id);

const updateData = {
  fullName,
  avatar,
  age,
  height,
  weight,
  targetWeight,
  goalStartWeight:
    currentUser.goalStartWeight || currentUser.weight || Number(weight),
  gender,
  goal,
  activity,
  workoutPlace,
  gymDays: Number(gymDays || 3),
  bmi: finalBMI,
};
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

    // Nếu có cập nhật cân nặng thì lưu thêm vào Progress
    if (weight) {
  await Progress.create({
    userId: req.user.id,
    weight: Number(weight),
    bmi: finalBMI,
    bodyFat: 0,
    note: `Updated profile: weight ${weight}kg, target ${targetWeight}kg`,
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
      console.log("AVATAR ROUTE HIT");
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "Không có file được upload" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: req.file.filename },
        { new: true, runValidators: false }
      ).select("-password");

      res.json({
        message: "Upload avatar thành công",
        avatar: req.file.filename,
        user: updatedUser,
      });
    } catch (error) {
      console.log("AVATAR ERROR:", error);
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  }
);

module.exports = router;