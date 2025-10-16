import { useState } from "react";
import "./LoginForm.css";

interface LoginFormProps {
    onLogin: (data: { email: string; password: string }) => void; 
    // onLogin is required, takes an object with email and password, returns nothing
}

function LoginForm({ onLogin }: LoginFormProps) { 
    // { onLogin } is destructuring, it pulls the onLogin prop out of the props object for easier use inside the component
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => { 
        // called when user clicks submit button
        e.preventDefault(); 
        // prevents browser from reloading page which is default form behavior

        // Basic validation before calling onLogin
        if (!email || !password) {
            alert("Fyll i både e-postadress och lösenord!");
            return;
        }

        console.log("Logga in:", { email, password });
        onLogin({ email, password }); 
        // calls required onLogin function with structured data
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="E-postadress"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                // e.target.value updates state whenever the user types
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
        </form>
    );
}

export default LoginForm;