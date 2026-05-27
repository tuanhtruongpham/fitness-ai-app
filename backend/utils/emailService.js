const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 START SEND EMAIL TO:", to);

    await transporter.sendMail({
      from: `"Fitness AI App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ SEND EMAIL FAILED:", error.message);
  }
};

module.exports = sendEmail;