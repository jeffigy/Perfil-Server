const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

const testResultSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Appointment",
    },
    examinedBy: {
      type: String,
      require: true,
    },
    result: {
      type: String,
      require: true,
    },
    diagnosis: {
      type: [String],
      require: false,
    },
    remarks: {
      type: String,
      require: false,
    },
    prescription: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

setToJSONTransform(testResultSchema);

module.exports = mongoose.model("TestResult", testResultSchema);
