const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ""),
  },
});

const sendEmail = async ({ to, subject, html }) => {
  console.log("📧 EMAIL USER:", process.env.EMAIL_USER);
  console.log("📧 EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);

  await transporter.sendMail({
    from: `"Fitness AI App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent to:", to);
};

module.exports = sendEmail;