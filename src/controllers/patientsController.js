const Patient = require("../models/Patient");
const Workplace = require("../models/Workplace");
const cloudinary = require("../utils/cloudinary");

const getAllPatients = async (_req, res) => {
  const patients = await Patient.find();

  if (patients.length == 0) {
    return res.status(400).json({ message: "No patients found" });
  }

  res.json(patients);
};

const updateDetails = async (req, res) => {
  const {
    id,
    name,
    bday,
    gender,
    civilStatus,
    fathersName,
    mothersName,
    ethnicity,
    nationality,
  } = req.body;

  if (
    !id ||
    !name ||
    !bday ||
    !gender ||
    !civilStatus ||
    !fathersName ||
    !mothersName ||
    !ethnicity ||
    !nationality
  ) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const patient = await Patient.findById(id).exec();

  if (!patient) {
    return res.status(400).json({ message: "Records not found" });
  }

  patient.name = name;
  patient.bday = bday;
  patient.gender = gender;
  patient.civilStatus = civilStatus;
  patient.fathersName = fathersName;
  patient.mothersName = mothersName;
  patient.ethnicity = ethnicity;
  patient.nationality = nationality;

  await patient.save();
  res.json({ message: "Details successfully updated" });
};

const updateProfile = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  const patient = await Patient.findById(id).exec();

  if (!patient) {
    return res.status(400).json({ message: "Records not found" });
  }

  if (req.file.path) {
    const uploadImage = await cloudinary.uploader
      .upload(req.file.path, {
        folder: `portfolio/perfil/${id}/avatar`,
      })
      .catch((error) => console.log("upload image error", error));

    if (uploadImage) {
      if (patient.cloudinary_id) {
        await cloudinary.uploader.destroy(patient.cloudinary_id);
      }
      patient.avatar = uploadImage.secure_url;
      patient.cloudinary_id = uploadImage.public_id;
    }
  }

  await patient.save();
  res.json({ message: "Profile successfully updated" });
};

const joinWorkplace = async (req, res) => {
  const { id, workplace } = req.body;

  if (!id || !workplace) {
    return res.status(400).json({ message: "id and workplace are required" });
  }

  const patient = await Patient.findById(id).exec();

  const incompleteDetails =
    !patient.bday ||
    !patient.gender ||
    !patient.civilStatus ||
    !patient.fathersName ||
    !patient.mothersName ||
    !patient.ethnicity ||
    !patient.nationality;

  if (incompleteDetails) {
    res.status(400).json({ message: "your details are incomplete" });
  }

  const foundWorkplace = await Workplace.findById(workplace).exec();

  if (!foundWorkplace) {
    return res.status(400).json({ message: "Workplace not found" });
  }

  patient.workplace = workplace;
  await patient.save();
  res.json({ message: "Successfully joined workplace" });
};

const getAllPatientsByWorkplaceId = async (req, res) => {
  const { workId } = req.params;

  const patients = await Patient.find({
    workplace: workId,
  }).exec();

  if (patients.length === 0) {
    return res.status(400).json({ message: "No patients found" });
  }

  res.json(patients);
};

module.exports = {
  getAllPatients,
  updateDetails,
  updateProfile,
  joinWorkplace,
  getAllPatientsByWorkplaceId,
};
