import "./MyPages.css";

interface User {
  name: string;
  email: string;
  phone?: string; // optional
  history: string[];
  tickets: string[];
}

const MyPages: React.FC = () => {
  const user: User = {
    name: "",
    email: "",
    phone: "",
    history: [],
    tickets: [],
  };

  return (
    <div className="my-pages">
      <section className="profile-container">
        <div className="profile-card">
          {/* User info */}
          <div className="profile-top">
            <div className="profile-img-placeholder">
              <i className="fa fa-user"></i>
            </div>
            <div className="profile-info">
              <h2>{user.name || "Användarnamn"}</h2>
              <p>{user.email || "E-postadress"}</p>
              {user.phone && <p>{user.phone}</p>}
            </div>
          </div>

          {/* History */}
          <div className="profile-section">
            <h3>Historik:</h3>
            {user.history.length > 0 ? (
              <ul>
                {user.history.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Din filmhistorik kommer visas här.</p>
            )}
          </div>

          {/* Tickets */}
          <div className="profile-section">
            <h3>Biljetter:</h3>
            {user.tickets.length > 0 ? (
              <ul>
                {user.tickets.map((ticket, index) => (
                  <li key={index}>{ticket}</li>
                ))}
              </ul>
            ) : (
              <p>Du har inga aktiva biljetter.</p>
            )}
          </div>

          <button className="logout-btn">Logga ut</button>
        </div>
      </section>
    </div>
  );
};

export default MyPages;