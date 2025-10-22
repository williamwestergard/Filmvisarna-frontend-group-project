
import "./availableDates.css"
import ArrowLeft from "../../assets/images/auditorium/arrow-triangle-left.png"
import ArrowRight from "../../assets/images/auditorium/arrow-triangle-right.png"


function AvailableDates() {

  return (
    <>
    <section className="available-dates">
    <h2>Tillgängliga tider</h2>

    <section className="available-dates-content">
        <section className="choose-day-and-month">
        <article className="day-and-month-container">
        <h3> Välj dag</h3>
        {/* Current Month */}
        <p className="current-month">Oktober</p>
        </article>

{/* Choose week */}
<article className="choose-week">
  <img className="choose-week-arrow-left" src={ArrowLeft}/>
<span className="current-week">v.23</span>

<img className="choose-week-arrow-right" src={ArrowRight}/>
  </article>
</section>

{/* Date cards */}
<section className="dates-container">
<article className="date-card"><p className="date-card-date">15</p><p className="date-card-day">Sön</p> </article>
<article className="date-card"><p className="date-card-date">16</p><p className="date-card-day">Mån</p> </article>
<article className="date-card"><p className="date-card-date">17</p><p className="date-card-day">Tis</p> </article>
<article className="date-card"><p className="date-card-date">18</p><p className="date-card-day">Ons</p> </article>
<article className="date-card"><p className="date-card-date">19</p><p className="date-card-day">Tors</p> </article>
<article className="date-card"><p className="date-card-date">20</p><p className="date-card-day">Fre</p> </article>
<article className="date-card"><p className="date-card-date">21</p><p className="date-card-day">Lör</p> </article>
</section>

{/* Time cards */}
<section className="choose-day-content">
<article className="choose-day-container">
    <p className="choose-day-text">Tisdag </p> <p  className="choose-day-time">Kl 14.30</p> 
</article>
<article className="choose-day-container">
    <p className="choose-day-text">Tisdag </p> <p  className="choose-day-time">Kl 18.15</p> 
</article>
<article className="choose-day-container">
    <p className="choose-day-text">Tisdag </p> <p  className="choose-day-time">Kl 20.30</p> 
</article>
</section>



</section>
</section>
</>
  )
}

export default  AvailableDates