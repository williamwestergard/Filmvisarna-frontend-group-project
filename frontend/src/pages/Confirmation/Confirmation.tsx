import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Confirmation.css";

interface BookingSeat {
  seatId: number;
  ticketTypeId: number;
}

interface Booking {
  id: number;
  screeningId: number;
  userId: number;
  createdAt: string;
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
  posterUrl?: string;
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

interface BookingTotals {
  totalPrice: number;
}

export default function Confirmation() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [auditorium, setAuditorium] = useState<Auditorium | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [totals, setTotals] = useState<BookingTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBooking() {
      try {
        const stored = localStorage.getItem("filmvisarna-booking");
        if (!stored) {
          setErrorMsg("No booking found.");
          return;
        }

        let bookingData;
        try {
          bookingData = JSON.parse(stored);
        } catch {
          setErrorMsg("Invalid booking data.");
          return;
        }

        const bookingId = bookingData?.id || bookingData?.bookingId;
        if (!bookingId) {
          setErrorMsg("Invalid booking ID.");
          return;
        }

        console.log("Loading booking with ID:", bookingId);

        // Fetch booking info
        const bookingRes = await fetch(`/api/bookings/${bookingId}`);
        if (!bookingRes.ok) throw new Error("Failed to fetch booking");
        const bookingJson = await bookingRes.json();
        const fetchedBooking = bookingJson.booking || bookingJson;
        setBooking(fetchedBooking);
        console.log("Fetched booking:", fetchedBooking);

        // Fetch screening info
        const screeningRes = await fetch(`/api/screenings/${fetchedBooking.screeningId}`);
        if (!screeningRes.ok) throw new Error("Failed to fetch screening");
        const screeningJson = await screeningRes.json();
        setScreening(screeningJson);
        console.log("Fetched screening:", screeningJson);

        // Fetch movie info
        const movieRes = await fetch(`/api/movies/${screeningJson.movieId}`);
        if (!movieRes.ok) throw new Error("Failed to fetch movie");
        const movieJson = await movieRes.json();
        setMovie(movieJson);
        console.log("Fetched movie:", movieJson);

        // Fetch auditorium info
        const audRes = await fetch(`/api/auditoriums/${screeningJson.auditoriumId}`);
        if (!audRes.ok) throw new Error("Failed to fetch auditorium");
        const audJson = await audRes.json();
        setAuditorium(audJson);
        console.log("Fetched auditorium:", audJson);

        // Fetch total price
        const totalsRes = await fetch(`/api/booking-totals/${bookingId}`);
        if (totalsRes.ok) {
          const totalsJson = await totalsRes.json();
          setTotals(totalsJson);
          console.log("Fetched totals:", totalsJson);
        }

  // Fetch seats
const seatsRes = await fetch(`/api/screenings/${screeningJson.id}/seats`);
if (seatsRes.ok) {
  const seatsJson = await seatsRes.json();
  setSeats(seatsJson.seats || seatsJson);
  console.log("Fetched seats from API:", seatsJson);
}

      } catch (err) {
        console.error("Error loading booking:", err);
        setErrorMsg("Could not load booking information.");
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [navigate]);

  if (loading) return <p className="loading">Laddar Bokning...</p>;

  if (errorMsg) {
    return (
      <main className="confirmation-page">
        <p style={{ color: "white", textAlign: "center" }}>{errorMsg}</p>
        <button
          className="book-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "2rem" }}
        >
          Tillbaka till startsidan
        </button>
      </main>
    );
  }

  if (!booking || !movie || !screening) {
    return <p style={{ color: "white", textAlign: "center" }}>Bokningen kunde inte hittas.</p>;
  }

  console.log("Booking seats data:", booking.seats);
  console.log("All available seats data:", seats);

  // Format date/time
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

// Seat labels
const seatLabels =
  booking.seats
    ?.map((b) => {
      const found = seats.find((s) => s.seatId === b.seatId);
      console.log("Matching seat:", { bookingSeat: b, found });
      return found ? `${found.rowLabel}-${found.seatNumber}` : `#${b.seatId}`;
    })
    .join(", ") || "Not available";


  return (
    <main className="confirmation-page">
      <button className="back-btn-top" onClick={() => navigate(-1)}>
        ← Gå tillbaka
      </button>

      <section className="booking-card">
        <div className="booking-info">
          <h2>{movie.title}</h2>
          <p className="language">{movie.language}</p>
          <p><strong>{formattedDate}</strong></p>
          <p>Tid: {formattedTime}</p>
          <p>Salong: {auditorium?.name ?? `Auditorium ${screening.auditoriumId}`}</p>
          <p>Säten: {seatLabels}</p>
          <p className="sum">
            Summa: {totals?.totalPrice ? `${totals.totalPrice} kr` : "Not available"}
          </p>

          <div className="button-group">
            <button
              className="book-btn"
              onClick={() => navigate(`/ticket/${booking.id}`)}
            >
              Visa biljetterna
            </button>
          </div>
        </div>

        <img
          className="booking-movie-card"
          src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
          alt={movie.title}
        />
      </section>
    </main>
  );
}
