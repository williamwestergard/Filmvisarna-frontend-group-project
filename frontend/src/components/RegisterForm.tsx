import { useState } from "react";
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

function RegisterForm({ onRegister }: RegisterFormProps) { {/* { onRegister } is destructuring, it pulls the onLogin prop out of the props object for easier use inside the component */}
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => { {/* called when user clicks submit button */}
    e.preventDefault();  {/*prevents browser from reloading page which is default form behavior */}

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      alert("Fyll i alla obligatoriska fält!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Lösenorden matchar inte!");
      return;
    }

    // Call the required function with structured data
    onRegister({ firstName, lastName, phone, email, password });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Förnamn"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Efternamn"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Telefonnummer"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
      <input
        type="password"
        placeholder="Upprepa Lösenord"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit" className="register-button">
        Skapa Konto
      </button>
    </form>
  );
}

export default RegisterForm;