import "./auditorium.css"
import AuditoriumScreen from "../../assets/images/auditorium/auditorium-screen.png"

function Auditorium() {

  return (
    <>
    <section className="auditorium-content">
           <p className="auditorium-text">Salong - Halvan</p>
      <h2>Välj platser</h2>
      <section className="auditorium-container">
       
<article className="auditorium">
      <img  className="auditorium-screen" src={AuditoriumScreen} alt="Bild på en bioduk" />
<section className="auditorium-seats-container">

<section className="auditorium-two-seats-first-row">
  <div className="seat-placeholder"></div>
  <article className="auditorium-seat"></article>
  <article className="auditorium-seat"></article>
  <article className="auditorium-seat"></article>
  <article className="auditorium-seat"></article>
  <div className="seat-placeholder"></div>
</section>
<section className="auditorium-two-seats-second-row">
  <div className="seat-placeholder"></div>
  <article className="auditorium-seat"></article>
  <article className="auditorium-seat"></article>
  <article className="auditorium-seat"></article>
  <article className="auditorium-seat"></article>
  <div className="seat-placeholder"></div>
</section>
<section className="auditorium-two-seats-third-row">
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
</section>
<section className="auditorium-two-seats-fourth-row">
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
        <article className="auditorium-seat"></article>
</section>



</section>

</article>

      </section>
      <article className="auditorium-information-bottom">
          <article className="auditorium-information-bottom-user-seat-container">
        <article className="auditorium-information-bottom-user-seat"></article>
        <p>Ditt val</p>
        </article>
          <article className="auditorium-information-bottom-occupied-seatcontainer">
           <article className="auditorium-information-bottom-occupied-seat"></article>
        <p>Upptagen</p>
      </article>
      </article>
</section>
  
    </>
  )
}

export default  Auditorium