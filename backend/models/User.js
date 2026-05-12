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
  required: true,
  unique: true,
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