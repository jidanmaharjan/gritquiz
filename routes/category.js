const express = require("express");
const router = express.Router();

const {
  getCategories,
  addCategory,
  updateCategory,
} = require("../controllers/categoryController");

const {
  isAuthenticated,
  authorizedRoles,
} = require("../middlewares/authMiddleware");

router.route("/all").get(getCategories);

//Loggedin routes
router.route("/new").post(isAuthenticated, addCategory);
router.route("/update/:id").put(isAuthenticated, updateCategory);

module.exports = router;
