import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import "./booking.css";
import AvailableDates from "../../components/AvailableDates/AvailableDates";
import TicketsAmount from "../../components/TicketsAmount/TicketsAmount";
import AuditoriumOne from "../../components/Auditorium/AuditoriumOne";
import AuditoriumTwo from "../../components/Auditorium/AuditoriumTwo";

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

  // 🍿 Paketpris passed from "Boka nu" (if user came via WeeklyMovie)
  const paketprisFromState = location.state?.paketpris;

  // 🎬 Fetch veckans film when page loads
  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  // ✅ Wrap callback to prevent re-renders / blinking
  const handleMovieLoaded = useCallback((movie: Movie) => {
    setCurrentMovie(movie);
    setMovieLoaded(true);
  }, []);

  // 🧩 Compare current movie to veckans film
  const isWeekly =
    currentMovie && weeklyMovie && currentMovie.id === weeklyMovie.id;

  // 🎁 Determine which paketpris to show
  const paketprisToShow =
    paketprisFromState ||
    currentMovie?.paketpris || // ✅ allow paketpris from backend
    (isWeekly ? weeklyMovie?.paketpris : null);

  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          {/* 🎥 Load movie and pass data up */}
          <MovieBooking onMovieLoaded={handleMovieLoaded} />

          {/* 🗓️ Booking flow components */}
          <AvailableDates />
          <TicketsAmount />
          <AuditoriumOne />
          <AuditoriumTwo />

          {/* 🍿 Paketpris section */}
          {paketprisToShow && (
            <section className="paketpris-info">
              <h3>🎬 Veckans film – Paketpris</h3>
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
            </section>
          )}
        </section>
      </section>

      {/* 💳 Price card — only shows when movie is loaded */}
      {movieLoaded && (
        <article className="booking-price-card-top">
          <BookingPriceCard paketpris={paketprisToShow} />
        </article>
      )}
    </main>
  );
}

export default BookingPage;