
import "./App.css"
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/AboutUs/AboutUs";
import BookingPage from "./pages/Booking/Booking";
import ConfirmationPage  from "./pages/Confirmation/Confirmation";
import Shop from "./pages/Shop/Shop";
import TicketPage from "./pages/Ticket/Ticket";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import GradientBottom from "./assets/images/gradient-bottom.png"


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
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/confirmation-page" element={<ConfirmationPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
       <img className="gradient-bottom" src={GradientBottom }/>
          <Footer />
    </>
  );
}

export default App;
