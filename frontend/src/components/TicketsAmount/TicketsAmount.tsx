import "./ticketsAmount.css";
import { useBooking } from "../../context/BookingContext";

export default function TicketsAmount() {
  const {
    counts,
    prices,
    increment,
    decrement,
    childAllowed,
  } = useBooking();

  return (
    <section className="tickets-amount-content">
      <h2>Välj antal biljetter</h2>

      {/* Ordinarie */}
      <section className="tickets-amount-container">
        <section className="tickets-amount-type">
          <p>Ordinarie</p>
          <p className="tickets-amount-type-price">{prices.adult} kr</p>
        </section>

        <section className="tickets-amount-add-amount-container">
          <button
            type="button"
            className="ticket-amount-button minus"
            aria-label="Minska antal ordinarie"
            onClick={() => decrement("adult")}
          >
            −
          </button>

          <span className="tickets-amount-number" aria-live="polite">
            {counts.adult}
          </span>

          <button
            type="button"
            className="ticket-amount-button plus"
            aria-label="Öka antal ordinarie"
            onClick={() => increment("adult")}
          >
            +
          </button>
        </section>
      </section>

      {/* senior/pensionär */}
      <section className="tickets-amount-container">
        <section className="tickets-amount-type">
          <p>Pensionär</p>
          <p className="tickets-amount-type-reduced-price">10% rabatt</p>
          <p className="tickets-amount-type-price">{prices.senior} kr</p>
        </section>

        <section className="tickets-amount-add-amount-container">
          <button
            type="button"
            className="ticket-amount-button minus"
            aria-label="Minska antal pensionär"
            onClick={() => decrement("senior")}
          >
            −
          </button>

          <span className="tickets-amount-number" aria-live="polite">
            {counts.senior}
          </span>

          <button
            type="button"
            className="ticket-amount-button plus"
            aria-label="Öka antal pensionär"
            onClick={() => increment("senior")}
          >
            +
          </button>
        </section>
      </section>

      {/* Child – only shown if the movie is suitable for children */}
      {childAllowed && (
        <section className="tickets-amount-container">
          <section className="tickets-amount-type">
            <p>Barn</p>
            <p className="tickets-amount-type-price">{prices.child} kr</p>
          </section>

          <section className="tickets-amount-add-amount-container">
            <button
              type="button"
              className="ticket-amount-button minus"
              aria-label="Minska antal barn"
              onClick={() => decrement("child")}
            >
              −
            </button>

            <span className="tickets-amount-number" aria-live="polite">
              {counts.child}
            </span>

            <button
              type="button"
              className="ticket-amount-button plus"
              aria-label="Öka antal barn"
              onClick={() => increment("child")}
            >
              +
            </button>
          </section>
        </section>
      )}
    </section>
  );
}