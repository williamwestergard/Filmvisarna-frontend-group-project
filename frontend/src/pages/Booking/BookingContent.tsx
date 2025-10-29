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
  // Simple 10 minute timeout popup
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

  // Start a simple 10-minute timer when the booking page mounts
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

  // 🧠 Boknings-funktion med fix för seatId-sökning
  async function handleBooking() {
    if (!canProceed || !screening) return;
    setLoadingBooking(true);

    try {
      console.log("Screening Info:", screening);

      const res = await fetch(`/api/screenings/${screening.id}/seats`);
      const seatsJson = await res.json();
      const apiSeats: ApiSeat[] = seatsJson?.seats || [];

      console.log("DEBUG API Seats Response:", apiSeats.slice(0, 10));

      if (apiSeats.length === 0) {
        alert("Inga säten hittades i API-svaret.");
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

      console.log("DEBUG Selected Seats:", selectedSeats);
      console.log("DEBUG RowsMap keys:", Object.keys(rowsMap));

      for (const sel of selectedSeats) {
        console.log("DEBUG Checking selected seat:", sel);

        const rowSeats = rowsMap[sel.row];
        if (!rowSeats) {
          console.error(`Kunde inte hitta rad ${sel.row}`);
          alert(`Raden ${sel.row} hittades inte.`);
          setLoadingBooking(false);
          return;
        }

        console.log(" Row Seats:", rowSeats.map((s) => s.seatNumber));

        // hitta säte via seatNumber
        const seatInRow = rowSeats.find(
          (s) => s.seatNumber === sel.number
        );

        if (!seatInRow) {
          console.error(
            `Kunde inte hitta seatId för ${sel.row}-${sel.number}`,
            { rowSeats }
          );
          alert(`Kunde inte hitta platsen ${sel.row}-${sel.number}.`);
          setLoadingBooking(false);
          return;
        }

        console.log("DEBUG Matched seat:", seatInRow);
        realSeatIds.push(seatInRow.seatId);
      }

      console.log("DEBUG Real seat IDs to book:", realSeatIds);

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

      console.log("DEBUG Booking API Response:", data);

      if (!data.ok) {
        console.error("Booking API error:", data);
        alert("Bokningen misslyckades. Försök igen.");
        setLoadingBooking(false);
        return;
      }

      const booking = data.booking || data.bookings?.[0];
      if (!booking) {
        alert("Bokningsdata saknas. Försök igen.");
        setLoadingBooking(false);
        return;
      }

      localStorage.setItem("filmvisarna-booking", JSON.stringify(booking));
      navigate(`/confirmation/${booking.id}`);
    } catch (err) {
      console.error("FEL VID BOKNING:", err);
      alert("Något gick fel vid bokningen.");
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
          <TicketsAmount />
          <Auditorium />

          {paketprisToShow && (
            <section className="paketpris-info">
              <h3>Veckans film - Paketpris</h3>
              <p>
                {paketprisToShow.liten.antal} liten popcorn –{" "}
                {paketprisToShow.liten.pris} kr
              </p>
              <p>
                {paketprisToShow.litenEn.antal} liten popcorn –{" "}
                {paketprisToShow.litenEn.pris} kr
              </p>
              <p className="paketpris-note">(Erbjudandet gäller vid betalning i kassan)</p>
            </section>
          )}

      {/* Button show total amount and proceed */}
      <section className="confirm-actions">
        <button
          className={`confirm-btn ${canProceed ? "active" : "disabled"}`}
          disabled={!canProceed || loadingBooking}
          onClick={handleBooking}
        >
          {canProceed && !loadingBooking ? (
            <>
              <span className="confirm-total">
                Totalsumma:{" "}
                {new Intl.NumberFormat("sv-SE").format(totalAmount)} kr
              </span>
              <span className="confirm-next">Gå vidare</span>
            </>
          ) : loadingBooking ? (
            <span>Bokar...</span>
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
              onClick={handleBooking}
              disabled={!canProceed || loadingBooking}
              style={{
                padding: "0.8rem 1.2rem",
                fontWeight: 600,
                fontSize: "15px",
                borderRadius: 5,
                border: "none",
                width: "100%",
                cursor:
                  canProceed && !loadingBooking ? "pointer" : "not-allowed",
                pointerEvents:
                  canProceed && !loadingBooking ? "auto" : "none",
                backgroundColor:
                  canProceed && !loadingBooking ? "#c41230" : "#716d7a",
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
          role="dialog"
          aria-modal="true"
          aria-label="Sessionen gick ut"
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
            <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>Sessionen gick ut</h2>
            <p style={{ margin: "6px 0", lineHeight: 1.4 }}>
              Du har väntat mer än 10 minuter. För att visa korrekta platser och priser
              behöver sidan uppdateras.
            </p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
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
                  minWidth: 160
                }}
              >
                Uppdatera sidan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default BookingContent;