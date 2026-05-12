const express = require("express");
const router = express.Router();

const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { weight, bmi, bodyFat, note } = req.body;

    const progress = new Progress({
      userId: req.user.id,
      weight,
      bmi,
      bodyFat,
      note,
    });

    await progress.save();

    res.status(201).json({
      message: "Thêm tiến trình thành công",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const progressList = await Progress.find({
      userId: req.user.id,
    }).sort({ createdAt: 1 });

    res.json({
      message: "Lấy tiến trình thành công",
      progressList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;