import { useBooking } from "../../context/BookingContext";

export default function BookingPriceCard() {
  const { counts, prices, totalAmount, childAllowed } = useBooking();

  // Show the child row only if the movie allows children or if there are already selected child tickets
  const showChild = childAllowed || counts.child > 0;

  return (
    <section className="booking-price-card-content">
      <article className="booking-price-card-customer-container">
        <p>Ordinarie:</p>
        <article className="booking-price-card-price-container">
          <p>{counts.adult} st</p>
          <p>{counts.adult * prices.adult} kr</p>
        </article>
      </article>
      
      <article className="booking-price-card-customer-container">
        <p>Pensionär:</p>
        <article className="booking-price-card-price-container">
          <p>{counts.senior} st</p>
          <p>{counts.senior * prices.senior} kr</p>
        </article>
      </article>
      
      {showChild && ( // Display child row conditionally
        <article className="booking-price-card-customer-container">
          <p>Barn:</p>
          <article className="booking-price-card-price-container">
            <p>{counts.child} st</p>
            <p>{counts.child * prices.child} kr</p>
          </article>
        </article>
      )}

      <p className="booking-price-card-total-price">Summa: {totalAmount} kr</p>
    </section>
  );
}