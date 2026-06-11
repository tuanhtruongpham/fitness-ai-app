console.log("✅ NOTIFICATION CRON VERSION: REAL SCHEDULE");

const cron = require("node-cron");

const User = require("../models/User");
const Meal = require("../models/Meal");
const Notification = require("../models/Notification");
const Progress = require("../models/Progress");

const sendEmail = require("./emailService");
const generateAIWorkoutPlan = require("./aiWorkoutPlanner");

const TIMEZONE = "Asia/Ho_Chi_Minh";

// =====================================================
// DAILY MORNING NOTIFICATION
// 7:00 AM every day - Vietnam time
// mỗi user chỉ tạo 1 thông báo daily_plan trong 24h
// =====================================================
cron.schedule(
  "0 7 * * *",
  async () => {
    console.log("Running morning notifications...");

    try {
      const users = await User.find();

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      for (const user of users) {
        try {
          const alreadyExists = await Notification.findOne({
            userId: user._id,
            type: "daily_plan",
            createdAt: { $gte: oneDayAgo },
          });

          if (alreadyExists) {
            console.log("DAILY NOTIFICATION ALREADY EXISTS:", user.email);
            continue;
          }

          const latestProgress = await Progress.findOne({
            userId: user._id,
          }).sort({ createdAt: -1 });

          const latestWeight = latestProgress?.weight || user?.weight || null;

          const aiPlan = generateAIWorkoutPlan({
            ...user.toObject(),
            weight: latestWeight,
          });

          const todayWorkout = aiPlan?.todayWorkout;

          const meal = await Meal.findOne({
            userId: user._id,
          }).sort({ createdAt: -1 });

          const workoutName = todayWorkout?.name || "Rest Day";
          const exerciseCount = todayWorkout?.exercises?.length || 0;
          const mealCalories =
            meal?.dailyTarget?.calories ||
            meal?.totalCalories ||
            0;

          await Notification.create({
            userId: user._id,
            title: "🌅 Good Morning!",
            message:
              `Today's workout: ${workoutName} (${exerciseCount} exercises). ` +
              `Meal target: ${mealCalories} kcal.`,
            type: "daily_plan",
          });

          console.log("CREATE DAILY NOTIFICATION:", user.email);

          if (user.email) {
            try {
              console.log("TRY SEND EMAIL:", user.email);

              await sendEmail({
                to: user.email,
                subject: "🌅 Your Fitness Plan Today",
                html: `
                  <div style="font-family: Arial; padding:24px; background:#0f172a; color:white;">
                    <h1 style="color:#84cc16;">Good Morning 💪</h1>
                    <p>Your AI fitness plan today:</p>

                    <div style="background:#111827;padding:16px;border-radius:14px;margin-top:16px;">
                      <h2 style="color:#84cc16;">Workout</h2>
                      <p><strong>${workoutName}</strong></p>
                      <p>${exerciseCount} exercises</p>
                    </div>

                    <div style="background:#111827;padding:16px;border-radius:14px;margin-top:16px;">
                      <h2 style="color:#84cc16;">Meal Target</h2>
                      <p><strong>${mealCalories} kcal</strong></p>
                    </div>

                    <p style="margin-top:24px;color:#94a3b8;">
                      Stay consistent and trust the process 🚀
                    </p>
                  </div>
                `,
              });

              console.log("EMAIL SENT TO:", user.email);
            } catch (emailError) {
              console.log("EMAIL ERROR:", user.email, emailError.message);
            }
          }
        } catch (userError) {
          console.log("DAILY NOTIFICATION USER ERROR:", user.email, userError.message);
        }
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
// Every 2 hours from 6AM to 10PM - Vietnam time
// =====================================================
cron.schedule(
  "0 6-22/2 * * *",
  async () => {
    console.log("Running water reminders...");

    try {
      const users = await User.find();

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

      for (const user of users) {
        try {
          const waterExists = await Notification.findOne({
            userId: user._id,
            type: "water",
            createdAt: { $gte: twoHoursAgo },
          });

          if (waterExists) {
            console.log("WATER NOTIFICATION ALREADY EXISTS:", user.email);
            continue;
          }

          await Notification.create({
            userId: user._id,
            title: "💧 Drink Water",
            message: "Bạn có quên gì không nhỉ? Uống một ly nước thôi nào.",
            type: "water",
          });

          console.log("CREATE WATER NOTIFICATION:", user.email);
        } catch (userError) {
          console.log("WATER NOTIFICATION USER ERROR:", user.email, userError.message);
        }
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
// =====================================================
// INACTIVE USER MOTIVATION
// 8:00 PM every day
// =====================================================
cron.schedule(
  "0 20 * * *",
  async () => {
    console.log("Running inactive user reminders...");

    try {
      const users = await User.find();

      const sevenDaysAgo =
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const oneDayAgo =
        new Date(Date.now() - 24 * 60 * 60 * 1000);

      for (const user of users) {
        try {
          if (!user.lastLoginAt) continue;

          if (user.lastLoginAt > sevenDaysAgo) continue;

          const alreadyExists = await Notification.findOne({
            userId: user._id,
            type: "system",
            title: "🔥 Come Back!",
            createdAt: { $gte: oneDayAgo },
          });

          if (alreadyExists) continue;

          await Notification.create({
            userId: user._id,
            title: "🔥 Come Back!",
            message:
              "Mày đi đâu rồi? Đã hơn 7 ngày chưa tập luyện. Quay lại hoàn thành lịch tập hôm nay nhé 💪",
            type: "system",
          });

          console.log(
            "CREATE INACTIVE REMINDER:",
            user.email
          );
        } catch (err) {
          console.log(
            "INACTIVE USER ERROR:",
            user.email,
            err.message
          );
        }
      }
    } catch (error) {
      console.log(
        "Inactive reminder error:",
        error.message
      );
    }
  },
  {
    timezone: TIMEZONE,
  }
);