import "./AboutUs.css";

import filmRetro1 from "../../assets/images/about/filmretro1.png";
import filmRetro2 from "../../assets/images/about/filmretro2.png";
import filmRetro3 from "../../assets/images/about/filmretro3.png";

export default function AboutUs() {
  return (
    <main className="about">
      <article className="about-card" role="article" aria-labelledby="about-heading">
        <p className="about-eyebrow">Om oss –</p>
        <h1 id="about-heading" className="about-title">Filmvisarna i Småstad</h1>

        <section className="about-section">
          <p>
            Filmvisarna är en biograf med anor – redan på 1950-talet öppnades dörrarna till
            vår salong i hjärtat av Småstad. Under flera decennier var det här stadens självklara
            mötesplats för filmälskare i alla åldrar.
          </p>
          <p>
            År 2001 fick biografen ny regi när filmfantasterna Anna och Erik Johansson tillsammans
            med Småstads filmförening tog över verksamheten. Med kärlek till filmens historia
            bestämde de sig för att bygga vidare på traditionen – men med en tydlig profil:
            hos oss står filmer från tiden före 2000-talet i centrum.
          </p>
          <p>
            I dag driver vi vår biograf med två salonger, varsamt renoverade för att behålla den
            klassiska biokänslan men uppdaterade med modern teknik. Här kan du uppleva allt från
            svartvita mästerverk till 80- och 90-talets kultklassiker – på riktigt, på stor duk,
            tillsammans med andra.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-subtitle">För oss är bio mer än bara film</h2>
          <p className="about-lead">
            – det är en gemenskap, en tidsresa och ett sätt att hålla filmens guldålder levande i Småstad.
          </p>
        </section>

        <section className="about-gallery" aria-label="Historiska bilder">
          <figure className="about-figure">
            <img src={filmRetro1} alt="Filmvisarna öppnar – kö utanför entrén." className="about-image" />
            <figcaption className="about-caption">
              Filmvisarna öppnade sina dörrar 1951 – en ny mötesplats för filmälskare i Småstad.
            </figcaption>
          </figure>

          <figure className="about-figure">
            <img src={filmRetro3} alt="Salongen med duk och sammetsstolar redo för visning." className="about-image" />
            <figcaption className="about-caption">
              Publiken tar plats – redo för magiska filmupplevelser på den vita duken.
            </figcaption>
          </figure>

          <figure className="about-figure">
            <img src={filmRetro2} alt="Kvällsbild på biografens neonskylt, människor samlas." className="about-image" />
            <figcaption className="about-caption">
              Kön ringlade sig lång när Filmvisarna slog upp portarna för första gången.
            </figcaption>
          </figure>
        </section>
      </article>
    </main>
  );
}