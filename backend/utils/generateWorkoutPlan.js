const workoutDatabase =
  require("../../frontend/src/data/workoutDatabase").default;

const pickExercises = (array, amount = 3) => {
  return array.slice(0, amount);
};

const generateWorkoutPlan = ({
  goal,
  bmi,
  gymDays,
  workoutPlace,
}) => {
  const location =
    workoutPlace === "home" ? "home" : "gym";

  let level = "Beginner";

  if (bmi < 18.5) {
    level = "Intermediate";
  }

  if (goal === "muscle_gain") {
    level = "Intermediate";
  }

  const plan = [];

  // ===== FULL BODY =====
  if (gymDays <= 3) {
    const chest =
      workoutDatabase.Chest[level][location];

    const shoulder =
      workoutDatabase.Shoulder[level][location];

    const legs =
      workoutDatabase.Legs[level][location];

    const cardio =
      workoutDatabase.Cardio[level][location];

    plan.push({
      day: "Full Body Day",

      exercises: [
        ...pickExercises(chest, 2),

        ...pickExercises(shoulder, 2),

        ...pickExercises(legs, 2),

        ...pickExercises(cardio, 1),
      ],
    });
  }

  // ===== UPPER LOWER =====
  else if (gymDays === 4) {
    plan.push({
      day: "Upper Body",

      exercises: [
        ...pickExercises(
          workoutDatabase.Chest[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Shoulder[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Biceps[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Triceps[level][location],
          2
        ),
      ],
    });

    plan.push({
      day: "Lower Body",

      exercises: [
        ...pickExercises(
          workoutDatabase.Legs[level][location],
          3
        ),

        ...pickExercises(
          workoutDatabase.Abs[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Cardio[level][location],
          1
        ),
      ],
    });
  }

  // ===== PUSH PULL LEGS =====
  else {
    plan.push({
      day: "Push Day",

      exercises: [
        ...pickExercises(
          workoutDatabase.Chest[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Shoulder[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Triceps[level][location],
          2
        ),
      ],
    });

    plan.push({
      day: "Pull Day",

      exercises: [
        ...pickExercises(
          workoutDatabase.Biceps[level][location],
          3
        ),
      ],
    });

    plan.push({
      day: "Leg Day",

      exercises: [
        ...pickExercises(
          workoutDatabase.Legs[level][location],
          3
        ),

        ...pickExercises(
          workoutDatabase.Abs[level][location],
          2
        ),

        ...pickExercises(
          workoutDatabase.Cardio[level][location],
          1
        ),
      ],
    });
  }

  return {
    level,
    location,
    plan,
  };
};

module.exports = generateWorkoutPlan;