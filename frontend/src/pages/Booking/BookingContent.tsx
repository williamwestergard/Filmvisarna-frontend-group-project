import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../../Context/BookingContext";
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import AvailableDates from "../../components/AvailableDates/AvailableDates";
import TicketsAmount from "../../components/TicketsAmount/TicketsAmount";
import Auditorium from "../../components/Auditorium/Auditorium";
import "./booking.css";
import SimpleBookingTimeoutModal from "../../components/BookingTimeout/SimpleBookingTimeoutModal";
import ScrollDownArrow from "../../assets/images/booking/scroll-down-arrow.png";

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
  const {
    movie,
    setMovie,
    screening,
    totalTickets,
    selectedSeats,
    counts,
    totalAmount,
  } = useBooking();

  const [movieLoaded, setMovieLoaded] = useState(false);
  const [weeklyMovie, setWeeklyMovie] = useState<Movie | null>(null);
  const [loadingProceed, setLoadingProceed] = useState(false);

  // Controls timeout modal after 10 minutes on the booking page
  const [timeoutOpen, setTimeoutOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [showScrollInfo, setShowScrollInfo] = useState(true);

  // Optional package pricing, passed from previous page or from weekly movie data
  const paketprisFromState = (location.state as any)?.paketpris;

  // Fetch weekly movie data (used for package pricing logic)
  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  // Starts a 10-minute session timeout for the booking flow
  useEffect(() => {
    const id = window.setTimeout(() => setTimeoutOpen(true), 10 * 60 * 1000);
    return () => window.clearTimeout(id);
  }, []);

  const isWeekly = movie && weeklyMovie && movie.id === weeklyMovie.id;
  const paketprisToShow =
    paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  // Guest email handling (only required if user is not logged in)
  const [guestEmail, setGuestEmail] = useState("");
  const [guestEmailError, setGuestEmailError] = useState("");

  const storedUser = localStorage.getItem("authUser");
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = authUser?.id || null;

  // Determines if the user can proceed to confirmation
  const canProceed =
    !!movie &&
    !!screening &&
    totalTickets > 0 &&
    selectedSeats.length === totalTickets &&
    (userId || guestEmail);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Stores draft data and navigates to the confirmation step
  async function handleProceedToConfirmation() {
    if (!canProceed || !screening) return;

    if (!userId) {
      if (!guestEmail) {
        setGuestEmailError("Vänligen ange din e-postadress för att boka.");
        return;
      }
      if (!isValidEmail(guestEmail)) {
        setGuestEmailError("Vänligen ange en giltig e-postadress.");
        return;
      }
    }

    setGuestEmailError("");
    setLoadingProceed(true);

    try {
      const draft = {
        movie: movie
          ? { id: movie.id, title: movie.title }
          : null,
        screening: screening
          ? {
              id: screening.id,
              movieId: screening.movieId,
              auditoriumId: screening.auditoriumId,
              time: screening.time,
            }
          : null,
        counts,
        totalTickets,
        totalAmount,
        selectedSeats,
        email: userId ? authUser.email : guestEmail,
        userId: userId || null,
        paketprisToShow,
      };

      // Saved so Confirmation page can retrieve it
      localStorage.setItem("filmvisarna-draft", JSON.stringify(draft));

      navigate("/confirmation");
    } finally {
      setLoadingProceed(false);
    }
  }

  // Ensures layout updates based on header visibility and screen size
  useEffect(() => {
    const navbar = document.querySelector(".site-header") as HTMLElement;
    const root = document.documentElement;

    function updateOffset() {
      if (!navbar) return;
      const navbarVisible = !navbar.classList.contains("hidden");
      root.style.setProperty(
        "--navbar-offset",
        navbarVisible ? `${navbar.offsetHeight}px` : "1vh"
      );
    }

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  // Controls "scroll down" hint visibility
  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      setShowScrollInfo(scrollY < 100);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          {/* Loads movie and sets the active movie in context */}
          <MovieBooking
            onMovieLoaded={(loadedMovie) => {
              setMovie(loadedMovie as any);
              setMovieLoaded(true);
            }}
          />

          {movie && <AvailableDates movieId={movie.id} />}
          <TicketsAmount />
          <Auditorium />

          {paketprisToShow && (
            <section className="paketpris">
              <strong>Veckans film:</strong>
              <p>
                {paketprisToShow.liten.antal} liten popcorn – {paketprisToShow.liten.pris} kr
              </p>
              <p>
                {paketprisToShow.litenEn.antal} liten popcorn – {paketprisToShow.litenEn.pris} kr
              </p>
              <p className="paketpris-note">(Gäller endast vid betalning i kassan)</p>
            </section>
          )}

          {!userId && (
            <div className="booking-guest-email-container">
              <label htmlFor="guestEmail">E-postadress (obligatoriskt för bokning)</label>
              <input
                className="booking-guest-email-field"
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                placeholder="exempel@email.com"
                style={{ borderColor: guestEmailError ? "rgb(247, 64, 85)" : "#99999960" }}
              />
              {guestEmailError && (
                <p className="booking-guest-email-field-error">{guestEmailError}</p>
              )}
            </div>
          )}

          <section className="confirm-actions">
            <button
              className={`confirm-btn ${canProceed ? "active" : "disabled"}`}
              disabled={!canProceed || loadingProceed}
              onClick={handleProceedToConfirmation}
              style={{
                cursor: canProceed && !loadingProceed ? "pointer" : "not-allowed",
                pointerEvents: canProceed && !loadingProceed ? "auto" : "none",
                backgroundColor: canProceed && !loadingProceed ? "#c41230" : "#716d7a",
                color: canProceed && !loadingProceed ? "#fff" : "#dbdbdb",
                opacity: canProceed ? 1 : 0.9,
              }}
            >
              {canProceed && !loadingProceed ? (
                <>
                  <span className="confirm-total">
                    Totalsumma: {new Intl.NumberFormat("sv-SE").format(totalAmount)} kr
                  </span>
                  <span className="confirm-next">Gå vidare</span>
                </>
              ) : loadingProceed ? (
                <span>Förbereder...</span>
              ) : (
                <span>Gå vidare</span>
              )}
            </button>

            {!canProceed && (
              <p className="confirm-btn-nonclickable-text">
                Välj dag, antal biljetter och platser för att fortsätta.
              </p>
            )}
          </section>
        </section>
      </section>

      {movieLoaded && (
        <article className="booking-price-card-top">
          <BookingPriceCard />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleProceedToConfirmation}
              disabled={!canProceed || loadingProceed}
              style={{
                padding: "0.8rem 1.2rem",
                fontWeight: 600,
                fontSize: "15px",
                borderRadius: 5,
                border: "none",
                width: "100%",
                cursor: canProceed && !loadingProceed ? "pointer" : "not-allowed",
                pointerEvents: canProceed && !loadingProceed ? "auto" : "none",
                backgroundColor: canProceed && !loadingProceed ? "#c41230" : "#716d7a",
                color: canProceed && !loadingProceed ? "#fff" : "#dbdbdb",
                opacity: canProceed ? 1 : 0.9,
                display: canProceed ? "block" : "none",
              }}
            >
              {loadingProceed ? "Förbereder..." : "Gå vidare"}
            </button>
          </div>
        </article>
      )}

      {timeoutOpen && (
        <SimpleBookingTimeoutModal
          open={timeoutOpen}
          onReload={() => window.location.reload()}
        />
      )}

      <section
        className={`booking-scroll-down-info ${showScrollInfo ? "visible" : "hidden"}`}
      >
        <p>Skrolla ner för att boka film.</p>
        <img src={ScrollDownArrow} alt="Pil som pekar nedåt" />
      </section>
    </main>
  );
}

export default BookingContent;
