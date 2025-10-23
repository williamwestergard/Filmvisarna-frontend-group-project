import { BookingProvider } from "../../context/BookingContext";
import BookingContent from "./BookingContent"; 

function BookingPage() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}

export default BookingPage;
