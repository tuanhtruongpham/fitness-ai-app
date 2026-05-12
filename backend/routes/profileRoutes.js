const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

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
      error,
    });
  }
});

module.exports = router;