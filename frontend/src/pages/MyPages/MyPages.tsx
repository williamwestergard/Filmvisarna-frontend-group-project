import { useEffect, useState } from "react";
import "./MyPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

// --- Types ---
interface Booking {
  bookingId: number;
  movieTitle: string;
  screeningTime: string;
  status: string;
  auditoriumName: string;
  seen?: boolean; // added flag for past screenings
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

  // --- Fetch user and booking data from backend ---
  useEffect(() => {
    // Retrieve the user from localStorage (set during login)
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) {
      console.warn("No user found in localStorage");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) {
      console.warn("Logged-in user has no ID");
      setLoading(false);
      return;
    }

    // Fetch user info + booking history from backend
    fetch(`/api/users/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const now = new Date();

          // Mark each booking as seen or upcoming
          const enrichedBookings = data.bookings.map((b: Booking) => {
            const screeningDate = new Date(b.screeningTime);
            return { ...b, seen: screeningDate < now };
          });

          setUser(data.user);
          setBookings(enrichedBookings);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      })
      .catch((err) => console.error("Network error:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- Handle loading and missing user states ---
  if (loading) return <p>Laddar användardata...</p>;
  if (!user) return <p>Ingen användare är inloggad.</p>;

  // --- Utility function for "X dagar sedan" ---
  const daysAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "idag" : `${days} dagar sedan`;
  };

  // --- Separate upcoming and seen bookings ---
  const upcomingBookings = bookings.filter((b) => !b.seen);
  const seenBookings = bookings.filter((b) => b.seen);

  // --- UI ---
  return (
    <div className="my-pages">
      <section className="profile-container">
        <div className="profile-card">

          {/* --- Profile Header --- */}
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

          {/* --- Upcoming bookings section --- */}
          <div className="profile-section">
            <h3>Kommande bokningar</h3>
            {upcomingBookings.length > 0 ? (
              <ul>
                {upcomingBookings.map((b) => (
                  <li key={b.bookingId}>
                    <strong>{b.movieTitle}</strong> <br />
                    {new Date(b.screeningTime).toLocaleString("sv-SE")} <br />
                    Salong: {b.auditoriumName} <br />
                    Status: {b.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inga kommande bokningar.</p>
            )}
          </div>

          {/* --- Watched movies section --- */}
          <div className="profile-section">
            <h3>Filmer du redan har sett</h3>
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
                    ({daysAgo(b.screeningTime)})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inte sett några filmer ännu.</p>
            )}
          </div>

          {/* --- Logout button --- */}
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
