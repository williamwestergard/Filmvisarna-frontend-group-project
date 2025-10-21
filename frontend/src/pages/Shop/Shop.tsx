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
          Hos oss poppas popcornen alltid färska, precis som förr. Doften sprider sig genom salongen och sätter stämningen redan innan filmen börjat. Välj mellan liten, mellan eller stor – alltid med perfekt sälta och rätt mängd smörsmak.
          Vi använder traditionella popcornmaskiner som ger den där äkta biokänslan, och för den som vill lyxa till det lite extra finns smaksatta alternativ och nyrostade nötter vid sidan av. På Filmvisarna är popcorn mer än bara ett snacks – det är en del av upplevelsen.
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
          Oavsett om du föredrar iskall läsk, bubbelvatten eller något sött och fruktigt, hittar du alltid något som passar till filmen. Vi erbjuder ett brett sortiment av både klassiska favoriter och nya smaker som byts ut efter säsong.
          Alla drycker serveras väl kylda, och vid våra specialvisningar kan du även beställa varm choklad, kaffe eller alkoholfritt bubbel. För oss handlar det inte bara om att släcka törsten – utan om att skapa den perfekta biostunden, där varje detalj känns genomtänkt.
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
          Vid utvalda visningar bjuder vi på något alldeles extra – en full Bar & Bistro-upplevelse mitt i biosalongen. Här kan du beställa mat, snacks och dryck som serveras direkt till din plats, utan att missa en enda scen.
Menyn varierar beroende på filmtema och årstid – ibland klassiskt med pizza och sliders, ibland mer exklusivt med plocktallrikar och lokala specialiteter.
Oavsett vad du väljer är målet detsamma: att du ska kunna luta dig tillbaka, njuta av filmen och känna dig som hemma i Filmvisarnas varma, nostalgiska miljö.
          </p>
        </div>

        <figure className="shop-image-wrap">
          <img src={imgBar} alt="Bar & Bistro med mat och dryck" className="shop-image" />
        </figure>
      </section>
    </section>
  );
}