const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

const workplaceSchema = new mongoose.Schema(
  {
    name: String,
    owner: String,
    address: String,
    workplaceCode: String,
  },
  {
    timestamps: true,
  }
);

setToJSONTransform(workplaceSchema);

module.exports = mongoose.model("Workplace", workplaceSchema);
