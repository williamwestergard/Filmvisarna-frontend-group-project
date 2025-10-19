import "./AboutUs.css";

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

      </article>
    </main>
  );
}