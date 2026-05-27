const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ""),
  },
});

const sendEmail = async ({ to, subject, html }) => {
  console.log("📧 START SEND EMAIL TO:", to);
  console.log("📧 EMAIL USER:", process.env.EMAIL_USER);
  console.log("📧 HAS EMAIL PASS:", !!process.env.EMAIL_PASS);

  await transporter.sendMail({
    from: `"Fitness AI App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent to:", to);
};

module.exports = sendEmail;