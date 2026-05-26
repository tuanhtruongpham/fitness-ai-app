require("dotenv").config();

const sendEmail = require("./utils/emailService");

async function test() {
  await sendEmail({
    to: "gmail_m_muon_nhan@gmail.com",
    subject: "Fitness AI App Test",
    html: "<h1>Email system works ✅</h1>",
  });

  console.log("TEST DONE");
}

test();