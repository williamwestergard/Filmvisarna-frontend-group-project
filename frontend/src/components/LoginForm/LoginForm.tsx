import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { LoginFormApi } from "../../api/LoginFormApi";

type LoginFormProps = {
  onClose?: () => void; // optional: close modal when provided
};

export default function LoginForm({ onClose }: LoginFormProps) {
  // Controlled form fields for user credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigation hook for redirecting after login
  const navigate = useNavigate();

  // Error message for user feedback
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      // Send login request to backend API
      const result = await LoginFormApi({
        email,
        password,
      });

      if (result.ok) {
        // Save user info and token locally for session persistence
        localStorage.setItem("authUser", JSON.stringify(result.user));
        localStorage.setItem("authToken", result.token);

        // Notify other components (e.g., Navbar) of login
        window.dispatchEvent(new StorageEvent("storage", { key: "authUser" }));

        // Close modal (if shown) and redirect user to homepage after login
        onClose?.();
        navigate("/");
      } else {
        // Handle unsuccessful login (wrong credentials)
        setError("Felaktig e-post eller lösenord.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Ett fel uppstod vid inloggning.");
    }
  }

  function handleCancel() {
    // If used inside a modal, close it; otherwise keep old behavior
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} aria-label="Logga in">
      <img
        className="login-logo-inside"
        src="/filmvisarnafooterbilden.png"
        alt="Filmvisarna"
      />

      <h2 className="login-title">Logga in</h2>
      {error && <p className="login-error-message">{error}</p>}

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