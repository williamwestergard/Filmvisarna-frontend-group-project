import "./MyPages.css";

interface User {
    name: string;
    email: string;
    phone?: string; // optional
    history: string[];
    tickets: string[];
}

const myPages: React.FC = () => {
    const user: User = { // placeholder data, will be replaced with real logged-in user info
        name: "",
        email: "",
        phone: "",
        history: [],
        tickets: [],
    };

     return (
    <div className="my-pages">

      <main className="profile-container">
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img-placeholder">
              <i className="fa fa-user"></i>
            </div>
            <div className="profile-info">
              <h2>{user.name || "Username"}</h2>
              <p>{user.email || "Email"}</p>
              {user.phone && <p>{user.phone}</p>}
            </div>
          </div>

          {/* History */}
          <div className="profile-section">
            <h3>History:</h3>
            {user.history.length > 0 ? (
              <ul>
                {user.history.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Your viewing history will appear here.</p>
            )}
          </div>

          {/* Tickets */}
          <div className="profile-section">
            <h3>Tickets:</h3>
            {user.tickets.length > 0 ? (
              <ul>
                {user.tickets.map((ticket, index) => (
                  <li key={index}>{ticket}</li>
                ))}
              </ul>
            ) : (
              <p>You don’t have any active tickets.</p>
            )}
          </div>

          <button className="logout-btn">Log out</button>
        </div>
      </main>
    </div>
  );
};

export default myPages;