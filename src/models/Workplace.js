const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

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

setToJSONTransform(workplaceSchema);

module.exports = mongoose.model("Workplace", workplaceSchema);
