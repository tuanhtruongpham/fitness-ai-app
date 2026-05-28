const getBMIClass = (bmi) => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};

const getLevel = (trainingMonths = 0) => {
  const months = Number(trainingMonths || 0);

  if (months >= 24) return "Advanced";
  if (months >= 6) return "Intermediate";
  return "Beginner";
};

const chooseSplit = ({ gymDays }) => {
  if (gymDays <= 2) return "Full Body";
  if (gymDays === 3) return "Push / Pull / Legs";
  if (gymDays === 4) return "Upper / Lower";
  return "Push Pull Legs";
};

const chooseCardio = ({ goal, bmiClass }) => {
  // FAT LOSS
  if (goal === "fat_loss") {
    if (bmiClass === "obese") return { type: "Walking", duration: 30 };
    if (bmiClass === "overweight") return { type: "Incline Walking", duration: 25 };
    return { type: "Running", duration: 20 };
  }

  if (goal === "muscle_gain") return { type: "Light Cycling", duration: 10 };
  if (goal === "weight_gain") return { type: "Walking", duration: 10 };

  return { type: "Jogging", duration: 15 };
};

const chooseVolume = ({ goal }) => {
  if (goal === "fat_loss") return "4-8 sets / muscle / week";
  if (goal === "muscle_gain") return "10-16 sets / muscle / week";
  if (goal === "weight_gain") return "8-12 sets / muscle / week";
  return "6-10 sets / muscle / week";
};

const generateAIRecommendation = ({
  goal,
  bmi,
  gymDays,
  workoutPlace,
  weight,
  targetWeight,
  trainingMonths,
}) => {
  const bmiClass = getBMIClass(Number(bmi || 22));
  const level = getLevel(trainingMonths);
  const split = chooseSplit({ gymDays });
  const cardio = chooseCardio({ goal, bmiClass });
  const volume = chooseVolume({ goal });

  const placeText = workoutPlace === "home" ? "home workout" : "gym training";
  const remainingWeight =
    targetWeight && weight ? Math.abs(targetWeight - weight).toFixed(1) : null;

  let summary = "";
  let advice = "";
  let nutritionFocus = "";
  let trainingFocus = "";
  let recovery = "";
  let nextAction = "";

  if (goal === "weight_gain") {
    summary = `You are currently ${weight || "N/A"}kg and your target is ${targetWeight || "N/A"}kg. Your BMI is ${bmi}, so the best direction is lean weight gain.`;
    advice = "Increase calories slowly, focus on protein, and avoid doing too much cardio.";
    nutritionFocus = "Eat 4 meals/day with rice, eggs, chicken, milk, oats, banana, and healthy fats.";
    trainingFocus = `Use ${split} with progressive overload. Since your level is ${level}, focus on correct form first.`;
    recovery = "Sleep 7-8 hours and keep rest days to let muscles grow.";
    nextAction = remainingWeight
      ? `You need about ${remainingWeight}kg more to reach your target. Complete today's workout and hit your calorie target.`
      : "Complete today's workout and eat enough calories today.";
  } else if (goal === "muscle_gain") {
    summary = `Your goal is muscle gain. Your BMI is ${bmi} and your training level is ${level}.`;
    advice = "Focus on hypertrophy, progressive overload, and consistent protein intake.";
    nutritionFocus = "Keep protein high and eat enough carbs before training.";
    trainingFocus = `Follow ${split}. Prioritize compound lifts and controlled reps.`;
    recovery = "Do not train the same muscle too hard every day. Recovery affects muscle growth.";
    nextAction = "Track sets, reps, and try to improve one small thing in today's workout.";
  } else if (goal === "fat_loss") {
    summary = `Your goal is fat loss. Your BMI class is ${bmiClass}, so the plan should balance fat burning and muscle retention.`;
    advice = "Use a small calorie deficit, not extreme dieting.";
    nutritionFocus = "Prioritize protein, vegetables, water, and reduce sugary drinks/snacks.";
    trainingFocus = `Use ${split} plus ${cardio.type} for ${cardio.duration} minutes.`;
    recovery = "Sleep well to control hunger and keep workout performance stable.";
    nextAction = "Finish today's workout and stay within your calorie target.";
  } else {
    summary = `Your current BMI is ${bmi}. Your goal is maintenance, so consistency matters most.`;
    advice = "Keep calories stable and maintain regular training.";
    nutritionFocus = "Eat balanced meals with enough protein, carbs, and healthy fats.";
    trainingFocus = `Follow ${split} with ${placeText}.`;
    recovery = "Keep sleep, hydration, and rest days stable.";
    nextAction = "Complete today's plan and track your workout.";
  }

  return {
    bmiClass,
    level,
    split,
    cardio,
    volume,

    summary,
    advice,
    nutritionFocus,
    trainingFocus,
    recovery,
    nextAction,

    recommendation: advice,

    rulesApplied: [
      `${goal}_plan`,
      `${split}_split`,
      `${bmiClass}_bmi_profile`,
      `${level}_level`,
      `${workoutPlace}_training`,
    ],
  };
};

module.exports = {
  generateAIRecommendation,
};