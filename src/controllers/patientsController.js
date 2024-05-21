const User = require("../models/User");

const getAllPatients = async (_req, res) => {
  const patients = await User.find({ role: "Patient" });

  if (patients.length == 0) {
    return res.status(400).json({ message: "No patients found" });
  }

  res.json(patients);
};

const getAllPatientsByWorkplaceId = async (req, res) => {
  const { workId } = req.params;

  const patients = await User.find({
    role: "Patient",
    workplace: workId,
  }).exec();

  if (patients.length === 0) {
    return res.status(400).json({ message: "No patients found" });
  }

  res.json(patients);
};

module.exports = {
  getAllPatients,
  getAllPatientsByWorkplaceId,
};
