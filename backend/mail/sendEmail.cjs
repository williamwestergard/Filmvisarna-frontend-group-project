const nodemailer = require("nodemailer");
const info = require("./gmail-secret.json");

function sendEmail({ to, subject, text, html, attachments = [] }) {
  const client = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: info.email,
      pass: info.appPassword,
    },
  });

  client.sendMail({
    from: info.email,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

module.exports = sendEmail;
