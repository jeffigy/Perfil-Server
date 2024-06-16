require("dotenv").config();

const PORT = process.env.PORT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const CORS_WHITELIST = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(",")
  : [];

module.exports = {
  MONGODB_URI,
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  CORS_WHITELIST,
};
