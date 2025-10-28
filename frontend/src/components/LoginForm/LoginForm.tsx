import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logga in:", { email, password });
    onLogin?.(email, password);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {/* Filmvisarna-logga i toppen av rutan */}
      <img
        src="/filmvisarnafooterbilden.png"
        alt="Filmvisarna logotyp"
        className="login-logo-inside"
      />

      <input
        type="email"
        placeholder="E-postadress"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="login-button">
        Logga in
      </button>

      <button type="button" className="cancel-button" onClick={handleCancel}>
        Avbryt
      </button>
    </form>
  );
}

export default LoginForm;