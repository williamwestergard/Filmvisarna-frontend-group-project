import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For cancel button to go back to home page
import "./LoginForm.css";

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // hook, initialize the navigate function

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logga in:", { email, password });
    onLogin?.(email, password);
  };

  const handleCancel = () => {
    navigate("/"); // takes us back to home page
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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