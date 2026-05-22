const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Meal = require("../models/Meal");
const authMiddleware = require("../middleware/authMiddleware");

function normalizeHeight(height) {
  const h = Number(height);
  return h > 3 ? h / 100 : h;
}

function calculateBMI(weight, height) {
  const heightM = normalizeHeight(height);
  return Number((weight / (heightM * heightM)).toFixed(2));
}

function classifyBMI(bmi) {
  if (bmi < 18.5) return "Gầy";
  if (bmi < 25) return "Bình thường";
  if (bmi < 30) return "Thừa cân";
  return "Béo phì";
}

function calculateBMR({ gender, weight, height, age }) {
  const heightM = normalizeHeight(height);
  const heightCm = heightM * 100;

  if (gender === "Nữ") {
    return 10 * weight + 6.25 * heightCm - 5 * age - 161;
  }

  return 10 * weight + 6.25 * heightCm - 5 * age + 5;
}

function generateMealPlan(goal) {
  if (goal === "Siết mỡ" || goal === "Giảm cân") {
    return [
      { time: "Bữa sáng", foods: ["3 trứng", "50g yến mạch"] },
      { time: "Bữa trưa", foods: ["150g ức gà", "150g cơm", "Rau xanh"] },
      { time: "Bữa xế", foods: ["Sữa chua Hy Lạp", "Hạnh nhân"] },
      { time: "Bữa tối", foods: ["150g cá hồi hoặc bò nạc", "Khoai lang", "Salad"] },
    ];
  }

  return [
    { time: "Bữa sáng", foods: ["4 trứng", "100g yến mạch", "1 quả chuối"] },
    { time: "Bữa trưa", foods: ["200g ức gà", "300g cơm", "Rau xanh"] },
    { time: "Pre-workout", foods: ["2 lát bánh mì", "Peanut butter", "Whey"] },
    { time: "Sau tập", foods: ["Whey", "Chuối"] },
    { time: "Bữa tối", foods: ["200g bò", "250g khoai", "Salad"] },
  ];
}

router.post("/smart-plan", authMiddleware, async (req, res) => {
  try {
    const { activityLevel = 1.55 } = req.body;

    const user = await User.findById(req.user.id);

    if (!user || !user.age || !user.height || !user.weight || !user.goal) {
      return res.status(400).json({
        message: "Vui lòng cập nhật đầy đủ hồ sơ trước khi tạo kế hoạch.",
      });
    }

    const weight = Number(user.weight);
    const height = Number(user.height);
    const age = Number(user.age);

    const bmi = calculateBMI(weight, height);
    const bmiType = classifyBMI(bmi);
    const bmr = calculateBMR({
      gender: user.gender,
      weight,
      height,
      age,
    });

    const tdee = Math.round(bmr * Number(activityLevel));

    let targetCalories = tdee;

    if (user.goal === "Tăng cơ" || user.goal === "Tăng cân") {
      targetCalories = tdee + 400;
    } else if (user.goal === "Siết mỡ" || user.goal === "Giảm cân") {
      targetCalories = tdee - 400;
    }

    targetCalories = Math.max(targetCalories, 1200);

    const protein = Math.round(weight * 2);
    const fat = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

    const mealPlan = generateMealPlan(user.goal);

    await Meal.deleteMany({ userId: user._id });

    const savedMeal = await Meal.create({
      userId: user._id,
      goal: user.goal,
      totalCalories: targetCalories,
      protein: `${protein}g`,
      carbs: `${carbs}g`,
      fat: `${fat}g`,
      meals: mealPlan.map((meal) => ({
        time: meal.time,
        items: meal.foods.map((food) => ({
          food,
          quantity: "-",
          calories: 0,
        })),
      })),
    });

    res.json({
      message: "Tạo kế hoạch thông minh thành công",
      bodyAnalysis: {
        bmi,
        bmiType,
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        protein: `${protein}g`,
        carbs: `${carbs}g`,
        fat: `${fat}g`,
      },
      mealPlan: savedMeal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;