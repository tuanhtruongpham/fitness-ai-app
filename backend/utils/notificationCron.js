console.log("✅ NOTIFICATION CRON VERSION: REAL SCHEDULE");
const cron = require("node-cron");

const User = require("../models/User");
const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const Notification = require("../models/Notification");

const Progress = require("../models/Progress");
const generateAIWorkoutPlan = require("../utils/aiWorkoutPlanner");
// =====================================================
// DAILY MORNING NOTIFICATION
// 7:00 AM every day
// mỗi user chỉ tạo 1 thông báo buổi sáng / ngày
// =====================================================

cron.schedule("0 7 * * *", async () => {
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

      if (alreadyExists) {
        continue;
      }

    const progressList = await Progress.find({
  userId: user._id,
}).sort({ createdAt: -1 });

const latestProgress = progressList[0] || null;

const latestWeight =
    latestProgress?.weight || user?.weight || null;

    const aiPlan = generateAIWorkoutPlan({
    ...user.toObject(),
    weight: latestWeight,
    });

const todayWorkout = aiPlan.todayWorkout;

        const meal = await Meal.findOne({
            userId: user._id,
        }).sort({ createdAt: -1 });

        const workoutName =
        todayWorkout?.name || "Rest Day";

        const exerciseCount =
        todayWorkout?.exercises?.length || 0;

      const mealCalories = meal?.dailyTarget?.calories || 0;
console.log("CREATE DAILY NOTIFICATION", new Date());
      await Notification.create({
        userId: user._id,
        title: "🌅 Good Morning!",
        message:
        `Today's workout: ${workoutName} (${exerciseCount} exercises). ` +
        `Meal target: ${mealCalories} kcal.`,
        type: "daily_plan",
      });
    }

    console.log("Morning notifications created");
  } catch (error) {
    console.log(error);
  }
});

// =====================================================
// WATER REMINDER
// Every 2 hours
// No notifications from 10PM -> 6AM
// mỗi user chỉ tạo 1 thông báo uống nước / 2 tiếng
// =====================================================

cron.schedule("0 */2 * * *", async () => {
  try {
    const currentHour = new Date().getHours();

    if (currentHour >= 22 || currentHour < 6) {
      console.log("Sleeping hours - skip water reminder");
      return;
    }

    console.log("Running water reminders...");

    const users = await User.find();

    const twoHoursAgo = new Date(
      Date.now() - 2 * 60 * 60 * 1000
    );

    for (const user of users) {
      const waterExists = await Notification.findOne({
        userId: user._id,
        type: "water",
        createdAt: { $gte: twoHoursAgo },
      });

      if (waterExists) {
        continue;
      }
console.log("CREATE DAILY NOTIFICATION", new Date());
      await Notification.create({
        userId: user._id,
        title: "💧 Drink Water",
        message:
          "Bạn có quên gì không nhỉ? Uống một ly nước thôi nào.",
        type: "water",
      });
    }

    console.log("Water reminders created");
  } catch (error) {
    console.log(error);
  }
});