const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: "",
  },

  age: Number,

  height: Number, // cm

  weight: Number, // kg hiện tại

<<<<<<< HEAD
  targetWeight: Number,

  goalStartWeight: Number,

  gender: String,
=======
  targetWeight: Number, // kg mong muốn

  gender: String, // male | female
>>>>>>> c1b8695 (meal plan update)

  // fat_loss | muscle_gain | maintenance | weight_gain
  goal: String,

  // beginner | intermediate | advanced
  level: String,

  // sedentary | light | moderate | active
  activity: String,

  // home | gym
  workoutPlace: String,

  // số ngày tập / tuần
  gymDays: Number,

  // BMI tính tự động
  bmi: Number,

  avatar: String,

  // ===== MEAL PLAN FIELDS =====

  // normal | vegetarian | low_carb | high_protein
  dietType: {
    type: String,
    default: "normal",
  },

  // ví dụ: ["milk", "peanut", "seafood"]
  allergies: {
    type: [String],
    default: [],
  },

  // general | muscle | endurance
  trainingFocus: {
    type: String,
    default: "general",
  },

  // số tuần muốn đạt target
  timeHorizonWeeks: {
    type: Number,
    default: 12,
  },

  // ===== AI WORKOUT FIELDS =====

  preferenceFocus: {
    type: String,
    default: "balanced",
  },

  homeEquipment: {
    type: [String],
    default: [],
  },

  trainingMonths: {
    type: Number,
    default: 0,
  },

  injuries: {
    type: [String],
    default: [],
  },

  cardioPreference: {
    type: String,
    default: "walking",
  },

  completionRate: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);