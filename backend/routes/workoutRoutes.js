const express = require("express");
const router = express.Router();

const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { day, muscle, exercises } = req.body;

    const workout = new Workout({
      userId: req.user.id,
      day,
      muscle,
      exercises,
    });

    await workout.save();

    res.status(201).json({
      message: "Tạo lịch tập thành công",
      workout,
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
    const workouts = await Workout.find({
      userId: req.user.id,
    });

    res.json({
      message: "Lấy lịch tập thành công",
      workouts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;