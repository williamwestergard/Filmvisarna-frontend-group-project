const sendEmail = require("./sendEmail.cjs");

sendEmail({
  to: "filmvisarnaabc@gmail.com",
  subject: "Hej! Detta kommer från William!",
  text: "Scooby dooby do",
  html: "<p>Dooby dooby doo</p>",
});
