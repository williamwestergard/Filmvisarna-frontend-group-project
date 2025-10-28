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
  id: number;
  rowLetter: string;
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

  useEffect(() => {
    async function loadTicket() {
      try {
        if (!bookingId) {
          setErrorMsg("No booking ID provided.");
          return;
        }

        // Fetch booking data
        const bookingRes = await fetch(`/api/bookings/${bookingId}`);
        if (!bookingRes.ok) throw new Error("Failed to fetch booking");
        const bookingJson = await bookingRes.json();
        const currentBooking = bookingJson.booking || bookingJson;
        setBooking(currentBooking);

        // Fetch screening data
        const screeningRes = await fetch(`/api/screenings/${currentBooking.screeningId}`);
        if (!screeningRes.ok) throw new Error("Failed to fetch screening");
        const screeningJson = await screeningRes.json();
        setScreening(screeningJson);

        // Fetch movie data
        const movieRes = await fetch(`/api/movies/${screeningJson.movieId}`);
        if (!movieRes.ok) throw new Error("Failed to fetch movie");
        const movieJson = await movieRes.json();
        setMovie(movieJson);

        // Fetch auditorium data
        const audRes = await fetch(`/api/auditoriums/${screeningJson.auditoriumId}`);
        if (!audRes.ok) throw new Error("Failed to fetch auditorium");
        const audJson = await audRes.json();
        setAuditorium(audJson);

        // Fetch seats for this auditorium
        const seatsRes = await fetch(`/api/seats/auditorium/${screeningJson.auditoriumId}`);
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
  }, [bookingId]);

  if (loading) return <p className="loading">Loading ticket...</p>;
  if (errorMsg) return <p style={{ color: "white", textAlign: "center" }}>{errorMsg}</p>;

  if (!booking || !movie || !screening) {
    return <p style={{ color: "white", textAlign: "center" }}>Ticket not found.</p>;
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
        const found = seats.find((s) => s.id === b.seatId);
        return found ? `Row ${found.rowLetter} – Seat ${found.seatNumber}` : `#${b.seatId}`;
      })
      .join(", ") || "N/A";

  return (
    <section className="ticket-page">
      <div className="ticket">
        <header className="ticket-header">
          <h1 className="ticket-title">Your tickets are booked!</h1>
        </header>

        <div className="ticket-body">
          <section className="ticket-info-panel" aria-label="Booking information">
            <h2 className="ti-title">{movie.title}</h2>
            <dl className="ti-list">
              <div className="ti-row">
                <dt>Date</dt>
                <dd>{formattedDate}</dd>
              </div>
              <div className="ti-row">
                <dt>Time</dt>
                <dd>{formattedTime}</dd>
              </div>
              <div className="ti-row">
                <dt>Auditorium</dt>
                <dd>{auditorium?.name ?? "Unknown"}</dd>
              </div>
              <div className="ti-row">
                <dt>Seats</dt>
                <dd>{seatLabels}</dd>
              </div>
            </dl>
          </section>

          <aside className="ticket-note" aria-label="Important information">
            <p className="note-title">Note:</p>
            <p className="note-text">
              Show your booking number at the counter to confirm your tickets.
            </p>
          </aside>
        </div>

        <div className="ticket-divider" aria-hidden="true" />

        <footer className="ticket-footer">
          <p className="ticket-footer-label">Booking number:</p>
          <div className="ticket-number-slot">{booking.bookingNumber}</div>

          <button
            className="book-btn"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </footer>
      </div>
    </section>
  );
}
