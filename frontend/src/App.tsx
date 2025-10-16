
import "./App.css"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about-us";
import BookingPage from "./pages/booking";
import ConfirmationPage  from "./pages/confirmation";
import Shop from "./pages/shop";
import TicketPage from "./pages/ticket";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/shop" element={<Shop />} />


      <Route path="/booking-page" element={<BookingPage />} />
        <Route path="/confirmation-page" element={<ConfirmationPage />} />
          <Route path="/ticket" element={<TicketPage />} />
      
    </Routes>
  );
}

export default App;