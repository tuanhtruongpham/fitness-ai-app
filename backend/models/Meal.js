const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema({
  food: String,
  quantity: String,
  calories: Number,
});

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goal: String,

    totalCalories: Number,

    protein: String,

    carbs: String,

    fat: String,

    meals: [
      {
        time: String,

        items: [mealItemSchema],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meal", mealSchema);