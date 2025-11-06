const nodemailer = require("nodemailer");
const info = require("./gmail-secret.json");

async function sendEmail({ to, subject, text, html, attachments = [] }) {
  try {
    const client = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: info.email,
        pass: info.appPassword,
      },
    });

    const mailOptions = {
      from: info.email,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const result = await client.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
    console.log("Gmail response:", result.response);
    return result;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}

module.exports = sendEmail;