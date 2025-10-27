import { useBooking } from "../../Context/BookingContext";

export default function BookingPriceCard() {
  const { counts, prices, totalAmount, childAllowed } = useBooking();

  // Show the child row only if there are selected child tickets
  const showChild = counts.child > 0 && childAllowed;

  // Show the senior row only if there are selected senior tickets
  const showSenior = counts.senior > 0;

  return (
    <section className="booking-price-card-content">
      {/* Always show adult row */}
      <article className="booking-price-card-customer-container">
        <p>Ordinarie:</p>
        <article className="booking-price-card-price-container">
          <p>{counts.adult} st</p>
          <p>{counts.adult * prices.adult} kr</p>
        </article>
      </article>

      {/* Show only when at least one senior ticket is added */}
      {showSenior && (
        <article className="booking-price-card-customer-container">
          <p>Pensionär:</p>
          <article className="booking-price-card-price-container">
            <p>{counts.senior} st</p>
            <p>{counts.senior * prices.senior} kr</p>
          </article>
        </article>
      )}

      {/* Show only when at least one child ticket is added */}
      {showChild && (
        <article className="booking-price-card-customer-container">
          <p>Barn:</p>
          <article className="booking-price-card-price-container">
            <p>{counts.child} st</p>
            <p>{counts.child * prices.child} kr</p>
          </article>
        </article>
      )}

      <span className="booking-price-card-underline"></span>

      <p className="booking-price-card-total-price">
        Summa: {totalAmount} kr
      </p>
    </section>
  );
}
