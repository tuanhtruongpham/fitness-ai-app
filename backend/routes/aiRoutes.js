const express = require("express");
const router = express.Router();

const User = require("../models/User");
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

function generateWorkout(goal, daysPerWeek) {
  if (goal === "Tăng cơ") {
    if (daysPerWeek <= 3) {
      return [
        {
          day: "Thứ 2",
          type: "Full Body",
          exercises: [
            { name: "Squat", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Barbell Row", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Lateral Raise", sets: 3, reps: "15", rest: "45s" },
          ],
        },
        {
          day: "Thứ 4",
          type: "Full Body",
          exercises: [
            { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90s" },
            {
              name: "Incline Dumbbell Press",
              sets: 4,
              reps: "10",
              rest: "75s",
            },
            { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60s" },
            { name: "Tricep Pushdown", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        {
          day: "Thứ 6",
          type: "Full Body",
          exercises: [
            { name: "Leg Press", sets: 3, reps: "12", rest: "75s" },
            { name: "Shoulder Press", sets: 3, reps: "10", rest: "75s" },
            { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Hammer Curl", sets: 3, reps: "12", rest: "60s" },
          ],
        },
      ];
    }

    if (daysPerWeek === 4) {
      return [
        {
          day: "Thứ 2",
          type: "Upper",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Barbell Row", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Shoulder Press", sets: 3, reps: "10", rest: "75s" },
            { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        {
          day: "Thứ 3",
          type: "Lower",
          exercises: [
            { name: "Squat", sets: 4, reps: "8", rest: "120s" },
            { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90s" },
            { name: "Leg Press", sets: 3, reps: "12", rest: "75s" },
          ],
        },
        {
          day: "Thứ 5",
          type: "Upper",
          exercises: [
            {
              name: "Incline Dumbbell Press",
              sets: 4,
              reps: "10",
              rest: "75s",
            },
            { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
            { name: "Barbell Curl", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        {
          day: "Thứ 6",
          type: "Lower",
          exercises: [
            { name: "Leg Curl", sets: 3, reps: "12", rest: "60s" },
            { name: "Calf Raise", sets: 4, reps: "15", rest: "45s" },
            { name: "Hanging Leg Raise", sets: 3, reps: "15", rest: "45s" },
          ],
        },
      ];
    }

    if (daysPerWeek === 5) {
      return [
        {
          day: "Thứ 2",
          type: "Push",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
            {
              name: "Incline Dumbbell Press",
              sets: 4,
              reps: "10",
              rest: "75s",
            },
            { name: "Shoulder Press", sets: 3, reps: "10", rest: "75s" },
            { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
            { name: "Tricep Pushdown", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        {
          day: "Thứ 3",
          type: "Pull",
          exercises: [
            { name: "Pull Up", sets: 4, reps: "Max", rest: "90s" },
            { name: "Barbell Row", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60s" },
            { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Barbell Curl", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        {
          day: "Thứ 4",
          type: "Legs",
          exercises: [
            { name: "Squat", sets: 4, reps: "8", rest: "120s" },
            { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90s" },
            { name: "Leg Press", sets: 3, reps: "12", rest: "75s" },
            { name: "Leg Curl", sets: 3, reps: "12", rest: "60s" },
            { name: "Calf Raise", sets: 4, reps: "15", rest: "45s" },
          ],
        },
        {
          day: "Thứ 5",
          type: "Upper",
          exercises: [
            { name: "Incline Bench Press", sets: 4, reps: "10", rest: "75s" },
            { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
            { name: "Tricep Pushdown", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        {
          day: "Thứ 6",
          type: "Lower",
          exercises: [
            { name: "Leg Press", sets: 3, reps: "12", rest: "75s" },
            { name: "Leg Curl", sets: 3, reps: "12", rest: "60s" },
            { name: "Calf Raise", sets: 4, reps: "15", rest: "45s" },
            { name: "Hanging Leg Raise", sets: 3, reps: "15", rest: "45s" },
          ],
        },
      ];
    }

    return [
      {
        day: "Thứ 2",
        type: "Push",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "10", rest: "75s" },
          { name: "Shoulder Press", sets: 3, reps: "10", rest: "75s" },
          { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
          { name: "Tricep Pushdown", sets: 3, reps: "12", rest: "60s" },
        ],
      },
      {
        day: "Thứ 3",
        type: "Pull",
        exercises: [
          { name: "Pull Up", sets: 4, reps: "Max", rest: "90s" },
          { name: "Barbell Row", sets: 4, reps: "8-10", rest: "90s" },
          { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60s" },
          { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
          { name: "Barbell Curl", sets: 3, reps: "12", rest: "60s" },
        ],
      },
      {
        day: "Thứ 4",
        type: "Legs",
        exercises: [
          { name: "Squat", sets: 4, reps: "8", rest: "120s" },
          { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90s" },
          { name: "Leg Press", sets: 3, reps: "12", rest: "75s" },
          { name: "Leg Curl", sets: 3, reps: "12", rest: "60s" },
          { name: "Calf Raise", sets: 4, reps: "15", rest: "45s" },
        ],
      },
      {
        day: "Thứ 5",
        type: "Push",
        exercises: [
          { name: "Incline Bench Press", sets: 4, reps: "10", rest: "75s" },
          { name: "Shoulder Press", sets: 3, reps: "10", rest: "75s" },
          { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
          { name: "Overhead Extension", sets: 3, reps: "12", rest: "60s" },
        ],
      },
      {
        day: "Thứ 6",
        type: "Pull",
        exercises: [
          { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60s" },
          { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
          { name: "Hammer Curl", sets: 3, reps: "12", rest: "60s" },
          { name: "Face Pull", sets: 3, reps: "15", rest: "45s" },
        ],
      },
      {
        day: "Thứ 7",
        type: "Legs",
        exercises: [
          { name: "Squat", sets: 4, reps: "8", rest: "120s" },
          { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90s" },
          { name: "Leg Press", sets: 3, reps: "12", rest: "75s" },
          { name: "Calf Raise", sets: 4, reps: "15", rest: "45s" },
        ],
      },
    ];
  }

  if (goal === "Siết mỡ" || goal === "Giảm cân") {
    if (daysPerWeek <= 3) {
      return [
        {
          day: "Thứ 2",
          type: "Full Body + Cardio",
          exercises: [
            { name: "Squat", sets: 4, reps: "12", rest: "90s" },
            { name: "Push Up", sets: 3, reps: "Max", rest: "45s" },
            { name: "Lat Pulldown", sets: 4, reps: "12", rest: "60s" },
            { name: "Walking Lunge", sets: 3, reps: "15", rest: "60s" },
          ],
          cardio: "Đi bộ dốc 20 phút",
        },
        {
          day: "Thứ 4",
          type: "Full Body + Cardio",
          exercises: [
            { name: "Romanian Deadlift", sets: 4, reps: "12", rest: "75s" },
            { name: "Incline Bench Press", sets: 4, reps: "12", rest: "60s" },
            { name: "Dumbbell Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Calf Raise", sets: 4, reps: "20", rest: "30s" },
          ],
          cardio: "Đạp xe 20 phút",
        },
        {
          day: "Thứ 6",
          type: "Full Body + Cardio",
          exercises: [
            { name: "Leg Press", sets: 3, reps: "15", rest: "60s" },
            { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
            { name: "Rope Pushdown", sets: 3, reps: "15", rest: "45s" },
            { name: "Bicep Curl", sets: 3, reps: "15", rest: "45s" },
          ],
          cardio: "Stairmaster 20 phút",
        },
      ];
    }

    return [
      {
        day: "Thứ 2",
        type: "Upper + Cardio",
        exercises: [
          { name: "Incline Bench Press", sets: 4, reps: "12", rest: "60s" },
          { name: "Push Up", sets: 3, reps: "Max", rest: "45s" },
          { name: "Lat Pulldown", sets: 4, reps: "12", rest: "60s" },
          { name: "Dumbbell Row", sets: 3, reps: "12", rest: "60s" },
          { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" },
        ],
        cardio: "Incline Walk 20 phút",
      },
      {
        day: "Thứ 3",
        type: "Lower + Cardio",
        exercises: [
          { name: "Squat", sets: 4, reps: "12", rest: "90s" },
          { name: "Romanian Deadlift", sets: 4, reps: "12", rest: "75s" },
          { name: "Walking Lunge", sets: 3, reps: "15", rest: "60s" },
          { name: "Leg Curl", sets: 3, reps: "15", rest: "45s" },
          { name: "Calf Raise", sets: 4, reps: "20", rest: "30s" },
        ],
        cardio: "Stairmaster 20 phút",
      },
      {
        day: "Thứ 5",
        type: "Upper + Cardio",
        exercises: [
          { name: "Lat Pulldown", sets: 4, reps: "12", rest: "60s" },
          { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
          { name: "Rope Pushdown", sets: 3, reps: "15", rest: "45s" },
          { name: "Bicep Curl", sets: 3, reps: "15", rest: "45s" },
        ],
        cardio: "Đạp xe 20 phút",
      },
      {
        day: "Thứ 6",
        type: "Lower + Cardio",
        exercises: [
          { name: "Leg Press", sets: 3, reps: "15", rest: "60s" },
          { name: "Leg Curl", sets: 3, reps: "15", rest: "45s" },
          { name: "Calf Raise", sets: 4, reps: "20", rest: "30s" },
        ],
        cardio: "Đi bộ dốc 20 phút",
      },
    ];
  }

  if (daysPerWeek <= 3) {
    return [
      {
        day: "Thứ 2",
        type: "Full Body Strength",
        exercises: [
          { name: "Squat", sets: 5, reps: "5", rest: "3-4 phút" },
          { name: "Bench Press", sets: 5, reps: "5", rest: "3 phút" },
          { name: "Barbell Row", sets: 5, reps: "5", rest: "3 phút" },
        ],
      },
      {
        day: "Thứ 4",
        type: "Full Body Strength",
        exercises: [
          { name: "Deadlift", sets: 4, reps: "5", rest: "4 phút" },
          { name: "Overhead Press", sets: 4, reps: "6", rest: "2 phút" },
          { name: "Pull Up", sets: 4, reps: "Max", rest: "2 phút" },
        ],
      },
      {
        day: "Thứ 6",
        type: "Full Body Strength",
        exercises: [
          { name: "Squat", sets: 5, reps: "5", rest: "3-4 phút" },
          { name: "Leg Press", sets: 3, reps: "10", rest: "90s" },
          { name: "Plank", sets: 3, reps: "60s", rest: "60s" },
        ],
      },
    ];
  }

  return [
    {
      day: "Thứ 2",
      type: "Upper Strength",
      exercises: [
        { name: "Bench Press", sets: 5, reps: "5", rest: "3 phút" },
        { name: "Barbell Row", sets: 5, reps: "5", rest: "3 phút" },
        { name: "Overhead Press", sets: 4, reps: "6", rest: "2 phút" },
        { name: "Pull Up", sets: 4, reps: "Max", rest: "2 phút" },
      ],
    },
    {
      day: "Thứ 3",
      type: "Lower Strength",
      exercises: [
        { name: "Squat", sets: 5, reps: "5", rest: "3-4 phút" },
        { name: "Deadlift", sets: 4, reps: "5", rest: "4 phút" },
        { name: "Romanian Deadlift", sets: 3, reps: "6", rest: "2 phút" },
        { name: "Leg Press", sets: 3, reps: "10", rest: "90s" },
      ],
    },
    {
      day: "Thứ 5",
      type: "Upper Strength",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6", rest: "3 phút" },
        { name: "Barbell Row", sets: 4, reps: "6", rest: "3 phút" },
        { name: "Barbell Curl", sets: 3, reps: "8", rest: "90s" },
      ],
    },
    {
      day: "Thứ 6",
      type: "Lower Strength",
      exercises: [
        { name: "Squat", sets: 4, reps: "6", rest: "3 phút" },
        { name: "Deadlift", sets: 3, reps: "5", rest: "4 phút" },
        { name: "Plank", sets: 3, reps: "60s", rest: "60s" },
      ],
    },
  ];
}

function generateMealPlan(goal) {
  if (goal === "Siết mỡ" || goal === "Giảm cân") {
    return [
      { time: "Bữa sáng", foods: ["3 trứng", "Yến mạch"] },
      { time: "Bữa trưa", foods: ["150g ức gà", "150g cơm", "Rau xanh"] },
      { time: "Bữa xế", foods: ["Sữa chua Hy Lạp"] },
      { time: "Bữa tối", foods: ["Cá hồi hoặc bò nạc", "Salad", "Khoai lang"] },
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

    if (user.goal === "Tăng cơ") {
      targetCalories = tdee + 400;
    }

    if (user.goal === "Siết mỡ" || user.goal === "Giảm cân") {
      targetCalories = tdee - 400;
    }

    const proteinMin = Math.round(user.weight * 1.6);
    const proteinMax = Math.round(user.weight * 2.2);

    const workoutPlan = generateWorkout(user.goal, Number(daysPerWeek));
    const mealPlan = generateMealPlan(user.goal);

    res.json({
      message: "Tạo kế hoạch thông minh thành công",
      userInfo: {
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        daysPerWeek: Number(daysPerWeek),
      },
      bodyAnalysis: {
        bmi,
        bmiType,
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        protein: `${proteinMin}-${proteinMax}g/ngày`,
      },
      workoutPlan,
      mealPlan,
      notes: {
        restTime:
          "Compound nghỉ 90-120s khi tăng cơ, 3-5 phút khi tăng sức mạnh, isolation nghỉ 30-60s.",
        progressiveOverload:
          "Mỗi tuần tăng 1-2 reps hoặc tăng 2.5kg-5kg khi hoàn thành đủ rep tối đa.",
      },
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

    let reply = "Hiện tại tôi chưa hiểu rõ câu hỏi. Hãy hỏi về tập luyện hoặc dinh dưỡng.";

    // Tăng cơ
    if (
      text.includes("tăng cơ") ||
      text.includes("bulk")
    ) {
      reply =
        "Để tăng cơ hiệu quả, hãy ưu tiên progressive overload, ngủ đủ 7-8 tiếng và ăn surplus calories.";
    }

    // Giảm mỡ
    else if (
      text.includes("giảm mỡ") ||
      text.includes("siết mỡ") ||
      text.includes("cut")
    ) {
      reply =
        "Để giảm mỡ, hãy giữ deficit calories, cardio 3-5 buổi/tuần và ưu tiên protein cao.";
    }

    // Protein
    else if (
      text.includes("protein")
    ) {
      reply =
        "Protein khuyến nghị là khoảng 1.6-2.2g/kg cân nặng mỗi ngày.";
    }

    // Cardio
    else if (
      text.includes("cardio")
    ) {
      reply =
        "Cardio tốt cho giảm mỡ và tim mạch. Có thể đi bộ dốc, đạp xe hoặc Stairmaster 20-40 phút.";
    }

    // Đau vai
    else if (
      text.includes("đau vai")
    ) {
      reply =
        "Nếu đau vai nhiều, nên giảm volume bài đẩy vai/ngực và nghỉ ngơi vài ngày để hồi phục.";
    }

    // Đau lưng
    else if (
      text.includes("đau lưng")
    ) {
      reply =
        "Nếu đau lưng khi tập, hãy kiểm tra form squat/deadlift và giảm mức tạ.";
    }

    // Creatine
    else if (
      text.includes("creatine")
    ) {
      reply =
        "Creatine monohydrate là supplement an toàn và hiệu quả giúp tăng sức mạnh và hiệu suất tập.";
    }

    // Whey
    else if (
      text.includes("whey")
    ) {
      reply =
        "Whey protein giúp bổ sung protein tiện lợi, đặc biệt sau tập.";
    }

    // Ngủ
    else if (
      text.includes("ngủ")
    ) {
      reply =
        "Ngủ đủ 7-8 tiếng rất quan trọng để phục hồi cơ bắp và hormone.";
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