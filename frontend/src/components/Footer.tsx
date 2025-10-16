import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-brand">
        <img src="/images/logo.png" alt="Filmvisarna logotyp" />
        <h2 className="footer-title">FILMVISARNA</h2>
      </section>

      <address className="footer-contact">
        <p>FILMVISARNA AB</p>
        <p>Småstadsgatan 12, Småstad</p>
        <p>Tel: <a href="tel:0761231232">076 123 123 2</a></p>
      </address>
    </footer>
  );
}
