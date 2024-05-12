require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express()
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "welcome to perfil server side" });
});

module.exports = app;

