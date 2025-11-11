import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/AboutUs/AboutUs";
import BookingPage from "./pages/Booking/Booking";
import ConfirmationPage from "./pages/Confirmation/Confirmation";
import Shop from "./pages/Shop/Shop";
import TicketPage from "./pages/Ticket/Ticket";
import Footer from "./components/Footer/Footer";
import Register from "./pages/Register/Register";
import Discover from "./pages/Discover/Discover";
import MyPages from "./pages/MyPages/MyPages";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";

// Scrolls to top when route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Main application entry point
function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <Navbar
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />
      <main>
        <ScrollToTop />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/om-oss" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/upptack" element={<Discover />} />

          {/* Booking and confirmation routes */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/:movieTitle" element={<BookingPage />} />
          <Route path="/confirmation/:bookingUrl" element={<ConfirmationPage />} />
          <Route path="/ticket/:bookingUrl" element={<TicketPage />} />

          {/* Authentication routes (keep working if navigates here directly) */}
          <Route path="/register" element={<Register />} />

          {/* Protected user page (requires login) */}
          <Route
            path="/mina-sidor"
            element={
              <ProtectedRoute>
                <MyPages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* LOGIN MODAL */}
      <LoginModal
        open={loginOpen}
        onRequestClose={() => setLoginOpen(false)}
      />
      {/* REGISTER MODAL */}
      <RegisterModal
        open={registerOpen}
        onRequestClose={() => setRegisterOpen(false)}
      />

      <Footer />
    </>
  );
}

export default App;