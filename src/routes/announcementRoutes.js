const announcementRoutes = require("express").Router();
const announcementController = require("../controllers/announcementsController");

announcementRoutes
  .route("/")
  .get(announcementController.getAllAnnouncements)
  .post(announcementController.newAnnouncement)
  .patch(announcementController.updateAnnouncement)
  .delete(announcementController.deleteAnnouncement);

announcementRoutes
  .route("/:workId")
  .get(announcementController.getAllAnnouncementsByWorkplaceId);

module.exports = announcementRoutes;
