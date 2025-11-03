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
    //  1. Hämta användaren från localStorage (som sattes vid inloggning)
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) {
      console.warn("Ingen användare hittades i localStorage");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) {
      console.warn("Inloggad användare saknar ID");
      setLoading(false);
      return;
    }

    //  2. Hämta användardata och bokningshistorik från backend
    fetch(`/api/users/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
          setBookings(data.bookings);
        } else {
          console.error("Fel vid hämtning av användardata:", data.message);
        }
      })
      .catch((err) => console.error("Nätverksfel:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 3. Visuella tillstånd
  if (loading) return <p>Laddar användardata...</p>;
  if (!user) return <p>Ingen användare inloggad.</p>;

  // 🔹 4. Visa profil och bokningar
  return (
    <div className="my-pages">
      <section className="profile-container">
        <div className="profile-card">
          {/* Profil */}
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

          {/* Bokningshistorik */}
          <div className="profile-section">
            <h3>Mina bokningar</h3>
            {bookings.length > 0 ? (
              <ul>
                {bookings.map((b) => (
                  <li key={b.bookingId}>
                     <strong>{b.movieTitle}</strong> <br />
                     {new Date(b.screeningTime).toLocaleString()} <br />
                     Salong: {b.auditoriumName} <br />
                     Status: {b.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inga bokningar ännu.</p>
            )}
          </div>

          {/* Logga ut */}
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
