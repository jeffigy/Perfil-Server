const config = require("../utils/config");
const nodemailer = require("nodemailer");
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.FRONTEND_URL}/verify/${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.MAILER_USER,
      pass: config.MAILER_PASSWORD,
    },
  });

  const mialOptions = {
    to: email,
    from: `"Perfil" <${config.MAILER_USER}>`,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  await transporter.sendMail(mialOptions);
};

module.exports = sendVerificationEmail;
