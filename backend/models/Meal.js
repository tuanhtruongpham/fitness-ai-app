const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  quantity: String,
  grams: Number,

  calories: Number,
  proteinG: Number,
  carbsG: Number,
  fatG: Number,
  fiberG: Number,
  sugarG: Number,
  sodiumMg: Number,

  ingredients: [String],
  reason: String,
});

const mealBlockSchema = new mongoose.Schema({
  time: String, // Breakfast | Lunch | Dinner | Snack
  label: String, // Bữa sáng | Bữa trưa...
  targetCalories: Number,
  targetProteinG: Number,
  targetCarbsG: Number,
  targetFatG: Number,
  items: [mealItemSchema],
});

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goal: String,
    goalLabel: String,

    currentWeight: Number,
    targetWeight: Number,
    height: Number,
    bmi: Number,
    bmiCategory: String,

    dailyTarget: {
      calories: Number,
      proteinG: Number,
      carbsG: Number,
      fatG: Number,
    },

    meals: [mealBlockSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meal", mealSchema);