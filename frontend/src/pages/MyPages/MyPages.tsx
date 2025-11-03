import { useEffect, useState } from "react";
import "./MyPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

interface Booking {
  bookingId: number;
  movieTitle: string;
  screeningTime: string;
  status: string;
  auditoriumName: string;
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

  useEffect(() => {
    // 1. Retrieve the user from localStorage (set during login)
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

    // 2. Fetch user data and booking history from the backend
    fetch(`/api/users/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
          setBookings(data.bookings);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      })
      .catch((err) => console.error("Network error:", err))
      .finally(() => setLoading(false));
  }, []);

  // 3. Loading and visual states
  if (loading) return <p>Laddar användardata...</p>;
  if (!user) return <p>Ingen användare är inloggad.</p>;

  // 4. Display user profile and booking history
  return (
    <div className="my-pages">
      <section className="profile-container">
        <div className="profile-card">
          {/* Profile section */}
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

          {/* Booking history */}
          <div className="profile-section">
            <h3>Mina Bokningar</h3>
            {bookings.length > 0 ? (
              <ul>
                {bookings.map((b) => (
                  <li key={b.bookingId}>
                    <strong>{b.movieTitle}</strong> <br />
                    {new Date(b.screeningTime).toLocaleString()} <br />
                    Auditorium: {b.auditoriumName} <br />
                    Status: {b.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inga bokningar än.</p>
            )}
          </div>

          {/* Logout button */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("authUser");
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyPages;
