import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import popcornAnimation from "../../assets/images/animations/Popcorn.json";

import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import AvailableDates from "../../components/AvailableDates/AvailableDates";
import TicketsAmount from "../../components/TicketsAmount/TicketsAmount";
import AuditoriumOne from "../../components/Auditorium/AuditoriumOne";
import AuditoriumTwo from "../../components/Auditorium/AuditoriumTwo";

import "./booking.css";

type Paketpris = {
  liten: { antal: number; pris: number };
  litenEn: { antal: number; pris: number };
};

type Movie = {
  id: number;
  title: string;
  paketpris?: Paketpris;
};

function BookingPage() {
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [weeklyMovie, setWeeklyMovie] = useState<Movie | null>(null);
  const location = useLocation();

  const paketprisFromState = location.state?.paketpris;

  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  const isWeekly =
    currentMovie && weeklyMovie && currentMovie.id === weeklyMovie.id;

  const paketprisToShow =
    paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  const handleMovieLoaded = useCallback((movie: Movie) => {
    setCurrentMovie(movie);
    setMovieLoaded(true);
  }, []);

  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          <MovieBooking onMovieLoaded={handleMovieLoaded} />

          <AvailableDates />
          <TicketsAmount />
          <AuditoriumOne />
          <AuditoriumTwo />
      {paketprisToShow && (
  <section className="paketpris-info">
    <div className="paketpris-content">
      <div className="paketpris-text">
        <h3>Veckans film – Paketpris</h3>
        <p>
          {paketprisToShow.liten.antal} liten popcorn för{" "}
          {paketprisToShow.liten.pris} kr
        </p>
        <p>
          {paketprisToShow.litenEn.antal} liten popcorn för{" "}
          {paketprisToShow.litenEn.pris} kr
        </p>
        <p className="paketpris-note">
          (Erbjudandet gäller vid betalning i kassan)
        </p>
      </div>

      {/* popcorn animation floating on the right side */}
      <div className="popcorn-animation-container right-side">
        <Lottie
          animationData={popcornAnimation}
          loop={true}
          autoplay={true}
          style={{ width: 110, height: 110 }}
        />
      </div>
    </div>
  </section>
)}
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