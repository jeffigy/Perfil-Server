const patientRoutes = require("express").Router();
const patientsController = require("../controllers/patientsController");
const upload = require("../middleware/multer");

patientRoutes.route("/").get(patientsController.getAllPatients);

patientRoutes
  .route("/:workId")
  .get(patientsController.getAllPatientsByWorkplaceId);

module.exports = patientRoutes;
