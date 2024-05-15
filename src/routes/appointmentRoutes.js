const appointmentRoutes = require("express").Router();
const appointmentsController = require("../controllers/appointmentsController");

appointmentRoutes
  .route("/")
  .get(appointmentsController.getAllAppointments)
  .post(appointmentsController.newAppointment)
  .patch(appointmentsController.updateAppointment)
  .delete(appointmentsController.deleteAppointment);

module.exports = appointmentRoutes;
