const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Meal = require("../models/Meal");
const authMiddleware = require("../middleware/authMiddleware");

function calculateBMI(weight, height) {
  return Number((weight / (height * height)).toFixed(2));
}

function classifyBMI(bmi) {
  if (bmi < 18.5) return "Gầy";
  if (bmi < 25) return "Bình thường";
  if (bmi < 30) return "Thừa cân";
  return "Béo phì";
}

function calculateBMR({ gender, weight, height, age }) {
  const heightCm = height * 100;

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
    const { daysPerWeek, activityLevel = 1.55 } = req.body;

    const user = await User.findById(req.user.id);

    if (!user || !user.age || !user.height || !user.weight || !user.goal) {
      return res.status(400).json({
        message: "Vui lòng cập nhật đầy đủ hồ sơ trước khi tạo kế hoạch.",
      });
    }

    const bmi = calculateBMI(user.weight, user.height);
    const bmiType = classifyBMI(bmi);

    const bmr = calculateBMR({
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      age: user.age,
    });

    const tdee = Math.round(bmr * activityLevel);

    let targetCalories = tdee;

    if (user.goal === "Tăng cơ" || user.goal === "Tăng cân") {
      targetCalories = tdee + 400;
    }

    if (user.goal === "Siết mỡ" || user.goal === "Giảm cân") {
      targetCalories = tdee - 400;
    }

    const protein = Math.round(user.weight * 2);
    const fat = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

    const mealPlan = generateMealPlan(user.goal);

    await Meal.deleteMany({
      userId: user._id,
    });
    console.log("CARBS:", carbs);
    console.log("FAT:", fat);
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

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const text = message.toLowerCase();

    let reply =
      "Hiện tại tôi chưa hiểu rõ câu hỏi. Hãy hỏi về tập luyện hoặc dinh dưỡng.";

    if (text.includes("tăng cơ") || text.includes("bulk")) {
      reply =
        "Để tăng cơ hiệu quả, hãy ưu tiên progressive overload, ngủ đủ 7-8 tiếng và ăn surplus calories.";
    } else if (
      text.includes("giảm mỡ") ||
      text.includes("siết mỡ") ||
      text.includes("cut")
    ) {
      reply =
        "Để giảm mỡ, hãy giữ deficit calories, cardio 3-5 buổi/tuần và ưu tiên protein cao.";
    } else if (text.includes("protein")) {
      reply = "Protein khuyến nghị là khoảng 1.6-2.2g/kg cân nặng mỗi ngày.";
    } else if (text.includes("cardio")) {
      reply =
        "Cardio tốt cho giảm mỡ và tim mạch. Có thể đi bộ dốc, đạp xe hoặc Stairmaster 20-40 phút.";
    } else if (text.includes("đau vai")) {
      reply =
        "Nếu đau vai nhiều, nên giảm volume bài đẩy vai/ngực và nghỉ ngơi vài ngày để hồi phục.";
    } else if (text.includes("đau lưng")) {
      reply = "Nếu đau lưng khi tập, hãy kiểm tra form squat/deadlift và giảm mức tạ.";
    } else if (text.includes("creatine")) {
      reply =
        "Creatine monohydrate là supplement an toàn và hiệu quả giúp tăng sức mạnh và hiệu suất tập.";
    } else if (text.includes("whey")) {
      reply = "Whey protein giúp bổ sung protein tiện lợi, đặc biệt sau tập.";
    } else if (text.includes("ngủ")) {
      reply = "Ngủ đủ 7-8 tiếng rất quan trọng để phục hồi cơ bắp và hormone.";
    }

    res.json({
      message: "AI Coach trả lời thành công",
      question: message,
      reply,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;