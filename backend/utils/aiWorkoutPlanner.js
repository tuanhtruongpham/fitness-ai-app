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

function pickExercises(group, level, location, count = 3) {
  const fallbackByLevel = {
    Beginner: ["Beginner", "Intermediate"],
    Intermediate: ["Intermediate", "Beginner"],
    Advanced: ["Advanced", "Intermediate", "Beginner"],
  };

  const levelsToUse =
    fallbackByLevel[level] || ["Beginner", "Intermediate"];

  let list = [];

  levelsToUse.forEach((levelName) => {
    const exercises =
      workoutDatabase?.[group]?.[levelName]?.[location] || [];

    list.push(...exercises);
  });

  return list.slice(0, count).map((exercise) => ({
    name: exercise.name || "Exercise",
    sets: exercise.sets || "",
    reps: exercise.reps || "",
    duration: exercise.duration || "",
    target: exercise.target || "",
    equipment: exercise.equipment || "",
    description: exercise.description || "",
    video: exercise.video || "",
  }));
}

function getSplitByDays(gymDays, goal, bmiClass) {
  const daysCount = Number(gymDays || 3);

  if (daysCount <= 2) {
    return ["Push", "Pull"];
  }

  if (daysCount === 3) {
    return ["Push", "Pull", "Legs"];
  }

  if (daysCount === 4) {
    return ["Push", "Pull", "Legs", "Abs"];
  }

  if (daysCount === 5) {
    return ["Push", "Pull", "Legs", "Shoulder", "Abs"];
  }

  if (daysCount === 6) {
    return ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
  }

  return ["Push", "Pull", "Legs", "Shoulder", "Arms", "Abs", "Cardio"];
}

function buildWorkoutDay(splitName, level, location, goal) {
  let groups = [];

  if (splitName === "Push") {
  groups = ["Chest", "Shoulder", "Triceps"];
} else if (splitName === "Pull") {
  groups = ["Back", "Biceps"];
} else if (splitName === "Legs") {
  groups = ["Legs"];
} else if (splitName === "Shoulder") {
  groups = ["Shoulder", "Abs"];
} else if (splitName === "Arms") {
  groups = ["Biceps", "Triceps"];
} else if (splitName === "Abs") {
  groups = ["Abs", "Cardio"];
} else {
  groups = [splitName];
}

  let exercises = [];

  groups.forEach((group) => {
    exercises.push(...pickExercises(group, level, location, 4));
  });

  if (goal === "fat_loss") {
    exercises.push(...pickExercises("Cardio", level, location, 2));
  }

  return exercises.slice(0, 8);
}

function generateAIWorkoutPlan(user) {
  const location = user.workoutPlace === "home" ? "home" : "gym";
  const gymDays = Number(user.gymDays || 3);
  const level = getLevel(user);
  const bmi = Number(user.bmi || 22);
  const bmiClass = getBMIClass(bmi);

  const split = getSplitByDays(
  gymDays,
  user.goal || "maintenance",
  bmiClass
);

 const trainingDayPatterns = {
  1: [1],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 5, 6],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
};

const trainingDays = trainingDayPatterns[gymDays] || trainingDayPatterns[3];

  const weeklySchedule = days.map((dayName, index) => {
    if (!trainingDays.includes(index)) {
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