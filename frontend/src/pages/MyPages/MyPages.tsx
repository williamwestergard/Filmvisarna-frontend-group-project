 import { useEffect, useState } from "react";
import "./MyPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";



// User booking type (used to show booking history)
interface Booking {
  bookingId: number;
  movieTitle: string;
  screeningTime: string;
  status: string;
  auditoriumName: string;
}

// User profile type (includes contact info)
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}




const MyPages: React.FC = () => {
  // Store user and their booking history
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch user data and booking history from backend

  useEffect(() => {
    // Retrieve stored user from localStorage (set after login)
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

    // Fetch profile + booking history from backend
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

 

  const handleCancelTicket = (ticketToCancel: string) => {
    console.log("Cancel ticket clicked:", ticketToCancel);

  };


  // Loading and error states

  if (loading) return <p>Laddar användardata...</p>;
  if (!user) return <p>Ingen användare är inloggad.</p>;


  // Component layout

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

         
          <div className="profile-section">
            <h3>Mina Bokningar</h3>
            {bookings.length > 0 ? (
              <ul>
                {bookings.map((b) => (
                  <li key={b.bookingId}>
                    <strong>{b.movieTitle}</strong> <br />
                    {new Date(b.screeningTime).toLocaleString()} <br />
                    Auditorium: {b.auditoriumName} <br />
                    Status: {b.status}{" "}
                    {}
                    <button
                      onClick={() =>
                        handleCancelTicket(b.bookingId.toString())
                      }
                      className="cancel-ticket-btn"
                    >
                      Avboka
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Du har inga bokningar än.</p>
            )}
          </div>

          
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
