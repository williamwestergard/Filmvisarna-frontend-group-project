import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <article className="footer-overlay"></article>
      <section className="footer-brand">
        <img  className="footer-logo-image" src="/public/filmvisarna-footer-logo.png" alt="filmvisarna footer bild" />
        
      </section>

     <address className="footer-contact">
  <h3 className="footer-title">FILMVISARNA AB</h3>
  <p>Småstadsgatan 12</p>
  <p>Småstad</p>
  <p>Tel: 076 123 312 3</p>
</address>

    </footer>
  );
}
