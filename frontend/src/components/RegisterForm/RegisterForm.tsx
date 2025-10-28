import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

interface RegisterFormProps {
  onRegister?: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
  }) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Lösenorden matchar inte!");
      return;
    }
    onRegister?.({ firstName, lastName, phone, email, password });
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <form className="register-card" onSubmit={handleSubmit}>
      {/* Logga + titel */}
      <img
        className="register-logo"
        src="/filmvisarnafooterbilden.png"
        alt="Filmvisarna"
      />
      <h2 className="register-title">Skapa konto</h2>

      {/* Fält */}
      <div className="register-field">
        <label htmlFor="firstName">Förnamn</label>
        <input
          id="firstName"
          type="text"
          placeholder="Förnamn"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="lastName">Efternamn</label>
        <input
          id="lastName"
          type="text"
          placeholder="Efternamn"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="phone">Telefonnummer</label>
        <input
          id="phone"
          type="tel"
          placeholder="Telefonnummer"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="email">E-postadress</label>
        <input
          id="email"
          type="email"
          placeholder="namn@exempel.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="register-field">
        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="register-field">
        <label htmlFor="confirmPassword">Upprepa lösenord</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      {/* Knappar */}
      <div className="register-actions">
        <button type="submit" className="btn btn-primary">
          Skapa konto
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Avbryt
        </button>
      </div>
    </form>
  );
}