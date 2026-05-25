const cron = require("node-cron");

const User = require("../models/User");
const Workout = require("../models/Workout");
const Meal = require("../models/Meal");
const Notification = require("../models/Notification");

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

      const workout = await Workout.findOne({
        userId: user._id,
      }).sort({ createdAt: -1 });

      const meal = await Meal.findOne({
        userId: user._id,
      }).sort({ createdAt: -1 });

      const workoutName = workout
        ? `${workout.day} (${workout.muscle})`
        : "Rest Day";

      const mealCalories = meal?.dailyTarget?.calories || 0;

      await Notification.create({
        userId: user._id,
        title: "🌅 Good Morning!",
        message:
          `Today's workout: ${workoutName}. ` +
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