const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  console.log("📧 START SEND EMAIL TO:", to);

  const result = await resend.emails.send({
    from: `Fitness AI App <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent:", result);
};

module.exports = sendEmail;