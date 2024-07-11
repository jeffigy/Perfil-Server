require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const rootRoute = require("./routes/rootRoute");
const usersRoute = require("./routes/userRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const testResultRoutes = require("./routes/testResultRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const profileRoutes = require("./routes/profileRoutes");
const corsOptions = require("./utils/corsOptions");
const morgan = require("./middleware/morgan");

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan);
app.get("/", rootRoute);
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/auth", authRoutes);
app.use("/users", usersRoute);
app.use("/workplaces", workplaceRoutes);
app.use("/announcements", announcementRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/test-results", testResultRoutes);
app.use("/patients", patientRoutes);
app.use("/profile", profileRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

module.exports = app;
