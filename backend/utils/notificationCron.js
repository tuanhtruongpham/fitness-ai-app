console.log("✅ NOTIFICATION CRON VERSION: REAL SCHEDULE");

const cron = require("node-cron");

const User = require("../models/User");
const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const Notification = require("../models/Notification");

const sendEmail = require("./emailService");

const Progress = require("../models/Progress");
const generateAIWorkoutPlan = require("../utils/aiWorkoutPlanner");

const TIMEZONE = "Asia/Ho_Chi_Minh";

// =====================================================
// DAILY MORNING NOTIFICATION
// 7:00 AM every day
// mỗi user chỉ tạo 1 thông báo buổi sáng / ngày
// =====================================================
cron.schedule(
  "0 7 * * *",
  async () => {
    console.log("Running morning notifications...");

    try {
      const users = await User.find();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const user of users) {
        const alreadyExists = await Notification.findOne({
          userId: user._id,
          type: "daily_plan",
          createdAt: { $gte: today },
        });

        if (alreadyExists) continue;

        const latestProgress = await Progress.findOne({
          userId: user._id,
        }).sort({ createdAt: -1 });

        const latestWeight = latestProgress?.weight || user?.weight || null;

        const aiPlan = generateAIWorkoutPlan({
          ...user.toObject(),
          weight: latestWeight,
        });

        const todayWorkout = aiPlan.todayWorkout;

        const meal = await Meal.findOne({
          userId: user._id,
        }).sort({ createdAt: -1 });

        const workoutName = todayWorkout?.name || "Rest Day";
        const exerciseCount = todayWorkout?.exercises?.length || 0;
        const mealCalories = meal?.dailyTarget?.calories || 0;

        await Notification.create({
          userId: user._id,
          title: "🌅 Good Morning!",
          message:
            `Today's workout: ${workoutName} (${exerciseCount} exercises). ` +
            `Meal target: ${mealCalories} kcal.`,
          type: "daily_plan",
        });

        console.log("CREATE DAILY NOTIFICATION", user.email);
      }

      console.log("Morning notifications created");
    } catch (error) {
      console.log("Morning notification error:", error.message);
    }
  },
  {
    timezone: TIMEZONE,
  }
);

// =====================================================
// WATER REMINDER
// Every 2 hours from 6AM to 10PM
// =====================================================
cron.schedule(
  "0 6-22/2 * * *",
  async () => {
    console.log("Running water reminders...");

    try {
      const users = await User.find();

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

      for (const user of users) {
        const waterExists = await Notification.findOne({
          userId: user._id,
          type: "water",
          createdAt: { $gte: twoHoursAgo },
        });

        if (waterExists) continue;

        await Notification.create({
          userId: user._id,
          title: "💧 Drink Water",
          message: "Bạn có quên gì không nhỉ? Uống một ly nước thôi nào.",
          type: "water",
        });

        console.log("CREATE WATER NOTIFICATION", user.email);
      }

      console.log("Water reminders created");
    } catch (error) {
      console.log("Water reminder error:", error.message);
    }
  },
  {
    timezone: TIMEZONE,
  }
);