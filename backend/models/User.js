const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  age: Number,

  height: Number,

  weight: Number,

  gender: String,

  goal: String,

  bmi: Number,
  
  avatar: String,
});

module.exports = mongoose.model("User", userSchema);