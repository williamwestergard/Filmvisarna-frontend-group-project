import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <article className="footer-overlay"></article>
      <section className="footer-brand">
        <img  className="footer-logo-image" src="/filmvisarna-footer-logo.png" alt="filmvisarna footer bild" />
        
      </section>

     <address className="footer-contact">
  <h3 className="footer-title">FILMVISARNA</h3>
  <a href="/om-oss">Om oss</a>
  <a href="/shop">Vår kiosk</a>
  <a href="/upptack">Veckans film</a>
  <Link to="/cookies">Cookiepolicy</Link>
</address>

    </footer>
  );
}
