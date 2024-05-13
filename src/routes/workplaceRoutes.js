const workplaceRoutes = require("express").Router();
const workplaceController = require("../controllers/workplaceController");

workplaceRoutes
  .route("/")
  .get(workplaceController.getAllWorkplace)
  .post(workplaceController.newWorkplace)
  .patch(workplaceController.updateWorkplace)
  .delete(workplaceController.deleteWorkplace);

module.exports = workplaceRoutes;
