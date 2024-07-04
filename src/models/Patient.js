const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

const patientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    roles: {
      type: [String],
      default: ["Patient"],
    },
    bday: {
      type: Number,
      require: false,
    },
    gender: {
      type: String,
      require: false,
    },
    civilStatus: {
      type: String,
      require: false,
    },
    fathersName: {
      type: String,
      require: false,
    },
    mothersName: {
      type: String,
      require: false,
    },
    ethnicity: {
      type: String,
      require: false,
    },
    nationality: {
      type: String,
      require: false,
    },
    workplace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workplace",
      require: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

setToJSONTransform(patientSchema);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
