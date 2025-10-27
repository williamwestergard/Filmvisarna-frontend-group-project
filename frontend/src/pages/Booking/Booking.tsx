import { BookingProvider } from "../../Context/BookingContext";
import BookingContent from "./BookingContent"; 

function BookingPage() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}

export default BookingPage;
