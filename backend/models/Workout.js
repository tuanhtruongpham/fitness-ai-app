const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: String,

  muscleGroup: String,

  target: String,

  level: String,

  equipment: String,

  movementPattern: String,

  sets: Number,

  reps: String,

  restSec: Number,

  duration: Number,

  video: String,

  description: String,

  tips: [String],

  mistakes: [String],

  progression: String,

  regression: String,

  completed: {
    type: Boolean,
    default: false,
  },

  weightUsed: {
    type: Number,
    default: 0,
  },

  notes: {
    type: String,
    default: "",
  },
});

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Full Body A, Push Day,...
    day: {
      type: String,
      required: true,
    },

    // split type
    split: {
      type: String,
      default: "full_body",
    },

    muscle: {
      type: String,
      required: true,
    },

    level: String,

    location: String,

    // fat_loss | muscle_gain...
    goal: String,

    // beginner_volume_cap...
    rulesApplied: [String],

    // cardio section
    cardio: {
      type: {
        type: String,
        default: "",
      },

      durationMin: {
        type: Number,
        default: 0,
      },
    },

    exercises: [exerciseSchema],

    weeklySetTarget: String,

    progressionRule: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);