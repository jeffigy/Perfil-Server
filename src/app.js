require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const usersRoute = require("./routes/userRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const testResultRoutes = require("./routes/testResultRoutes");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", usersRoute);
app.use("/workplaces", workplaceRoutes);
app.use("/announcements", announcementRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/test-results", testResultRoutes);

app.get("/", (_req, res) => {
  return res.json({ message: "welcome to perfil server side" });
});

module.exports = app;
