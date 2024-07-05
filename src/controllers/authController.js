const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const config = require("../utils/config");
const User = require("../models/User");
const Patient = require("../models/Patient");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
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

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const newUser = await Patient.create({
    email,
    name,
    password: hashedPwd,
    verificationToken,
    verificationTokenExpires,
  });

  await sendVerificationEmail(newUser.email, verificationToken);

  res.status(200).json({
    message: "A verification email has been sent to " + newUser.email + ".",
  });
};

const verify = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const user = await Patient.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Verification token is invalid or has expired." });
  }

  user.verified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: user.email,
        roles: user.roles,
      },
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { email: user.email },
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

  if (!foundUser.verified) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    foundUser.verificationToken = verificationToken;
    foundUser.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await foundUser.save();

    await sendVerificationEmail(foundUser.email, verificationToken);
    return res
      .status(401)
      .json({
        message: "Email not verified. A new verification email has been sent",
      });
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
  verify,
  login,
  refresh,
  logout,
};
