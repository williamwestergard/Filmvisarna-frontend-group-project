import { useBooking } from "../../context/BookingContext";

export default function BookingPriceCard() {
  const { counts, prices, totalAmount, childAllowed } = useBooking();

  const rows = [
    { key: "adult" as const, label: "Ordinarie", count: counts.adult, price: prices.adult },
    { key: "senior" as const, label: "Pensionär", count: counts.senior, price: prices.senior },
    //  only if childAllowed
    ...(childAllowed
      ? [{ key: "child" as const, label: "Barn", count: counts.child, price: prices.child }]
      : []),
  ];
// 
  return (
    <section className="booking-price-card-content">
      {rows.map((r) => (
        <article key={r.key} className="booking-price-card-customer-container">
          <p>{r.label}:</p>
          {/*logic to show count and price*/}
          <article className="booking-price-card-price-container">
            <p>{r.count} st</p>
            <p>{r.count * r.price} kr</p>
          </article>
        </article>
      ))}
      <p className="booking-price-card-total-price">Summa: {totalAmount} kr</p>
    </section>
  );
}