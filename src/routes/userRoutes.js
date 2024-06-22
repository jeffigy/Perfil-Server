const userRoutes = require("express").Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

userRoutes.use(verifyJWT);

userRoutes
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.addUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = userRoutes;
