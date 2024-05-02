require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`app is running @ port ${port}`);
});

app.get("/", (req, res) => {
  return res.json({ message: "welcome to perfil server side" });
});
