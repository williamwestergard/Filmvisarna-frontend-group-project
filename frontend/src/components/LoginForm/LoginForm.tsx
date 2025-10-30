import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { LoginFormApi } from "../../api/LoginFormApi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
      setError(""); 

    try {
      const result = await LoginFormApi({
        email,
        password,
      });

      if (result.ok) {
        // Save user to localStorage
        localStorage.setItem("authUser", JSON.stringify(result.user));
          localStorage.setItem("authToken", result.token);

        // Inform Navbar (which listens for "storage" events)
        window.dispatchEvent(new StorageEvent("storage", { key: "authUser" }));

        // Navigate back to homepage
        navigate("/");
      } 

    } catch (err: any) {

      setError(err.message || "Ett fel uppstod vid inloggning.");
      console.error(err);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} aria-label="Logga in">
      {/* Logo */}
      <img
        className="login-logo-inside"
        src="/filmvisarnafooterbilden.png"
        alt="Filmvisarna"
      />

      {/* Header */}
      <h2 className="login-title">Logga in</h2>
       <p className="login-error-message"> {error} </p>

      {/* Email field */}
      <div className="login-field">
        <label htmlFor="login-email">E-postadress</label>
        <input
          id="login-email"
          type="email"
          placeholder="namn@exempel.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      {/* Password field */}
      <div className="login-field">
        <label htmlFor="login-password">Lösenord</label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      {/* Buttons */}
      <div className="login-actions">
        <button type="submit" className="login-button">
          Logga in
        </button>
        <button type="button" className="cancel-button" onClick={handleCancel}>
          Avbryt
        </button>
      </div>
    </form>
  );
}
