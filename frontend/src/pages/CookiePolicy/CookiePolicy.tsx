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
            Filmvisarna använder ingen extern spårning och vi sätter inga cookies för
            marknadsföring eller statistik. För att webbplatsen ska fungera använder vi istället
            webbläsarens localStorage för att spara grundläggande information.
          </p>
          <p>
            Denna lagring är tekniskt nödvändig, till exempel för att du ska kunna vara inloggad
            och för att vi ska komma ihåg om du har gjort ett val i vår cookie-banner.
          </p>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Nödvändig lagring</h2>
          <p>
            Vi sparar endast sådan information som behövs för att webbplatsen ska fungera på ett
            säkert och stabilt sätt. Följande värden kan sparas i din webbläsare:
          </p>

          <ul className="cookiepolicy-list">
            <li>
              <strong>authUser</strong> – håller reda på att du är inloggad.
            </li>
            <li>
              <strong>authToken</strong> –
              används för att validera din session under besöket.
            </li>
            <li>
              <strong>cookieConsent</strong> – sparar ditt val i cookiebannern
              (t.ex. ”acceptera” eller ”endast nödvändiga”).
            </li>
          </ul>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Statistik och tredjepart</h2>
          <p>
            Filmvisarna använder inga statistikverktyg, inga analyscookies och ingen
            marknadsföringsspårning. Ingen information delas med tredje part.
          </p>
        </section>

        <section className="cookiepolicy-section">
          <h2 className="cookiepolicy-subtitle">Dina val</h2>
          <p>
            I cookie-bannern kan du välja om du vill tillåta frivillig lagring eller endast
            nödvändig lagring. Du kan när som helst ändra ditt val genom att rensa
            localStorage i din webbläsare.
          </p>
        </section>
      </article>
    </main>
  );
}