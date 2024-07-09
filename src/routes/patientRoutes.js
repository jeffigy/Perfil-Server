const patientRoutes = require("express").Router();
const patientsController = require("../controllers/patientsController");
const upload = require("../middleware/multer");

patientRoutes.route("/").get(patientsController.getAllPatients);

patientRoutes.route("/update-details").patch(patientsController.updateDetails);

patientRoutes
  .route("/update-profile")
  .patch(upload.single("image"), patientsController.updateProfile);

patientRoutes.route("/join-workplace").patch(patientsController.joinWorkplace);

patientRoutes
  .route("/:workId")
  .get(patientsController.getAllPatientsByWorkplaceId);

module.exports = patientRoutes;
