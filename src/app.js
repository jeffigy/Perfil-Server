require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const usersRoute = require("./routes/userRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", usersRoute);
app.use("/workplaces", workplaceRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "welcome to perfil server side" });
});

module.exports = app;