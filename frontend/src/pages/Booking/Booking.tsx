
import BookingPriceCard from "../../components/BookingPriceCard/BookingPriceCard";
import MovieBooking from "../../components/Movies/MovieBooking";
import "./booking.css";



    function BookingPage() {


  return (
    <>
    <main className="booking-page-content">
<MovieBooking/>
<article className="booking-price-card-top">
      <BookingPriceCard />
      </article>
</main>
</>

  )

 }

export default BookingPage