const express = require("express");
const router = express.Router();

const {
  loginUser,
  verifyOtp,
  getProfile,
  refreshToken,
} = require("../controllers/authController");

const {
  isAuthenticated,
  authorizedRoles,
} = require("../middlewares/authMiddleware");

router.route("/login").post(loginUser);
router.route("/verifyotp").post(verifyOtp);
router.route("/renew").post(refreshToken);

//Loggedin routes
router.route("/profile").get(isAuthenticated, getProfile);

module.exports = router;
