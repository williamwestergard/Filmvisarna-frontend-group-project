import { useEffect } from "react";
import "./App.css"
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/home";
import About from "./pages/about-us";
import BookingPage from "./pages/booking";
import ConfirmationPage  from "./pages/confirmation";
import Shop from "./pages/shop";
import TicketPage from "./pages/ticket";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Register from "./pages/register";
import MovieList from "./components/MoviesList";
import GradientBottom from "./assets/images/gradient-bottom.png"

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    
    <>
      <Navbar /> 
      
      <main> 
           <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmation-page" element={<ConfirmationPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/" element={<MovieList />} />
         <Route path="/booking/:movieTitle" element={<BookingPage />} />
        </Routes>
      </main>
       <img className="gradient-bottom" src={GradientBottom }/>
          <Footer />
    </>
  );
}

export default App;
