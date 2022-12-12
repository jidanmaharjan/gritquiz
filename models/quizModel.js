const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter quiz title"],
    minLength: [16, "Quiz question is that small? really?"],
  },
  options: [
    {
      option: {
        type: String,
        required: [true, "Please enter option"],
      },
      correct: {
        type: Boolean,
        required: [true, "Please enter specifity of option"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
