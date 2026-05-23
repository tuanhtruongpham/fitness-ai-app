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

const weeklySchedule = {
  1: {
    day: "Thứ 2",
    name: "Push Day",
    exercises: [
      "Bench Press",
      "Incline Dumbbell Press",
      "Shoulder Press",
      "Lateral Raise",
      "Tricep Pushdown",
      "Overhead Extension",
    ],
  },
  2: {
    day: "Thứ 3",
    name: "Pull Day",
    exercises: [
      "Pull Up",
      "Barbell Row",
      "Lat Pulldown",
      "Seated Row",
      "Barbell Curl",
      "Hammer Curl",
      "Face Pull",
    ],
  },
  3: {
    day: "Thứ 4",
    name: "Leg Day",
    exercises: [
      "Squat",
      "Romanian Deadlift",
      "Leg Press",
      "Leg Curl",
      "Calf Raise",
    ],
  },
  4: {
    day: "Thứ 5",
    name: "Push Day",
    exercises: [
      "Bench Press",
      "Incline Dumbbell Press",
      "Shoulder Press",
      "Lateral Raise",
      "Tricep Pushdown",
      "Overhead Extension",
    ],
  },
  5: {
    day: "Thứ 6",
    name: "Pull Day",
    exercises: [
      "Pull Up",
      "Barbell Row",
      "Lat Pulldown",
      "Seated Row",
      "Barbell Curl",
      "Hammer Curl",
      "Face Pull",
    ],
  },
  6: {
    day: "Thứ 7",
    name: "Leg Day",
    exercises: [
      "Squat",
      "Romanian Deadlift",
      "Leg Press",
      "Leg Curl",
      "Calf Raise",
    ],
  },
  0: {
    day: "Chủ nhật",
    name: "Rest Day",
    exercises: [],
  },
};

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

    const gymDays = Number(user?.gymDays || 3);

    const aiRecommendation = generateAIRecommendation({
      goal: user?.goal || "maintenance",
      bmi: realtimeBMI || user?.bmi || 22,
      gymDays,
      workoutPlace: user?.workoutPlace || "gym",
    });

    const vietnamTime = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );

    const today = vietnamTime.getDay();
    const todayWorkout = weeklySchedule[today];

    res.json({
      message: "Lấy dữ liệu dashboard thành công",
      dashboard: {
        user,

        totalWorkouts: workouts.length,
        totalExercises: todayWorkout.exercises.length,
        completedExercises: 0,
        totalMealPlans: mealPlans.length,

        latestWeight,
        latestBMI: realtimeBMI,
        latestProgress,

        todayWorkout,
        todayWorkoutName: todayWorkout.name,
        todayExercises: todayWorkout.exercises.length,

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