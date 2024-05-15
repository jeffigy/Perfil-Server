const mongoose = require("mongoose");

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

appointmentSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
