const mongoose = require("mongoose");
const { setToJSONTransform } = require("../utils/mongooseUtils");

const userSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "Health Woker",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

setToJSONTransform(userSchema);

const User = mongoose.model("User", userSchema);

module.exports = User;
