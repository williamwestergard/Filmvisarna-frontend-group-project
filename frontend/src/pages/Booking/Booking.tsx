import { useState } from "react";
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import "./booking.css";
import AvailableDates from "../../components/AvailableDates/AvailableDates";
import TicketsAmount from "../../components/TicketsAmount/TicketsAmount";
import AuditoriumOne from "../../components/Auditorium/AuditoriumOne";
import AuditoriumTwo from "../../components/Auditorium/AuditoriumTwo";

function BookingPage() {
  const [movieLoaded, setMovieLoaded] = useState(false);

  return (
   <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
    <section className="booking-page-left-side">
      <section className="booking-page-left-side-content">
  <MovieBooking onMovieLoaded={() => setMovieLoaded(true)} />
    <AvailableDates/>
<TicketsAmount/>
<AuditoriumOne/>
<AuditoriumTwo/>
</section>
</section>
  {movieLoaded && (
    <article className="booking-price-card-top">
      <BookingPriceCard />
    </article>
  )}

</main>
  );
}

export default BookingPage;
