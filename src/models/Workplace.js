const mongoose = require("mongoose");

const workplaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    owner: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

workplaceSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Workplace", workplaceSchema);
