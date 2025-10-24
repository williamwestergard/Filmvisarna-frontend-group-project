import "./ticketsAmount.css";
import { useBooking } from "../../context/BookingContext";

export default function TicketsAmount() {
  const { counts, increment, decrement, childAllowed } = useBooking();

  return (
    <section className="tickets-amount-content">
      <h2>Välj antal biljetter</h2>

      {/* ordinary */}
      <section className="tickets-amount-container">
        <section className="tickets-amount-type">
          <p>Ordinarie</p>
        </section>

        <section className="tickets-amount-add-amount-container">
          <article
            className="ticket-amount-button minus"
            onClick={() => decrement("adult")}
          >
            -
          </article>
          <span className="tickets-amount-number">{counts.adult}</span>
          <article
            className="ticket-amount-button plus"
            onClick={() => increment("adult")}
          >
            +
          </article>
        </section>
      </section>

      {/* senior */}
      <section className="tickets-amount-container">
        <section className="tickets-amount-type">
          <p>Pensionär</p>
          <p className="tickets-amount-type-reduced-price">10% rabatt</p>
        </section>

        <section className="tickets-amount-add-amount-container">
          <article
            className="ticket-amount-button minus"
            onClick={() => decrement("senior")}
          >
            -
          </article>
          <span className="tickets-amount-number">{counts.senior}</span>
          <article
            className="ticket-amount-button plus"
            onClick={() => increment("senior")}
          >
            +
          </article>
        </section>
      </section>

      {/* Children – only displayed if the movie is child-allowed */}
      {childAllowed && (
        <section className="tickets-amount-container">
          <section className="tickets-amount-type">
            <p>Barn</p>
          </section>
         {/* Children ticket control */}
          <section className="tickets-amount-add-amount-container">
            <article
              className="ticket-amount-button minus"
              onClick={() => decrement("child")}
            >
              -
            </article>
            <span className="tickets-amount-number">{counts.child}</span>
            <article
              className="ticket-amount-button plus"
              onClick={() => increment("child")}
            >
              +
            </article>
          </section>
        </section>
      )}
    </section>
  );
}