import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for cancel button to go back to home page
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



function RegisterForm({ onRegister }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate(); // ← hook for navigation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Lösenorden matchar inte!");
      return;
    }

    const userData = { firstName, lastName, phone, email, password };
    console.log("Skapa Konto:", userData);
    onRegister?.(userData);
  };

  const handleCancel = () => {
    navigate("/"); // ← goes back to home page
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Förnamn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      <input type="text" placeholder="Efternamn" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      <input type="tel" placeholder="Telefonnummer" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input type="email" placeholder="E-postadress" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Upprepa Lösenord" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

      <button type="submit" className="register-button">Skapa Konto</button>
      <button type="button" className="cancel-button" onClick={handleCancel}>Avbryt</button>
    </form>
  );
}

export default RegisterForm;