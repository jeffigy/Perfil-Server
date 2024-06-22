const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: false,
    },
    workplace: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Workplace",
    },
  },
  {
    timestamps: true,
  }
);

setToJSONTransform(announcementSchema);

module.exports = mongoose.model("Announcement", announcementSchema);
