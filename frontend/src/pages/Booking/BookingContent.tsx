import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import AvailableDates from "../../components/AvailableDates/AvailableDates";
import TicketsAmount from "../../components/TicketsAmount/TicketsAmount";
import Auditorium from "../../components/Auditorium/Auditorium";
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

function BookingContent() {
  const navigate = useNavigate();
  const { movie, setMovie, screening, selectedSeats, totalTickets } = useBooking();
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [weeklyMovie, setWeeklyMovie] = useState<Movie | null>(null);
  const location = useLocation();

  // Paketpris passed from "Boka nu" (if user came via WeeklyMovie)
  const paketprisFromState = (location.state as any)?.paketpris;

  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  const isWeekly = movie && weeklyMovie && movie.id === weeklyMovie.id;

  const paketprisToShow =
    paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  // Ready for “Complete booking” when:
  // - a screening is selected
  // - at least one ticket is chosen (totalTickets > 0)
  // - exactly as many seats are selected as tickets
  const isReady =
    Boolean(screening?.id) &&
    totalTickets > 0 &&
    selectedSeats.length === totalTickets;

  function handleFinish() {
   // Here we later make a POST request → backend to get a bookingId
  // For now (demo): navigate to your existing confirmation page
  // Uses the static route you already have: /confirmation-page
    navigate("/confirmation-page");
   // Alternative when backend is connected:
  // navigate(`/confirmation/${bookingId}`);
  }

  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          {/* Movie selection */}
          <MovieBooking
            onMovieLoaded={(loadedMovie: Movie) => {
              setMovie(loadedMovie);
              setMovieLoaded(true);
            }}
          />

          {/* Available dates */}
          {movie && <AvailableDates movieId={movie.id} />}

          {/* Ticket counts */}
          <TicketsAmount />

          {/* Auditorium appears after date/time selection per your logic */}
          <Auditorium />

          {/* Paketpris info */}
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

          {/* Button "slutför bokning" */}
          <section className="confirm-actions">
            <button
              className="confirm-btn"
              disabled={!isReady}
              onClick={handleFinish}
              title={
                isReady
                  ? "Gå vidare till bekräftelse"
                  : "Välj visning, biljetter och platser först"
              }
            >
              Slutför bokning
            </button>

           {/* Hint text when not ready*/}
            {!isReady && ( 
              <p className="confirm-hint">
                Välj visning, antal biljetter och markera {totalTickets} plats
                {totalTickets === 1 ? "" : "er"} i salongen.
              </p>
            )}
          </section>
        </section>
      </section>

      {/* Price summary on the right/top as before */}
      {movieLoaded && (
        <article className="booking-price-card-top">
          <BookingPriceCard />
        </article>
      )}
    </main>
  );
}

export default BookingContent;
