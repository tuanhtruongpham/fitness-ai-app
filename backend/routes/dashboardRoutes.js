const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

const {
  generateAIRecommendation,
} = require("../utils/workoutEngine");

const generateAIWorkoutPlan = require("../utils/aiWorkoutPlanner");

function normalizeHeight(height) {
  const h = Number(height);
  if (!h) return 0;
  return h > 3 ? h / 100 : h;
}

function calculateBMI(weight, height) {
  const w = Number(weight);
  const heightM = normalizeHeight(height);

  if (!w || !heightM) return null;

  return Number((w / (heightM * heightM)).toFixed(1));
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    const workouts = await Workout.find({ userId });
    const mealPlans = await Meal.find({ userId });
    const progressList = await Progress.find({ userId }).sort({
      createdAt: -1,
    });

    const latestProgress = progressList[0] || null;

    const latestWeight = latestProgress?.weight || user?.weight || null;
    const realtimeBMI = calculateBMI(latestWeight, user?.height);

    const aiRecommendation = generateAIRecommendation({
      goal: user?.goal || "maintenance",
      bmi: realtimeBMI || user?.bmi || 22,
      gymDays: Number(user?.gymDays || 3),
      workoutPlace: user?.workoutPlace || "gym",
    });

    const aiPlan = generateAIWorkoutPlan({
      ...user.toObject(),
      bmi: realtimeBMI || user?.bmi || 22,
    });

    const todayWorkout = aiPlan.todayWorkout;

    res.json({
      message: "Lấy dữ liệu dashboard thành công",
      dashboard: {
        user,

        totalWorkouts: workouts.length,
        totalExercises: todayWorkout?.exercises?.length || 0,
        completedExercises: 0,
        totalMealPlans: mealPlans.length,

        latestWeight,
        latestBMI: realtimeBMI,
        latestProgress,

        todayWorkout,
        todayWorkoutName: todayWorkout?.name || "Rest Day",
        todayExercises: todayWorkout?.exercises?.length || 0,

        weeklySchedule: aiPlan.weeklySchedule,
        aiPlan,
        aiRecommendation,
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