const workoutDatabase = require("../data/workoutDatabase");

const days = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

function getLevel(user) {
  const months = Number(user.trainingMonths || 0);

  if (months >= 24) return "Advanced";
  if (months >= 6) return "Intermediate";
  return "Beginner";
}

function getBMIClass(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi >= 25) return "overweight";
  return "normal";
}

function pickExercises(group, level, location, count = 2) {
  const list = workoutDatabase?.[group]?.[level]?.[location] || [];

  return list.slice(0, count).map((exercise) => ({
    name: exercise.name || "Exercise",
    sets: exercise.sets || "",
    reps: exercise.reps || "",
    duration: exercise.duration || "",
    target: exercise.target || "",
    equipment: exercise.equipment || "",
  }));
}

function getSplitByDays(gymDays, goal, gender, bmiClass) {
  const daysCount = Number(gymDays || 3);

  if (goal === "fat_loss" || bmiClass === "overweight") {
    if (daysCount <= 3) return ["Cardio", "Legs", "Abs"];
    if (daysCount === 4) return ["Cardio", "Legs", "Back", "Abs"];
    return ["Cardio", "Legs", "Back", "Chest", "Abs"];
  }

  if (goal === "muscle_gain" || goal === "weight_gain") {
    if (gender === "Nữ") {
      if (daysCount <= 3) return ["Legs", "Back", "Abs"];
      if (daysCount === 4) return ["Legs", "Chest", "Back", "Cardio"];
      return ["Legs", "Back", "Shoulder", "Abs", "Cardio"];
    }

    if (daysCount <= 3) return ["Chest", "Back", "Legs"];
    if (daysCount === 4) return ["Chest", "Back", "Legs", "Shoulder"];
    return ["Chest", "Back", "Legs", "Shoulder", "Arms"];
  }

  if (daysCount <= 3) return ["Chest", "Back", "Legs"];
  if (daysCount === 4) return ["Chest", "Back", "Legs", "Cardio"];
  return ["Chest", "Back", "Legs", "Abs", "Cardio"];
}

function buildWorkoutDay(splitName, level, location, goal) {
  let groups = [];

  if (splitName === "Arms") groups = ["Biceps", "Triceps"];
  else groups = [splitName];

  let exercises = [];

  groups.forEach((group) => {
    exercises.push(...pickExercises(group, level, location, 2));
  });

  if (goal === "fat_loss" && splitName !== "Cardio") {
    exercises.push(...pickExercises("Cardio", level, location, 1));
  }

  return exercises;
}

function generateAIWorkoutPlan(user) {
  const location = user.workoutPlace === "home" ? "home" : "gym";
  const gymDays = location === "home" ? 5 : Number(user.gymDays || 3);
  const level = getLevel(user);
  const bmi = Number(user.bmi || 22);
  const bmiClass = getBMIClass(bmi);

  const split = getSplitByDays(
    gymDays,
    user.goal || "maintenance",
    user.gender,
    bmiClass
  );

  const trainingDays = [1, 2, 3, 4, 5, 6].slice(0, gymDays);

  const weeklySchedule = days.map((dayName, index) => {
    if (index === 0 || !trainingDays.includes(index)) {
      return {
        dayIndex: index,
        day: dayName,
        name: "Rest Day",
        muscle: "Recovery",
        exercises: [],
      };
    }

    const splitIndex = trainingDays.indexOf(index) % split.length;
    const muscle = split[splitIndex];

    const exercises = buildWorkoutDay(
      muscle,
      level,
      location,
      user.goal || "maintenance"
    );

    return {
      dayIndex: index,
      day: dayName,
      name: `${muscle} Day`,
      muscle,
      exercises,
    };
  });

  const vietnamTime = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
  );

  const todayIndex = vietnamTime.getDay();
  const todayWorkout = weeklySchedule.find((d) => d.dayIndex === todayIndex);

  return {
    level,
    location,
    goal: user.goal || "maintenance",
    gender: user.gender || "Khác",
    bmi,
    bmiClass,
    gymDays,
    weeklySchedule,
    todayWorkout,
  };
}

module.exports = generateAIWorkoutPlan;