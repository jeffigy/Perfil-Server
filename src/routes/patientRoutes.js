const patientRoutes = require("express").Router();
const patientsController = require("../controllers/patientsController");

patientRoutes.route("/").get(patientsController.getAllPatients);

module.exports = patientRoutes;
