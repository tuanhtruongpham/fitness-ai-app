const getBMIClass = (bmi) => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};

const chooseSplit = ({ gymDays, goal, bmiClass }) => {
  if (gymDays <= 2) {
    return "Full Body";
  }

  if (gymDays === 3) {
    return "Full Body";
  }

  if (gymDays === 4) {
    return "Upper / Lower";
  }

  if (gymDays >= 5) {
    return "Push Pull Legs";
  }

  return "Full Body";
};

const chooseCardio = ({ goal, bmiClass }) => {
  // FAT LOSS
  if (goal === "fat_loss") {
    if (bmiClass === "obese") {
      return {
        type: "Walking",
        duration: 30,
      };
    }

    if (bmiClass === "overweight") {
      return {
        type: "Incline Walking",
        duration: 25,
      };
    }

    return {
      type: "Running",
      duration: 20,
    };
  }

  // MUSCLE GAIN
  if (goal === "muscle_gain") {
    return {
      type: "Light Cycling",
      duration: 10,
    };
  }

  // WEIGHT GAIN
  if (goal === "weight_gain") {
    return {
      type: "Walking",
      duration: 10,
    };
  }

  // MAINTENANCE
  return {
    type: "Jogging",
    duration: 15,
  };
};

const chooseVolume = ({ goal, bmiClass }) => {
  if (goal === "fat_loss") {
    return "4-8 sets";
  }

  if (goal === "muscle_gain") {
    return "10-16 sets";
  }

  if (goal === "weight_gain") {
    return "8-12 sets";
  }

  return "6-10 sets";
};

const generateAIRecommendation = ({
  goal,
  bmi,
  gymDays,
  workoutPlace,
}) => {
  const bmiClass = getBMIClass(bmi);

  const split = chooseSplit({
    gymDays,
    goal,
    bmiClass,
  });

  const cardio = chooseCardio({
    goal,
    bmiClass,
  });

  const volume = chooseVolume({
    goal,
    bmiClass,
  });

  let recommendation = "";

  // FAT LOSS
  if (goal === "fat_loss") {
    recommendation =
      "Your AI plan focuses on fat loss with cardio and full-body resistance training.";
  }

  // MUSCLE GAIN
  else if (goal === "muscle_gain") {
    recommendation =
      "Your AI plan focuses on hypertrophy and progressive overload for muscle growth.";
  }

  // WEIGHT GAIN
  else if (goal === "weight_gain") {
    recommendation =
      "Your AI plan focuses on healthy weight gain with strength training.";
  }

  // MAINTENANCE
  else {
    recommendation =
      "Your AI plan balances strength, cardio, and recovery.";
  }

  return {
    bmiClass,
    split,
    cardio,
    volume,
    recommendation,

    rulesApplied: [
      `${goal}_plan`,
      `${split}_split`,
      `${bmiClass}_bmi_profile`,
    ],
  };
};

module.exports = {
  generateAIRecommendation,
};