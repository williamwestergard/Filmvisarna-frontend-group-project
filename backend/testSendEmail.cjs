const sendEmail = require("./sendEmail.cjs");

sendEmail({
  to: "filmvisarnaabc@gmail.com",
  subject: "Hej! Detta är ett test av NodeMailer...",
  text: "Detta är ett test.",
  html: "<p>Detta är ett test.</p>",
});
