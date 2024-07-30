const Announcement = require("../models/Announcement");

const getAllAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({});

  if (announcements.length === 0) {
    return res.status(400).json({ message: "No announcements found" });
  }

  res.json(announcements);
};

const getAllAnnouncementsByWorkplaceId = async (req, res) => {
  const { workId } = req.params;

  const announcements = await Announcement.find({ workplace: workId }).exec();

  if (announcements.length === 0) {
    return res.status(400).json({ message: "No announcements found" });
  }

  res.json(announcements);
};

const newAnnouncement = async (req, res) => {
  const { workplace, title } = req.body;

  if (!workplace || !title) {
    return res
      .status(400)
      .json({ message: "workplace and title are required" });
  }
  const duplicate = await Announcement.findOne({ title, workplace })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Announcement already existed" });
  }

  const announcementObj = {
    workplace,
    title,
  };

  const announcement = Announcement.create(announcementObj);
  if (announcement) {
    return res.status(201).json({ message: "New announcement created" });
  } else {
    return res
      .status(400)
      .json({ message: "Received invalid announcement data" });
  }
};

const updateAnnouncement = async (req, res) => {
  const { id, title, workplace } = req.body;
  if (!id || !title || !workplace) {
    return res
      .status(400)
      .json({ message: "id, title, and workplace are required" });
  }

  const announcement = await Announcement.findById(id).exec();

  if (!announcement) {
    return res.status(400).json({ message: "Announcement not found" });
  }

  const duplicate = await Announcement.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate._id.toString !== id) {
    return res.status(409).json({ message: "Duplicate announcement " });
  }

  announcement.title = title;

  await announcement.save();
  res.json({ message: "Announcement successfully updated" });
};

const deleteAnnouncement = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Announcement Id is required" });
  }

  const announcement = await Announcement.findById(id).exec();

  if (!announcement) {
    return res.status(400).json({ message: "Announcement not found" });
  }

  await announcement.deleteOne();

  res.json({ message: "Announcement has been deleted" });
};

module.exports = {
  getAllAnnouncements,
  getAllAnnouncementsByWorkplaceId,
  newAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
