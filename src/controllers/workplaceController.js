const Workplace = require("../models/Workplace");

const getAllWorkplace = async (_req, res) => {
  const workplaces = await Workplace.find({});

  if (workplaces.length === 0) {
    return res.status(404).json({
      message: "no workplace found",
    });
  }

  res.json(workplaces);
};

const newWorkplace = async (req, res) => {
  const { name, owner, address } = req.body;

  if (!name || !owner || !address) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const duplicate = await Workplace.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "workplace already existed" });
  }

  const workplaceObject = {
    name,
    owner,
    address,
  };

  const newWorkplace = await Workplace.create(workplaceObject);

  if (newWorkplace) {
    return res
      .status(201)
      .json({ message: "new workplace successfully created" });
  } else {
    return res.status(400).json({ message: "Received invalid worklace data" });
  }
};

const updateWorkplace = async (req, res) => {
  const { name, owner, address, id } = req.body;

  if (!id || !name || !owner || !address) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const workplace = await Workplace.findById(id).exec();

  if (!workplace) {
    return res.status(400).json({ message: "Workplace not found" });
  }

  const duplicate = await Workplace.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate workplace name" });
  }

  workplace.name = name;
  workplace.owner = owner;
  workplace.address = address;

  const updatedWorkplace = await workplace.save();
  console.log(updatedWorkplace);

  res.json({ message: `${updatedWorkplace.name} successfully updated` });
};

const deleteWorkplace = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Workplace Id is required" });
  }

  const workplace = await Workplace.findById(id).exec();

  if (!workplace) {
    return res.status(400).json({ message: "Workplace not found" });
  }

  const result = await workplace.deleteOne();

  res.json({ message: `Workplace ${result.name} deleted` });
};

module.exports = {
  getAllWorkplace,
  newWorkplace,
  updateWorkplace,
  deleteWorkplace,
};
