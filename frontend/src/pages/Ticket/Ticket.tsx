import "./Ticket.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface BookingSeat {
  seatId: number;
  ticketTypeId: number;
}

interface Booking {
  id: number;
  bookingNumber: string;
  screeningId: number;
  userId: number;
  status: string;
  seats: BookingSeat[];
}

interface Screening {
  id: number;
  movieId: number;
  auditoriumId: number;
  time: string;
}

interface Movie {
  id: number;
  title: string;
  language: string;
}

interface Auditorium {
  id: number;
  name: string;
}

interface Seat {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
}

export default function TicketPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [auditorium, setAuditorium] = useState<Auditorium | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
   const { bookingUrl } = useParams<{ bookingUrl: string }>();

  useEffect(() => {
    async function loadTicket() {
      try {
        if (!bookingUrl) {
          setErrorMsg("No booking ID provided.");
          return;
        }

        const bookingRes = await fetch(`/api/bookings/url/${bookingUrl}`);
        if (!bookingRes.ok) throw new Error("Failed to fetch booking");
        const bookingJson = await bookingRes.json();
        const currentBooking = bookingJson.booking || bookingJson;
        setBooking(currentBooking);

        const screeningRes = await fetch(`/api/screenings/${currentBooking.screeningId}`);
        if (!screeningRes.ok) throw new Error("Failed to fetch screening");
        const screeningJson = await screeningRes.json();
        setScreening(screeningJson);

        const movieRes = await fetch(`/api/movies/${screeningJson.movieId}`);
        if (!movieRes.ok) throw new Error("Failed to fetch movie");
        const movieJson = await movieRes.json();
        setMovie(movieJson);

        const audRes = await fetch(`/api/auditoriums/${screeningJson.auditoriumId}`);
        if (!audRes.ok) throw new Error("Failed to fetch auditorium");
        const audJson = await audRes.json();
        setAuditorium(audJson);

        const seatsRes = await fetch(`/api/screenings/${screeningJson.id}/seats`);
        if (seatsRes.ok) {
          const seatsJson = await seatsRes.json();
          setSeats(seatsJson.seats || seatsJson);
        }
      } catch (err) {
        console.error("Error loading ticket:", err);
        setErrorMsg("Could not load ticket information.");
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [bookingUrl]);

  if (loading) return <p className="loading">Laddar Biljett...</p>;
  if (errorMsg) return <p style={{ color: "white", textAlign: "center" }}>{errorMsg}</p>;
  if (!booking || !movie || !screening) {
    return <p style={{ color: "white", textAlign: "center" }}>Biljett kunde inte hittas.</p>;
  }

  const dateObj = new Date(screening.time);
  const formattedDate = dateObj.toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const seatLabels =
    booking.seats
      ?.map((b) => {
        const found = seats.find((s) => s.seatId === b.seatId);
        return found ? `${found.rowLabel}-${found.seatNumber}` : `#${b.seatId}`;
      })
      .join(", ") || "Not available";

      const now = new Date();
const screeningTime = new Date(screening.time);
const oneHourBefore = new Date(screeningTime.getTime() - 60 * 60 * 1000);
const canCancel = now < oneHourBefore;

  return (
    <section className="ticket-page">
      <div className="ticket">
        <header className="ticket-header">
          <h1 className="ticket-title">Dina biljetter är bokade!</h1>
        </header>

        <div className="ticket-body">
          <section className="ticket-info-panel" aria-label="Booking information">
            <h2 className="ti-title">{movie.title}</h2>
            <dl className="ti-list">
              <div className="ti-row">
                <dt>Datum</dt>
                <dd>{formattedDate}</dd>
              </div>
              <div className="ti-row">
                <dt>Tid</dt>
                <dd>{formattedTime}</dd>
              </div>
              <div className="ti-row">
                <dt>Salong</dt>
                <dd>{auditorium?.name ?? "Unknown"}</dd>
              </div>
              <div className="ti-row">
                <dt>Platser</dt>
                <dd>{seatLabels}</dd>
              </div>
            </dl>
          </section>

          <aside className="ticket-note" aria-label="Important information">
            <p className="note-title">OBS!</p>
            <p className="note-text">
              Visa ditt bokningsnummer vid kassan för att bekräfta dina biljetter.
            </p>
          </aside>
        </div>

        <div className="ticket-divider" aria-hidden="true" />

        <footer className="ticket-footer">
          <p className="ticket-footer-label">Bokningsnummer:</p>
          <div className="ticket-number-slot">{booking.bookingNumber}</div>

          <button
            className="book-btn"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            Tillbaka till startsidan
          </button>
          <button
  className={`cancel-btn ${!canCancel ? "disabled" : ""}`}
  disabled={!canCancel}
  onClick={async () => {
    if (!canCancel) return;

    const confirmDelete = window.confirm("Är du säker på att du vill avbeställa?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Kunde inte avbeställa bokningen.");

      alert("Din bokning har avbeställts.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Något gick fel vid avbeställningen.");
    }
  }}
>
  Avbeställ
</button>

{!canCancel && (
  <p className="cancel-note">
    Du kan inte avbeställa mindre än en timme innan filmen startar.
  </p>
)}
        </footer>
      </div>
    </section>
  );
}
