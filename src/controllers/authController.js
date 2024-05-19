const User = require("../models/User");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ email })
    .collation({
      locale: "en",
      strength: 2,
    })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Email" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObj = {
    email,
    name,
    password: hashedPwd,
    role: "Patient",
  };

  const user = await User.create(userObj);

  if (user) {
    res.status(201).json({ message: "Register Successfully" });
  } else {
    res.status(400).json({ message: "Received invalid user data" });
  }
};

module.exports = {
  signup,
};
