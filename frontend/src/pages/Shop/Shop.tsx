// frontend/src/pages/Shop/Shop.tsx
import "./Shop.css";

import imgPopcorn from "../../assets/images/shop/popcorn.jpg";
import imgDrink from "../../assets/images/shop/drink.jpg";
import imgBar from "../../assets/images/shop/bar-bistro.jpg";

export default function Shop() {
  return (
    <section className="shop">
      <header className="shop-header">
        <h1 className="shop-title">Kiosk</h1>
        <p className="shop-intro">
          När du besöker Filmvisarna kan du räkna med att bioupplevelsen börjar redan i kiosken.
          Här möts du av doften av nygjorda popcorn, svalkande drycker och ett utbud av snacks och godsaker.
        </p>
      </header>
    {/* section 1*/}
    <section className="shop-section">
        <div className="shop-text">
          <h2 className="shop-subtitle">Popcorn – bioklassikern</h2>
          <p>
            Hos oss poppas popcornen alltid färska! Välj mellan liten, mellan eller
            stor – serverade med perfekt sälta och den där oemotståndliga doften
            som hör biobesöket till.
          </p>
        </div>
        <figure className="shop-image-wrap">
          <img src={imgPopcorn} alt="Popcorn i bägare" className="shop-image" />
        </figure>
      </section>
    {/* section 2 */}
    <section className="shop-section">

        <div className="shop-text">
          <h2 className="shop-subtitle">Dryck – något för alla smaker</h2>
          <p>
            Oavsett om du föredrar iskall läsk, bubbelvatten eller något sött och
            fruktigt har vi drycker som passar till varje filmupplevelse. Självklart
            serverar vi våra drycker kylda för bästa smak.
          </p>
        </div>
        <figure className="shop-image-wrap">
          <img src={imgDrink} alt="Kalla drycker i flaskor" className="shop-image" />
        </figure>
      </section>

      {/* section 3 */}
      <section className="shop-section">
        <div className="shop-text">
          <h2 className="shop-subtitle">Bar &amp; Bistro – servering i salongen</h2>
          <p>
            På utvalda biovisningar erbjuder vi en full Bar &amp; Bistro-upplevelse
            med mat, snacks och dryck som serveras direkt till din plats. Här kan du beställa, 
            luta dig tillbaka och njuta av filmen i lugn och ro.
          </p>
        </div>

        <figure className="shop-image-wrap">
          <img src={imgBar} alt="Bar & Bistro med mat och dryck" className="shop-image" />
        </figure>
      </section>
    </section>
  );
}