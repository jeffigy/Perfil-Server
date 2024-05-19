const authRoutes = require("express").Router();
const authController = require("../controllers/authController");

authRoutes.route("/signup").post(authController.signup);

module.exports = authRoutes;
