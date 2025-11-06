const sendEmail = require("./sendEmail.cjs");


const seatsList = "A3, A4, A5";

const htmlBody = `
  <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px;">
      <h1 style="background:#c41230;color:#fff;padding:15px;text-align:center;">🎬 Filmvisarna</h1>
      <h2>Tack för din bokning!</h2>
      <p>Här är detaljerna för din bokning:</p>
      <ul>
        <li><strong>Film:</strong> Inside Out 2</li>
        <li><strong>Salong:</strong> Helan</li>
        <li><strong>Datum:</strong> ${new Date("2025-11-10T18:00:00").toLocaleDateString("sv-SE")}</li>
        <li><strong>Tid:</strong> ${new Date("2025-11-10T18:00:00").toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</li>
        <li><strong>Platser:</strong> ${seatsList}</li>
      </ul>
      <p>Vi ses på bion! 🍿</p>
      <p style="font-size:12px;color:#555;">Filmvisarna AB | Gävle, Sverige</p>
    </div>
  </div>
`;

sendEmail({
  to: "madelennilsen98@gmail.com", // write your personal email here
  subject: "Test: Filmvisarna Bokningsbekräftelse",
  text: "Test av Filmvisarnas bokningsbekräftelse",
  html: htmlBody,
}).then(() => console.log("Testemail skickat!"))
  .catch((err) => console.error("Fel vid testsändning:", err));