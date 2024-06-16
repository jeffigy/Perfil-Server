require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const rootRoute = require("./routes/rootRoute");
const usersRoute = require("./routes/userRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const testResultRoutes = require("./routes/testResultRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");

morgan.token("req-body", (req, _res) => {
  if (
    process.env.NODE_ENV !== "test" &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
  ) {
    return JSON.stringify(req.body);
  }
  return "";
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);
app.get("/", rootRoute);
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/auth", authRoutes);
app.use("/users", usersRoute);
app.use("/workplaces", workplaceRoutes);
app.use("/announcements", announcementRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/test-results", testResultRoutes);
app.use("/patients", patientRoutes);

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
