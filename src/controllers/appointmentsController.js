const Appointment = require("../models/Appointment");

const getAllAppointments = async (_req, res) => {
  const appointments = await Appointment.find({});

  if (appointments.length === 0) {
    return res.status(400).json({ message: "No appointments found" });
  }

  res.json(appointments);
};

const getAllAppointmentsByWorkplaceId = async (req, res) => {
  const { workId } = req.params;

  const appointments = await Appointment.find({ workplace: workId }).exec();

  if (appointments.length === 0) {
    return res.status(400).json({ message: "No appointments found" });
  }

  res.json(appointments);
};

const newAppointment = async (req, res) => {
  const { title, category, startDate, endDate, workplace } = req.body;

  if (!title || !category || !startDate || !endDate || !workplace) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const duplicate = await Appointment.findOne({
    title,
    category,
    startDate,
    endDate,
    workplace,
  })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Appointment" });
  }

  const appointmentObj = {
    title,
    category,
    startDate,
    endDate,
    workplace,
  };

  const appointment = await Appointment.create(appointmentObj);

  if (appointment) {
    return res.status(201).json({ message: "New appointment created" });
  } else {
    return res
      .status(400)
      .json({ message: "Received invalid appointment date" });
  }
};

const updateAppointment = async (req, res) => {
  const { id, title, category, startDate, endDate, workplace } = req.body;

  if (!id || !title || !category || !startDate || !endDate || !workplace) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const appointment = await Appointment.findById(id).exec();

  if (!appointment) {
    return res.status(400).json({ message: "Appointment not found" });
  }

  const duplicate = await Appointment.findOne({
    title,
    category,
    startDate,
    endDate,
    workplace,
  })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Appointment" });
  }

  appointment.title = title;
  appointment.category = category;
  appointment.startDate = startDate;
  appointment.endDate = endDate;

  await appointment.save();
  res.json({ message: "Appointment successfully apdated" });
};

const deleteAppointment = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Appointment Id is required" });
  }

  const appointment = await Appointment.findById(id).exec();

  if (!appointment) {
    return res.status(400).json({ message: "No appointment found" });
  }

  await appointment.deleteOne();
  res.json({ message: "appointment has been deleted" });
};

module.exports = {
  getAllAppointments,
  getAllAppointmentsByWorkplaceId,
  newAppointment,
  updateAppointment,
  deleteAppointment,
};
