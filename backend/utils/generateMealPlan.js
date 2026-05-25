const foodDatabase = require("../data/foodDatabase");

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getGoal(user) {
  const current = user.weight;
  const target = user.targetWeight;

  if (!current || !target) return user.goal || "maintenance";

  const diff = target - current;

  if (Math.abs(diff) < 1) return "maintenance";
  if (diff < 0) return "fat_loss";

  if (diff > 0 && (user.trainingFocus === "muscle" || user.goal === "muscle_gain")) {
    return "muscle_gain";
  }

  return "weight_gain";
}

function calculateBMR(user) {
  const weight = user.weight || 60;
  const height = user.height || 165;
  const age = user.age || 20;
  const gender = user.gender || "male";

  if (gender === "female") {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return 10 * weight + 6.25 * height - 5 * age + 5;
}

function getActivityMultiplier(activity) {
  const map = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  return map[activity] || 1.375;
}

function calculateDailyTarget(user, goal) {
  const bmr = calculateBMR(user);
  const maintenanceCalories = Math.round(bmr * getActivityMultiplier(user.activity));

  let calories = maintenanceCalories;

  if (goal === "fat_loss") calories -= 400;
  if (goal === "weight_gain") calories += 400;
  if (goal === "muscle_gain") calories += 250;

  calories = Math.max(calories, 1400);

  let proteinG;
  let fatG;
  let carbsG;

  if (goal === "fat_loss") {
    proteinG = Math.round(user.weight * 2);
    fatG = Math.round((calories * 0.25) / 9);
  } else if (goal === "muscle_gain") {
    proteinG = Math.round(user.weight * 2.1);
    fatG = Math.round((calories * 0.25) / 9);
  } else if (goal === "weight_gain") {
    proteinG = Math.round(user.weight * 1.8);
    fatG = Math.round((calories * 0.3) / 9);
  } else {
    proteinG = Math.round(user.weight * 1.6);
    fatG = Math.round((calories * 0.27) / 9);
  }

  carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
  };
}

function scoreFood(food, goal, bmiCategory, mealTime) {
  let score = 0;

  if (food.mealTime.includes(mealTime)) score += 5;
  if (food.goals.includes(goal)) score += 5;
  if (food.bmiSuitable.includes("All") || food.bmiSuitable.includes(bmiCategory)) score += 3;

  if (goal === "fat_loss") {
    if (food.proteinG >= 30) score += 3;
    if (food.fiberG >= 5) score += 2;
    if (food.calories <= 600) score += 2;
  }

  if (goal === "muscle_gain") {
    if (food.proteinG >= 35) score += 4;
    if (food.carbsG >= 40) score += 2;
  }

  if (goal === "weight_gain") {
    if (food.calories >= 500) score += 4;
    if (food.carbsG >= 50) score += 2;
  }

  return score;
}

function chooseFood(mealTime, targetCalories, goal, bmiCategory) {
  const candidates = foodDatabase
    .filter((food) => food.mealTime.includes(mealTime))
    .map((food) => ({
      ...food,
      score: scoreFood(food, goal, bmiCategory, mealTime),
    }))
    .sort((a, b) => b.score - a.score);

  const selected = candidates[0];

  const portionMultiplier = targetCalories / selected.calories;

  const safeMultiplier = Math.min(Math.max(portionMultiplier, 0.75), 1.35);

  return {
    id: selected.id,
    name: selected.name,
    quantity: selected.quantity,
    grams: Math.round(selected.grams * safeMultiplier),

    calories: Math.round(selected.calories * safeMultiplier),
    proteinG: Math.round(selected.proteinG * safeMultiplier),
    carbsG: Math.round(selected.carbsG * safeMultiplier),
    fatG: Math.round(selected.fatG * safeMultiplier),
    fiberG: Math.round(selected.fiberG * safeMultiplier),
    sugarG: Math.round(selected.sugarG * safeMultiplier),
    sodiumMg: Math.round(selected.sodiumMg * safeMultiplier),

    ingredients: selected.ingredients,
    reason: selected.reason,
  };
}

function generateMealPlan(user) {
  const goal = getGoal(user);

  const bmi = user.height
    ? Number((user.weight / Math.pow(user.height / 100, 2)).toFixed(1))
    : null;

  const bmiCategory = bmi ? getBMICategory(bmi) : "Normal";

  const dailyTarget = calculateDailyTarget(user, goal);

  const mealRatio = {
    Breakfast: 0.25,
    Lunch: 0.35,
    Dinner: 0.3,
    Snack: 0.1,
  };

  const labels = {
    Breakfast: "Bữa sáng",
    Lunch: "Bữa trưa",
    Dinner: "Bữa tối",
    Snack: "Bữa phụ",
  };

  const meals = Object.keys(mealRatio).map((mealTime) => {
    const targetCalories = Math.round(dailyTarget.calories * mealRatio[mealTime]);

    return {
      time: mealTime,
      label: labels[mealTime],
      targetCalories,
      targetProteinG: Math.round(dailyTarget.proteinG * mealRatio[mealTime]),
      targetCarbsG: Math.round(dailyTarget.carbsG * mealRatio[mealTime]),
      targetFatG: Math.round(dailyTarget.fatG * mealRatio[mealTime]),
      items: [
        chooseFood(mealTime, targetCalories, goal, bmiCategory),
      ],
    };
  });

  return {
    goal,
    goalLabel:
      goal === "fat_loss"
        ? "Giảm cân"
        : goal === "muscle_gain"
        ? "Tăng cơ"
        : goal === "weight_gain"
        ? "Tăng cân"
        : "Giữ cân",

    currentWeight: user.weight,
    targetWeight: user.targetWeight,
    height: user.height,
    bmi,
    bmiCategory,
    dailyTarget,
    meals,
  };
}

module.exports = generateMealPlan;