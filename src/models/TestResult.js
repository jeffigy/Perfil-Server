const mongoose = require("mongoose");

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

testResultSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("TestResult", testResultSchema);
