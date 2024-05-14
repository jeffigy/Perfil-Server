const announcementRoutes = require("express").Router();
const announcementController = require("../controllers/announcementController");

announcementRoutes
  .route("/")
  .get(announcementController.getAllAnnouncements)
  .post(announcementController.newAnnouncement)
  .patch(announcementController.updateAnnouncement)
  .delete(announcementController.deleteAnnouncement);

module.exports = announcementRoutes;
