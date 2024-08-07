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
    roles: {
      type: [String],
      default: ["Health Worker"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      require: false,
    },
    cloudinary_id: {
      type: String,
      require: false,
    },
    verified: Boolean,
  },
  {
    timestamps: true,
  }
);

setToJSONTransform(userSchema);

const User = mongoose.model("User", userSchema);

module.exports = User;
