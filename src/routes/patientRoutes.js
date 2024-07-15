const patientRoutes = require("express").Router();
const patientsController = require("../controllers/patientsController");

patientRoutes.route("/").get(patientsController.getAllPatients);

patientRoutes
  .route("/:workId")
  .get(patientsController.getAllPatientsByWorkplaceId);

module.exports = patientRoutes;
