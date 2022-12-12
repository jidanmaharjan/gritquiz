const Quiz = require("../models/quizModel");

exports.getAllQuizes = async (req, res) => {
  try {
    const allQuizes = await Quiz.find();
    res.status(200).json({
      success: true,
      data: allQuizes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRandomQuizes = async (req, res) => {
  try {
    const random = await Quiz.aggregate([
      { $sample: { size: Number(req.query.limit) || 2 } },
    ]);
    res.status(200).json({
      success: true,
      data: random,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addQuiz = async (req, res) => {
  const newQuiz = req.body;
  try {
    await Quiz.create(newQuiz);
    res.status(200).json({
      success: true,
      data: newQuiz,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
