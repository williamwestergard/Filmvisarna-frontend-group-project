import { useState } from "react";
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import "./booking.css";

function BookingPage() {
  const [movieLoaded, setMovieLoaded] = useState(false);

  return (
   <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
  <MovieBooking onMovieLoaded={() => setMovieLoaded(true)} />
  {movieLoaded && (
    <article className="booking-price-card-top">
      <BookingPriceCard />
    </article>
  )}
</main>
  );
}

export default BookingPage;
