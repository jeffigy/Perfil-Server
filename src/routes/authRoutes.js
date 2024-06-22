const authRoutes = require("express").Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

authRoutes.route("/login").post(loginLimiter, authController.login);
authRoutes.route("/signup").post(authController.signup);
authRoutes.route("/refresh").get(authController.refresh);
authRoutes.route("/logout").post(authController.logout);

module.exports = authRoutes;
