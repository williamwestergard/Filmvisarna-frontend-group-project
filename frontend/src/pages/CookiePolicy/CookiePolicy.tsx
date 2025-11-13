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
            På Filmvisarna använder vi främst tekniska cookies för att sidan ska fungera,
            till exempel för inloggning och säkerhet.
          </p>
          <p>
            Framöver vill vi även kunna använda statistikcookies för att förstå hur
            vår webbplats används. Statistiken kan i nästa steg användas som underlag
            för marknadsföring. Du ska alltid kunna välja bort dessa.
          </p>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Tekniska cookies (nödvändiga)</h2>
          <p>
            Dessa cookies behövs för att webbplatsen ska fungera och kan inte stängas av
            i våra system.
          </p>
          <ul className="cookiepolicy-list">
            <li>
              <strong>session_id</strong> – håller dig inloggad under ditt besök.
            </li>
            <li>
              <strong>csrf_token</strong> – hjälper oss att skydda formulär och inloggning.
            </li>
            <li>
              <strong>preferenser</strong> – kan spara grundläggande inställningar, t.ex. språk.
            </li>
          </ul>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Statistikcookies (frivilliga)</h2>
          <p>
            Just nu använder vi inte några statistik- eller marknadsföringscookies.
            När vi börjar göra det kommer vi:
          </p>
          <ul className="cookiepolicy-list">
            <li>fråga om ditt samtycke innan de aktiveras,</li>
            <li>låta dig välja endast nödvändiga cookies,</li>
            <li>visa tydlig information om vad statistiken används till.</li>
          </ul>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Dina val</h2>
          <p>
            Du kan alltid välja att endast använda nödvändiga cookies. I vår cookie-banner
            kan du välja mellan att acceptera alla cookies eller endast tekniskt nödvändiga.
          </p>
          <p>
            Om du har frågor om vår hantering av cookies kan du kontakta oss via
            uppgifterna på sidan <em>Om oss</em>.
          </p>
        </section>
      </article>
    </main>
  );
}