const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "142.250.102.108",
  port: 587,
  secure: false,

  name: "smtp.gmail.com",
  requireTLS: true,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ""),
  },

  tls: {
    servername: "smtp.gmail.com",
  },
});

const sendEmail = async ({ to, subject, html }) => {
  console.log("📧 START SEND EMAIL TO:", to);

  await transporter.sendMail({
    from: `"Fitness AI App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent to:", to);
};

module.exports = sendEmail;