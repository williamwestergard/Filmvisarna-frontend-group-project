import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

interface Seat {
  row: string;
  number: number;
}

interface Booking {
  bookingId: number;
  bookingUrl?: string;
  movieTitle: string;
  screeningTime: string;
  auditoriumName: string;
  seats: Seat[];
  seen?: boolean;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

const MyPages: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  const confirmCancelBooking = () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);

    fetch(`/api/bookings/${bookingToCancel.bookingId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setBookings((prev) => prev.filter((b) => b.bookingId !== bookingToCancel.bookingId));
          setBookingToCancel(null);
        } else {
          alert("Kunde inte avboka bokningen.");
        }
      })
      .catch(() => alert("Ett nätverksfel uppstod."))
      .finally(() => setIsCancelling(false));
  };

  const closeCancelDialog = () => {
    if (isCancelling) return;
    setBookingToCancel(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) {
      setLoading(false);
      return;
    }

    fetch(`/api/users/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const now = new Date();
          const enrichedBookings = data.bookings.map((b: Booking) => {
            const screeningDate = new Date(b.screeningTime);
            return { ...b, seen: screeningDate < now };
          });

          setUser(data.user);
          setBookings(enrichedBookings);
        }
      })
      .catch((err) => console.error("Error fetching user data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar användardata...</p>;
  if (!user) return <p>Ingen användare är inloggad.</p>;

  const daysAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "idag" : `${days} dagar sedan`;
  };

  const upcomingBookings = bookings.filter((b) => !b.seen);
  const seenBookings = bookings.filter((b) => b.seen);

  return (
    <div className="my-pages">
      <section className="profile-container">
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img-placeholder">
              <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
            </div>
            <div className="profile-info">
              <h2>{`${user.firstName} ${user.lastName}`}</h2>
              <p>{user.email}</p>
              {user.phoneNumber && <p>{user.phoneNumber}</p>}
            </div>
          </div>

          {/* Top-right counters */}
          <div className="stats-top-right" aria-label="Mina statistik">
            <div className="stat-pill" title="Bokade (kommande)">
              <span className="stat-number">{upcomingBookings.length}</span>
              <span className="stat-label">bokade</span>
            </div>
            <div className="stat-pill" title="Sedda (historik)">
              <span className="stat-number">{seenBookings.length}</span>
              <span className="stat-label">sedda</span>
            </div>
          </div>

          {/* Upcoming bookings*/}
          <div className="profile-section">
            <h3> Kommande bokningar</h3>
            {upcomingBookings.length > 0 ? (
              <ul>
                {upcomingBookings.map((b) => (
                  <li key={b.bookingId} className="booking-card">
                    <header className="booking-header">
                      <h4 className="booking-title">{b.movieTitle}</h4>
                    </header>
                    <div className="booking-meta">
                      <div>
                        <strong>Datum</strong>
                        <time>{new Date(b.screeningTime).toLocaleString("sv-SE")}</time>
                      </div>
                      <div>
                        <strong>Salong</strong>
                        <span>{b.auditoriumName}</span>
                      </div>
                      <div>
                        <strong>Platser</strong>
                        <span className="seat-list">
                          {b.seats && b.seats.length > 0
                            ? b.seats.map((s, i) => (
                                <span key={i} className="seat-chip">{`${s.row}${s.number}`}</span>
                              ))
                            : <em>Ej registrerade</em>}
                        </span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <span className="booking-hint">Din bokning</span>
                      <div className="booking-buttons">
                        <button
                          className="view-ticket-btn"
                          onClick={() => {
                            const ticketSlug = b.bookingUrl || b.bookingId;
                            navigate(`/ticket/${ticketSlug}`);
                          }}
                        >
                          Visa biljett
                        </button>
                        <button className="cancel-ticket-btn" onClick={() => setBookingToCancel(b)}>
                          Avboka
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inga kommande bokningar.</p>
            )}
          </div>

          {/* Movies you've already seen */}
          <div className="profile-section">
            <h3> Filmer du redan har sett</h3>
            {seenBookings.length > 0 ? (
              <ul>
                {seenBookings.map((b) => (
                  <li key={b.bookingId} className="booking-card">
                    <header className="booking-header">
                      <h4 className="booking-title">{b.movieTitle}</h4>
                    </header>
                    <div className="booking-meta">
                      <div>
                        <strong>Såg den</strong>
                        <time>
                          {new Date(b.screeningTime).toLocaleDateString("sv-SE", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })} ({daysAgo(b.screeningTime)})
                        </time>
                      </div>
                      <div>
                        <strong>Platser</strong>
                        <span className="seat-list">
                          {b.seats && b.seats.length > 0
                            ? b.seats.map((s, i) => (
                                <span key={i} className="seat-chip">{`${s.row}${s.number}`}</span>
                              ))
                            : <em>Ej registrerade</em>}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inte sett några filmer ännu.</p>
            )}
          </div>

          {/* Logout-button */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("authUser");
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }}
          >
            Logga ut
          </button>
        </div>
      </section>
      {bookingToCancel && (
        <div className="cancel-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
          <div className="cancel-modal__dialog">
            <h3 id="cancel-dialog-title">Avboka {bookingToCancel.movieTitle}?</h3>
            <p className="cancel-modal__text">
              Bokning {new Date(bookingToCancel.screeningTime).toLocaleString("sv-SE")} i {bookingToCancel.auditoriumName}. Är du säker på att du vill ta bort bokningen?
            </p>
            <div className="cancel-modal__actions">
              <button className="cancel-modal__keep" onClick={closeCancelDialog} disabled={isCancelling}>
                Behåll bokningen
              </button>
              <button className="cancel-modal__confirm" onClick={confirmCancelBooking} disabled={isCancelling}>
                {isCancelling ? "Avbokar..." : "Avboka"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPages;
