const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 START SEND EMAIL TO:", to);

    const result = await resend.emails.send({
      from: `Fitness AI App <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", result);
  } catch (error) {
    console.error("❌ SEND EMAIL FAILED:", error.message);
  }
};

module.exports = sendEmail;