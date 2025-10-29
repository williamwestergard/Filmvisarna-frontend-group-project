import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../../Context/BookingContext";
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

type ApiSeat = {
  seatId: number;
  auditoriumId: number;
  rowLabel: string;
  seatNumber: number;
  isBooked?: number;
};


function BookingContent() {
  const { movie, setMovie, screening, totalTickets, selectedSeats, counts } = useBooking();

  const [movieLoaded, setMovieLoaded] = useState(false);
  const [weeklyMovie, setWeeklyMovie] = useState<Movie | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const location = useLocation();
  const selectedDateFromHome = (location.state as any)?.selectedDate || "";
  const navigate = useNavigate();

  // Paketpris passed from "Boka nu" (if user came via WeeklyMovie)
 const paketprisFromState = (location.state as any)?.paketpris;

  // Load weekly movie for package info
  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  const isWeekly = movie && weeklyMovie && movie.id === weeklyMovie.id;
  const paketprisToShow = paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  const canProceed =
    !!movie &&
    !!screening &&
    totalTickets > 0 &&
    selectedSeats.length === totalTickets;

  // Assign ticket types (Adult / Senior / Child)
  function assignTicketTypesToSeats(realSeatIds: number[]) {
    const list: { seatId: number; ticketTypeId: number }[] = [];
    let leftAdult = counts.adult || 0;
    let leftSenior = counts.senior || 0;
    let leftChild = counts.child || 0;

    for (const sId of realSeatIds) {
      if (leftAdult > 0) {
        list.push({ seatId: sId, ticketTypeId: 5 });
        leftAdult--;
      } else if (leftSenior > 0) {
        list.push({ seatId: sId, ticketTypeId: 6 });
        leftSenior--;
      } else if (leftChild > 0) {
        list.push({ seatId: sId, ticketTypeId: 4 });
        leftChild--;
      } else {
        list.push({ seatId: sId, ticketTypeId: 5 });
      }
    }
    return list;
  }

  // Handle booking creation
  async function handleBooking() {
    if (!canProceed || !screening) return;
    setLoadingBooking(true);

    try {
      console.log("🎬 Screening ID:", screening.id);
      const seatsRes = await fetch(`/api/screenings/${screening.id}/seats`);
      const seatsJson = await seatsRes.json();
      const apiSeats: ApiSeat[] = seatsJson?.seats || [];

      if (apiSeats.length === 0) {
        alert("No seats returned from API.");
        setLoadingBooking(false);
        return;
      }

      const realSeatIds: number[] = [];

     // Match frontend-selected seats with real seat IDs in DB
      for (const sel of selectedSeats) {
        const sameRow = apiSeats.filter(
          (s) => s.rowLabel === sel.row && s.auditoriumId === screening.auditoriumId
        );

        const sortedRow = sameRow.sort((a, b) => a.seatNumber - b.seatNumber);
        const seatInRow = sortedRow[sel.number - 1];

            if (!seatInRow) {
          alert(`Could not find seat ID for ${sel.row}-${sel.number}`);
          setLoadingBooking(false);
          return;
        }

        realSeatIds.push(seatInRow.seatId);
      }

      const seatsPayload = assignTicketTypesToSeats(realSeatIds);

      // Send booking to backend
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          screeningId: screening.id,
          seats: seatsPayload,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        console.error("Booking API error:", data);
        alert("Booking failed. Please try again.");
        setLoadingBooking(false);
        return;
      }

      // Support both singular and plural API responses
      const booking = data.booking || data.bookings?.[0];
      if (!booking) {
        alert("Booking data missing. Please try again.");
        setLoadingBooking(false);
        return;
      }

      localStorage.setItem("filmvisarna-booking", JSON.stringify(booking));
      navigate(`/confirmation/${booking.id}`);
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Something went wrong during booking.");
    } finally {
      setLoadingBooking(false);
    }
  }


  // --- Render ---
  return (
    <main className={`booking-page-content ${movieLoaded ? "loaded" : ""}`}>
      <section className="booking-page-left-side">
        <section className="booking-page-left-side-content">
          <MovieBooking
            onMovieLoaded={(loadedMovie) => {
              setMovie(loadedMovie as any);
              setMovieLoaded(true);
            }}
          />

          {movie && <AvailableDates movieId={movie.id} />}

          {/* Ticket counts */}
          <TicketsAmount />
          <Auditorium />

          {/* Paketpris info */}
          {paketprisToShow && (
            <section className="paketpris-info">
              <h3>Weekly Movie Deal</h3>
              <p>{paketprisToShow.liten.antal} small popcorn – {paketprisToShow.liten.pris} kr</p>
              <p>{paketprisToShow.litenEn.antal} small popcorn – {paketprisToShow.litenEn.pris} kr</p>
              <p className="paketpris-note">(Offer valid at checkout)</p>
            </section>
          )}

          {/* Button "slutför bokning" */}
          <section className="confirm-actions">
            <button
              className="confirm-btn"
              disabled={!canProceed}
              onClick={handleBooking}
                
              style={{
                backgroundColor: canProceed && !loadingBooking ? "#c41230" : "#716d7a",
                pointerEvents: canProceed && !loadingBooking ? "auto" : "none",
                cursor: canProceed && !loadingBooking ? "pointer" : "not-allowed",
                   }}>
              {loadingBooking ? "Bokar..." : "Gå vidare"}
     {!canProceed && (
            <p className="confirm-btn-nonclickable-text" style={{ opacity: 0.7, textAlign: "center" }}>
             Välj tid och antal platser för att fortsätta.
            </p>
          )}

          
            </button>

          
          </section>
        </section>
      </section>

      {/* Price summary on the right/top as before */}
      {movieLoaded && (
        <article className="booking-price-card-top">
           <BookingPriceCard />
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleBooking}
              disabled={!canProceed || loadingBooking}
              style={{
                padding: "0.8rem 1.2rem",
                fontWeight: 600,
                fontSize:"15px",
                borderRadius: 5,
                border: "none",
                width:"100%",
                cursor: canProceed && !loadingBooking ? "pointer" : "not-allowed",
                pointerEvents: canProceed && !loadingBooking ? "auto" : "none",
                backgroundColor: canProceed && !loadingBooking ? "#c41230" : "#716d7a",
                color: canProceed && !loadingBooking ? "#fff" : "#dbdbdb",
                opacity: canProceed ? 1 : 0.9,
                display: canProceed ? "block" : "none",
              }}
            >
              {loadingBooking ? "Bokar..." : "Gå vidare"}
            </button>
          </div>

     
        </article>
      )}
    </main>
  );
}

export default BookingContent;
