import { useState, useEffect } from "react";
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
  paketpris?: Paketpris; // optional, because not all movies have this
};

function BookingPage() {
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [weeklyMovie, setWeeklyMovie] = useState(null);
  const location = useLocation();

  // Paketpris passed from "Boka nu" (if the user came via WeeklyMovie)
  const paketprisFromState = location.state?.paketpris;

  // Fetch veckans film when page loads
  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  // Compare current movie to veckans film
  const isWeekly =
    currentMovie && weeklyMovie && currentMovie.id === weeklyMovie.id;

  // Determine which paketpris to show
  const paketprisToShow =
    paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          {/* Send movie info up from MovieBooking */}
          <MovieBooking
            onMovieLoaded={(movie) => {
              setCurrentMovie(movie);
              setMovieLoaded(true);
            }}
          />

          <AvailableDates />
          <TicketsAmount />
          <AuditoriumOne />
          <AuditoriumTwo />

          {/* Show paketpris if it's veckans film */}
          {paketprisToShow && (
            <section className="paketpris-info">
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
            </section>
          )}
        </section>
      </section>

      {/*Price card shows after movie is loaded */}
      {movieLoaded && (
        <article className="booking-price-card-top">
          <BookingPriceCard />
        </article>
      )}
    </main>
  );
}

export default BookingPage;
