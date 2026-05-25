const express = require("express");
const router = express.Router();

const Meal = require("../models/Meal");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const generateMealPlan = require("../utils/generateMealPlan");

// GENERATE MEAL PLAN THEO USER LOGIN
router.get("/today", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    const mealPlan = generateMealPlan(user);

    res.json({
      message: "Tạo meal plan hôm nay thành công",
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi tạo meal plan",
      error: error.message,
    });
  }
});

// SAVE TODAY MEAL PLAN
router.post("/save-today", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    const generatedPlan = generateMealPlan(user);

    const mealPlan = new Meal({
      userId: req.user.id,
      ...generatedPlan,
    });

    await mealPlan.save();

    res.status(201).json({
      message: "Lưu meal plan hôm nay thành công",
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi lưu meal plan",
      error: error.message,
    });
  }
});

// SAVE MEAL PLAN TỪ FRONTEND NẾU CẦN
router.post("/", authMiddleware, async (req, res) => {
  try {
    const mealPlan = new Meal({
      userId: req.user.id,
      ...req.body,
    });

    await mealPlan.save();

    res.status(201).json({
      message: "Lưu thực đơn thành công",
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// GET MEAL HISTORY
router.get("/", authMiddleware, async (req, res) => {
  try {
    const mealPlans = await Meal.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      message: "Lấy thực đơn thành công",
      mealPlans,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;