const User = require("../models/User");
const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");

const getAllUsers = async (_req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

const addUser = async (req, res) => {
  const { email, name, password, roles, confirmPassword } = req.body;

  if (!email || !name || !password || !confirmPassword) {
    return res.status(400).json({ message: "all fields are required" });
  }

  if(password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const duplicatePatient = await Patient.findOne({ email })
    .collation({
      locale: "en",
      strength: 2,
    })
    .lean()
    .exec();

  console.log("duplicatePatient", duplicatePatient);

  const duplicateUser = await User.findOne({ email })
    .collation({
      locale: "en",
      strength: 2,
    })
    .lean()
    .exec();

  console.log("duplicateUser", duplicateUser);

  if (duplicateUser || duplicatePatient) {
    return res
      .status(409)
      .json({ message: "An account with similar email already exists" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObj = {
    email,
    name,
    password: hashedPwd,
    roles,
  };

  const newUser = await User.create(userObj);

  if (newUser) {
    return res.status(201).json({ message: "new user created" });
  } else {
    return res.status(400).json({ message: "Received invalid data" });
  }
};

const updateUser = async (req, res) => {
  const { id, email, name, password, roles, active } = req.body;

  if (
    !id ||
    !email ||
    !name ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "all fields except password are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }
  user.name = name;
  user.email = email;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.email} updated` });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "user id is required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  res.json({ message: `User with email ${result.email} has been deleted` });
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
