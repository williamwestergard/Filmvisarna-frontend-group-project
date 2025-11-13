import { useEffect, useState } from "react";
import "./CookieBanner.css";
// component to show cookie consent banner
const COOKIE_CONSENT_KEY = "cookieConsent";
// types of consent values that can be stored
type ConsentValue = "necessary" | "all";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
    // check local storage for existing consent on component mount
  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setVisible(true); // show banner if no consent found
    }
  }, []);
  // handle user choice and store in local storage
  function handleChoice(value: ConsentValue) { 
    localStorage.setItem(COOKIE_CONSENT_KEY, value); 
    setVisible(false);
  }

  if (!visible) return null; // do not render if not visible

  return (
    <section
      className="cookiebanner"
      role="dialog"
      aria-modal="false"
      aria-label="Information om cookies"
    >
      <div className="cookiebanner-inner">
        <div className="cookiebanner-text">
          <h2 className="cookiebanner-title">Vi använder cookies</h2>
          <p className="cookiebanner-body">
            Vi använder nödvändiga tekniska cookies för att sidan och inloggning ska fungera. Du kan välja att endast tillåta
            nödvändiga cookies.
          </p>
          <p className="cookiebanner-linktext">
            Läs mer i vår{" "}
            <a href="/cookies" className="cookiebanner-link">
              cookiepolicy
            </a>
            .
          </p>
        </div>

        <div className="cookiebanner-actions">
          <button
            type="button"
            className="cookiebanner-btn secondary"
            onClick={() => handleChoice("necessary")}
          >
            Endast nödvändiga
          </button>
          <button
            type="button"
            className="cookiebanner-btn primary"
            onClick={() => handleChoice("all")}
          >
            Acceptera alla
          </button>
        </div>
      </div>
    </section>
  );
}