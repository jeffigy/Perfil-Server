const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const Patient = require("../models/Patient");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicatePatient = await Patient.findOne({ email })
    .collation({
      locale: "en",
      strength: 2,
    })
    .lean()
    .exec();

  const duplicateUser = await User.findOne({ email })
    .collation({
      locale: "en",
      strength: 2,
    })
    .lean()
    .exec();

  if (duplicateUser || duplicatePatient) {
    return res
      .status(409)
      .json({ message: "An account with similar email already exists" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObj = {
    email,
    name,
    password: hashedPwd,
  };

  const createdUser = await Patient.create(userObj);

  if (!createdUser) {
    res.status(400).json({ message: "Received invalid data" });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: createdUser.email,
        roles: createdUser.roles,
      },
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { email: createdUser.email },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  let foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    foundUser = await Patient.findOne({ email }).exec();
  }

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "Incorrect email or password. Please try again." });
  }

  if (foundUser && !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const pwdMatch = await bcrypt.compare(password, foundUser.password);

  if (!pwdMatch) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        roles: foundUser.roles,
      },
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { email: foundUser.email },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    config.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: "Fobidden" });
      }

      let foundUser = await User.findOne({ email: decoded.email }).exec();

      if (!foundUser) {
        foundUser = await Patient.findOne({ email: decoded.email }).exec();
      }

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
