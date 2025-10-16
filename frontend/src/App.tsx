// Fil: App.tsx

import "./App.css"
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home";
import About from "./pages/about-us";
import BookingPage from "./pages/booking";
import ConfirmationPage  from "./pages/confirmation";
import Shop from "./pages/shop";
import TicketPage from "./pages/ticket";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Register from "./pages/register";


function App() {
  return (
    
    <>
      <Navbar /> 
      
      <main> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/booking-page" element={<BookingPage />} />
          <Route path="/confirmation-page" element={<ConfirmationPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
          <Footer />
    </>
  );
}

export default App;
