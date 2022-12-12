const express = require("express");
const router = express.Router();

const {
  getAllQuizes,
  addQuiz,
  deleteQuiz,
  getRandomQuizes,
} = require("../controllers/quizController");

const {
  isAuthenticated,
  authorizedRoles,
} = require("../middlewares/authMiddleware");

router
  .route("/all")
  .get(isAuthenticated, authorizedRoles("admin"), getAllQuizes);
router.route("/random").get(isAuthenticated, getRandomQuizes);
router.route("/new").post(addQuiz);
// router.route("/verifyotp").post(verifyOtp);
router.route("/delete/:id").delete(deleteQuiz);

module.exports = router;
