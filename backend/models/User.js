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

  height: Number,

  weight: Number,

  targetWeight: Number,

  goalStartWeight: Number,

  gender: String,

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

  // ===== NEW AI FIELDS =====

  // focus ưu tiên
  preferenceFocus: {
    type: String,
    default: "balanced",
  },

  // thiết bị ở nhà
  homeEquipment: {
    type: [String],
    default: [],
  },

  // beginner < 6 tháng...
  trainingMonths: {
    type: Number,
    default: 0,
  },

  // user có đau/chấn thương không
  injuries: {
    type: [String],
    default: [],
  },

  // cardio preference
  cardioPreference: {
    type: String,
    default: "walking",
  },

  // lưu streak / adherence sau này
  completionRate: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);