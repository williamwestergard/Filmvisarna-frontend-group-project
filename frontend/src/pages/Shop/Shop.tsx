import "./Shop.css";


export default function Shop() {
  return (
    <section className="shop">
      <div className="shop-inner">
        <div className="shop-grid">
          {/* shop intro */}
          <div className="shop-intro">
            <h1 className="shop-title">Kiosk</h1>
            <div className="shop-text">
              <p>
                När du besöker Filmvisarna kan du räkna med att bioupplevelsen
                börjar redan i kiosken. Här möts du av doften av nygjorda
                popcorn, svalkande läsk i olika smaker och ett stort utbud av
                snacks och sötsaker.
              </p>
              <p>
                Vi erbjuder klassiker som choklad, chips, glass och färska
                godispåsar – perfekt att ta med sig in i salongen. Våra drycker
                serveras iskalla och med fri påfyllning, så att du kan luta dig
                tillbaka och njuta av hela filmen utan att behöva tänka på att
                det tar slut.
              </p>
              <p>
                Oavsett om du är sugen på något salt, sött eller båda delar,
                hittar du något som gör din bioupplevelse ännu bättre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}