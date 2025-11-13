import "./CookiePolicy.css";

export default function CookiePolicy() {
  return (
    <main className="cookiepolicy">
      <article className="cookiepolicy-card" aria-labelledby="cookiepolicy-heading">
        <p className="cookiepolicy-eyebrow">Information</p>

        <h1 id="cookiepolicy-heading" className="cookiepolicy-title">
          Cookiepolicy för Filmvisarna
        </h1>

        <section className="cookiepolicy-section">
          <p>
            På Filmvisarna använder vi främst tekniska, nödvändiga cookies för att webbplatsen
            ska fungera på ett säkert och stabilt sätt. Dessa cookies behövs exempelvis för
            inloggning, säkerhet och grundläggande funktioner.
          </p>
          <p>
            Du kan även välja om du vill tillåta statistikcookies. Statistiska cookies används
            för analys och är alltid frivilliga. Om du inte ger samtycke aktiveras inga
            statistikcookies.
          </p>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Nödvändiga cookies</h2>
          <p>Dessa cookies krävs för att webbplatsen ska fungera.</p>

          <ul className="cookiepolicy-list">
            <li>
              <strong>session_id</strong> – håller dig inloggad under ditt besök.
            </li>
            <li>
              <strong>csrf_token</strong> – skyddar formulär och inloggning.
            </li>
            <li>
              <strong>preferenser</strong> – kan spara exempelvis språkval.
            </li>
          </ul>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Statistikcookies </h2>
          <p>
            Statistikcookies används endast om du ger samtycke i vår cookie-banner. Om du inte
            accepterar statistikcookies sätts inga sådana cookies.
          </p>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Dina val</h2>
          <p>
            I cookie-bannern kan du välja om du vill tillåta statistikcookies eller inte. Det
            är alltid lika enkelt att avvisa som att acceptera.
          </p>
          <p>
            Du kan när som helst ändra ditt val genom att rensa cookies i din webbläsare.
          </p>
        </section>
      </article>
    </main>
  );
}