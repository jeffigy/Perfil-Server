const User = require("../models/User");
const Patient = require("../models/Patient");
const Workplace = require("../models/Workplace");
const cloudinary = require("../utils/cloudinary");

const getProfileByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  let profile = await User.findOne({ email }).exec();

  if (!profile) {
    profile = await Patient.findOne({ email }).exec();
  }

  if (!profile) {
    return res.status(400).json({ message: "Profile not found" });
  }

  res.json(profile);
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

  let foundProfile = await User.findById(id).exec();

  if (!foundProfile) {
    foundProfile = await Patient.findById(id).exec();
  }

  if (!foundProfile) {
    return res.status(400).json({ message: "Records not found" });
  }

  if (req.file.path) {
    const uploadImage = await cloudinary.uploader
      .upload(req.file.path, {
        folder: `portfolio/perfil/${id}/avatar`,
      })
      .catch((error) => console.log("upload image error", error));

    if (uploadImage) {
      if (foundProfile.cloudinary_id) {
        await cloudinary.uploader.destroy(foundProfile.cloudinary_id);
      }
      foundProfile.avatar = uploadImage.secure_url;
      foundProfile.cloudinary_id = uploadImage.public_id;
    }
  }

  await foundProfile.save();
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

module.exports = {
  getProfileByEmail,
  updateDetails,
  updateProfile,
  joinWorkplace,
};
