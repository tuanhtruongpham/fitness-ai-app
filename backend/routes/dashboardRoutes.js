const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    const workouts = await Workout.find({ userId });

    const mealPlans = await Meal.find({ userId });

    const progressList = await Progress.find({ userId }).sort({
      createdAt: -1,
    });

    const totalWorkouts = workouts.length;

    let totalExercises = 0;
    let completedExercises = 0;

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        totalExercises++;

        if (exercise.completed) {
          completedExercises++;
        }
      });
    });

    const latestProgress = progressList[0] || null;

    res.json({
      message: "Lấy dữ liệu dashboard thành công",
      dashboard: {
        user,
        totalWorkouts,
        totalExercises,
        completedExercises,
        totalMealPlans: mealPlans.length,
        latestWeight: latestProgress ? latestProgress.weight : user?.weight || null,
        latestBMI: latestProgress ? latestProgress.bmi : user?.bmi || null,
        latestProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;