const userRoutes = require("express").Router();
const usersController = require("../controllers/usersController");

userRoutes
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.addUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = userRoutes;
