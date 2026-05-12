const express = require("express");
const router = express.Router();

const Meal = require("../models/Meal");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { goal, totalCalories, protein, carbs, fat, meals } = req.body;

    const mealPlan = new Meal({
      userId: req.user.id,
      goal,
      totalCalories,
      protein,
      carbs,
      fat,
      meals,
    });

    await mealPlan.save();

    res.status(201).json({
      message: "Tạo thực đơn thành công",
      mealPlan,
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
    const mealPlans = await Meal.find({
      userId: req.user.id,
    });

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