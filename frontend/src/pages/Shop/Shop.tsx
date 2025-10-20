import "./Shop.css";
import shopImg from "../../assets/images/shop/shop.jpeg";

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
           {/* menu popcorn */}
           <aside className="shop-popcorn">
            <h2 className="shop-subtitle">Popcorn</h2>
            <ul className="price-list">
              <li className="price-item">
                <span className="price-name">Liten</span>
                <span className="price-amount">60 kr</span>
              </li>
              <li className="price-item">
                <span className="price-name">Mellan</span>
                <span className="price-amount">70 kr</span>
              </li>
              <li className="price-item">
                <span className="price-name">Stor</span>
                <span className="price-amount">80 kr</span>
              </li>
            </ul>
          </aside>
           {/* menu */}
           <div className="shop-other">
            <h3 className="shop-section">Övrigt</h3>
            <ul className="simple-list">
              <li className="simple-row">
                <span className="simple-name">Choklad</span>
                <span className="simple-price">40 kr</span>
              </li>
              <li className="simple-row">
                <span className="simple-name">Chips</span>
                <span className="simple-price">40 kr</span>
              </li>
              <li className="simple-row">
                <span className="simple-name">Godispåse</span>
                <span className="simple-price">40 kr</span>
              </li>
              <li className="simple-row">
                <span className="simple-name">Dricka</span>
                <span className="simple-price">40 kr</span>
              </li>
            </ul>
          </div>
             {/* picture */}
             <figure className="shop-photo">
            <img
              src={shopImg}
              alt="Kiosken på Filmvisarna."
            />
          </figure>
        </div>
      </div>
    </section>
  );
}