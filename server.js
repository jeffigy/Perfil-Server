const app = require('./src/app')
const config = require('./src/utils/config')
const mongoose = require('mongoose')
const connectDB = require('./src/utils/connectDB')

connectDB()
mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(config.PORT, () => {
    console.log(`app is running @ port ${config.PORT}`);
  });
})

mongoose.connection.on("error", (error) => {
  console.log(error);
})

