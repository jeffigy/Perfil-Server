const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

const appointmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    startDate: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Number,
      require: true,
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

setToJSONTransform(appointmentSchema);

module.exports = mongoose.model("Appointment", appointmentSchema);
