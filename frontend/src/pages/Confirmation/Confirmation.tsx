import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Confirmation.css";

interface Booking {
  movieTitle: string;
  language: string;
  date: string;
  time: string;
  auditorium: string;
  totalPrice: number;
  posterUrl: string;
}

export default function ConfirmationPage() {
  const { bookingId } = useParams(); // currently unused, reserved for dynamic backend data
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Temporary mock data for layout testing (no backend connection yet)
    setBooking({
      movieTitle: "The Shining",
      language: "Engelskt tal, Svensk text",
      date: "Fredag, 18 Oktober",
      time: "19:00",
      auditorium: "2",
      totalPrice: 280,
      posterUrl: "/public/the-shining-poster.jpg",
    });
  }, []);

  if (!booking) {
    return <p className="loading">Laddar bokning...</p>;
  }

  return (
    <main className="confirmation-page">
      {/* Top back button (returns to previous page) */}
      <button className="back-btn-top" onClick={() => navigate(-1)}>
        Gå tillbaka
      </button>

      {/* Main booking card with all booking details */}
      <section className="booking-card">
        <div className="booking-info">
          <h2>{booking.movieTitle}</h2>
          <p className="language">{booking.language}</p>
          <p>
            <strong>{booking.date}</strong>
          </p>
          <p>Tid: {booking.time}</p>
          <p>Salong: {booking.auditorium}</p>
          <p className="sum">Summa: {booking.totalPrice} kr</p>

          {/* Bottom booking button */}
          <div className="button-group">
            <button
              className="book-btn"
              onClick={() => alert("Biljetterna bokades!")}
            >
              Boka biljetterna
            </button>
          </div>
        </div>

        {/* Movie poster image */}
        <img
          className="poster"
          src={booking.posterUrl}
          alt={`Affisch för ${booking.movieTitle}`}
        />
      </section>
    </main>
  );
}
