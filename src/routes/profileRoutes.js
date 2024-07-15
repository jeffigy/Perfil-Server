const profileRoutes = require("express").Router();
const profileController = require("../controllers/profileController");
const upload = require("../middleware/multer");

profileRoutes.route("/").get(profileController.getProfileByEmail);

profileRoutes.route("/update-details").patch(profileController.updateDetails);

profileRoutes
  .route("/update-profile")
  .patch(upload.single("image"), profileController.updateProfile);

profileRoutes.route("/join-workplace").patch(profileController.joinWorkplace);

module.exports = profileRoutes;
