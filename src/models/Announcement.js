const mongoose = require("mongoose");

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

announcementSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Announcement", announcementSchema);
