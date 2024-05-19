const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // required during registration
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
      default: "Patient",
    },
    // Roles: [ Patient, Health Worker, admin]
    //optional fields depends on the role
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
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
