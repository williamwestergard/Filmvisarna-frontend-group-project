import { useEffect, useState } from "react";
import "./MyPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

interface Seat {
  row: string;
  number: number;
}

interface Booking {
  bookingId: number;
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

  const handleCancelBooking = (bookingId: number) => {
    if (!window.confirm("Vill du verkligen avboka denna film?")) return;

    fetch(`/api/bookings/${bookingId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
        } else {
          alert("Kunde inte avboka bokningen.");
        }
      })
      .catch(() => alert("Ett nätverksfel uppstod."));
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

          {/* Upcoming bookings*/}
          <div className="profile-section">
            <h3> Kommande bokningar</h3>
            {upcomingBookings.length > 0 ? (
              <ul>
                {upcomingBookings.map((b) => (
                  <li key={b.bookingId}>
                    <strong>{b.movieTitle}</strong> <br />
                    {new Date(b.screeningTime).toLocaleString("sv-SE")} <br />
                    Salong: {b.auditoriumName} <br />
                    Platser:{" "}
                    {b.seats && b.seats.length > 0
                      ? b.seats.map((s) => `${s.row}${s.number}`).join(", ")
                      : "Ej registrerade"}{" "}
                    <br />
                    <button onClick={() => handleCancelBooking(b.bookingId)}>
                      Avboka
                    </button>
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
                  <li key={b.bookingId}>
                    <strong>{b.movieTitle}</strong> <br />
                    Såg den:{" "}
                    {new Date(b.screeningTime).toLocaleDateString("sv-SE", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    ({daysAgo(b.screeningTime)}) <br />
                    Platser:{" "}
                    {b.seats && b.seats.length > 0
                      ? b.seats.map((s) => `${s.row}${s.number}`).join(", ")
                      : "Ej registrerade"}
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
    </div>
  );
};

export default MyPages;
