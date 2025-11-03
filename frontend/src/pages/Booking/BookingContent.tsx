// BookingContent.tsx
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
  const { movie, setMovie, screening, totalTickets, selectedSeats, counts, totalAmount } =
    useBooking();

  const [movieLoaded, setMovieLoaded] = useState(false);
  const [weeklyMovie, setWeeklyMovie] = useState<Movie | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [timeoutOpen, setTimeoutOpen] = useState(false);

  const location = useLocation();
  const selectedDateFromHome = (location.state as any)?.selectedDate || "";
  const navigate = useNavigate();

  const paketprisFromState = (location.state as any)?.paketpris;

  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setWeeklyMovie(data))
      .catch((err) => console.error("Error fetching weekly movie:", err));
  }, []);

  // 10-minute timeout
  useEffect(() => {
    const id = window.setTimeout(() => setTimeoutOpen(true), 10 * 60 * 1000);
    return () => window.clearTimeout(id);
  }, []);

  const isWeekly = movie && weeklyMovie && movie.id === weeklyMovie.id;
  const paketprisToShow =
    paketprisFromState || (isWeekly ? weeklyMovie?.paketpris : null);

  const canProceed =
    !!movie &&
    !!screening &&
    totalTickets > 0 &&
    selectedSeats.length === totalTickets;

  // Assign correct ticket types to the selected seats
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

  // Handle the booking process
  async function handleBooking() {
    if (!canProceed || !screening) return;
    setLoadingBooking(true);

    const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
    const userId = authUser?.id || null;

    try {
      // Retrieve the logged-in user from localStorage
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

      if (!authUser?.id) {
        alert("You must be logged in to book.");
        setLoadingBooking(false);
        return;
      }

      console.log("DEBUG Screening Info:", screening);

      const res = await fetch(`/api/screenings/${screening.id}/seats`);
      const seatsJson = await res.json();
      const apiSeats: ApiSeat[] = seatsJson?.seats || [];

      if (apiSeats.length === 0) {
        alert("No seats found in API response.");
        setLoadingBooking(false);
        return;
      }

      const rowsMap: Record<string, ApiSeat[]> = {};
      for (const seat of apiSeats) {
        if (!rowsMap[seat.rowLabel]) rowsMap[seat.rowLabel] = [];
        rowsMap[seat.rowLabel].push(seat);
      }

      Object.values(rowsMap).forEach((row) =>
        row.sort((a, b) => a.seatNumber - b.seatNumber)
      );

      const realSeatIds: number[] = [];

      for (const sel of selectedSeats) {
        const rowSeats = rowsMap[sel.row];
        if (!rowSeats) {
          alert(`Row ${sel.row} not found.`);
          setLoadingBooking(false);
          return;
        }

        const seatInRow = rowSeats.find(
          (s) => s.seatNumber === sel.number
        );

        if (!seatInRow) {
          alert(`Could not find seat ${sel.row}-${sel.number}.`);
          setLoadingBooking(false);
          return;
        }

        realSeatIds.push(seatInRow.seatId);
      }

      const seatsPayload = assignTicketTypesToSeats(realSeatIds);

      console.log("DEBUG Booking payload:", {
        userId: 1,
        screeningId: screening.id,
        seats: seatsPayload,
      });

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
        alert("Booking failed. Please try again.");
        setLoadingBooking(false);
        return;
      }

      const booking = data.booking || data.bookings?.[0];
      if (!booking) {
        alert("Booking data missing. Please try again.");
        setLoadingBooking(false);
        return;
      }

      localStorage.setItem("filmvisarna-booking", JSON.stringify(booking));
      navigate(`/confirmation/${booking.id}`);
    } catch (err) {
      console.error("ERROR DURING BOOKING:", err);
      alert("An error occurred while processing your booking.");
    } finally {
      setLoadingBooking(false);
    }
  }

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
          <TicketsAmount />
          <Auditorium />

          {paketprisToShow && (
            <section className="paketpris-info">
              <h3>Weekly Movie - Package Price</h3>
              <p>
                {paketprisToShow.liten.antal} Liten Popcorn –{" "}
                {paketprisToShow.liten.pris} kr
              </p>
              <p>
                {paketprisToShow.litenEn.antal} Liten Popcorn –{" "}
                {paketprisToShow.litenEn.pris} kr
              </p>
              <p className="paketpris-note">(Erbjudanten tillgängligt vid betalning vid kassan)</p>
            </section>
          )}

          <section className="confirm-actions">
            <button
              className={`confirm-btn ${canProceed ? "active" : "disabled"}`}
              disabled={!canProceed || loadingBooking}
              onClick={handleBooking}
            >
              {canProceed && !loadingBooking ? (
                <>
                  <span className="confirm-total">
                    Total:{" "}
                    {new Intl.NumberFormat("sv-SE").format(totalAmount)} kr
                  </span>
                  <span className="confirm-next">Fortsätt</span>
                </>
              ) : loadingBooking ? (
                <span>Bokar...</span>
              ) : (
                <span>fortsätt</span>
              )}
            </button>

            {!canProceed && (
              <p className="confirm-btn-nonclickable-text">
                Välj datum, hur många biljetter och platser för att fortsätta.
              </p>
            )}
          </section>
        </section>
      </section>

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
                fontSize: "15px",
                borderRadius: 5,
                border: "none",
                width: "100%",
                cursor: canProceed && !loadingBooking ? "pointer" : "not-allowed",
                pointerEvents: canProceed && !loadingBooking ? "auto" : "none",
                backgroundColor: canProceed && !loadingBooking ? "#c41230" : "#716d7a",
                color: canProceed && !loadingBooking ? "#fff" : "#dbdbdb",
                opacity: canProceed ? 1 : 0.9,
              }}
            >
              {loadingBooking ? "Booking..." : "Continue"}
            </button>
          </div>
        </article>
      )}

      {timeoutOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "min(92vw, 420px)",
              borderRadius: 14,
              padding: "18px 16px",
              background: "#1b1b2f",
              color: "#fff",
              boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
            }}
          >
            <h2 style={{ marginBottom: 8 }}>Sessionen har löpt</h2>
            <p>Du har väntat mer 10 minuter. Ladda om sidan för att fortsätta.</p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.6rem 1rem",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#5B5A6B",
                  color: "#fff",
                  minWidth: 160,
                }}
              >
                Ladda om sidan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default BookingContent;
