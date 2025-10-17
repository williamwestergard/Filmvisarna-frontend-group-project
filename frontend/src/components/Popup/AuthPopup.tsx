import { useState } from "react";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import "./Popup.css";

function AuthPopup() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <section className="popup-overlay">
      <article className="popup">
        {showLogin ? (
          <>
            <h2>Logga in eller bli medlem!</h2>

            <LoginForm
              onLogin={(email, password) => {
                console.log("Login:", { email, password });
                alert(`Inloggning lyckades för ${email}`);
              }}
            />

            {/* Button to switch to registration */}
            <button
              className="toggle-button"
              onClick={() => setShowLogin(false)}
            >
              Skapa Konto
            </button>
          </>
        ) : (
          <>
            <h2>Skapa Konto</h2>

            <RegisterForm
              onRegister={(data) => {
                console.log("Register:", data);
                alert(`Registrering lyckades för ${data.firstName}`);
              }}
              onCancel={() => setShowLogin(true)} // Avbryt switches back to login
            />
            {/* Removed the old toggle button "Tillbaka till Logga in" */}
          </>
        )}
      </article>
    </section>
  );
}

export default AuthPopup;