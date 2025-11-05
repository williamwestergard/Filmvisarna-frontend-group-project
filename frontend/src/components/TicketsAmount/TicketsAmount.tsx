import "./ticketsAmount.css";
import { useState, useEffect } from "react";
import { useBooking } from "../../Context/BookingContext";

export default function TicketsAmount() {
  const {
    counts,
    increment,
    decrement,
    childAllowed,
    totalTickets,
    availableSeatsCount,
  } = useBooking();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper: prevent incrementing beyond available seats
  const safeIncrement = (type: "adult" | "senior" | "child") => {
    if (totalTickets >= availableSeatsCount) {
      setErrorMessage("Det finns inte så många lediga platser på vald visning.");
      return;
    }
    increment(type);
  };

  // Delete error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <section className="tickets-amount-content">
      <h2>Välj antal biljetter</h2>

     

      {/* ordinary */}
      <section className="tickets-amount-container">
        <section className="tickets-amount-type">
          <p>Ordinarie</p>
          <p className="tickets-amount-type-reduced-price">140 kr</p>
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
            onClick={() => safeIncrement("adult")}
          >
            +
          </article>
        </section>
      </section>

      {/* senior */}
      <section className="tickets-amount-container">
        <section className="tickets-amount-type">
          <p>Pensionär</p>
          <p className="tickets-amount-type-reduced-price">120 kr</p>
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
            onClick={() => safeIncrement("senior")}
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
            <p className="tickets-amount-type-reduced-price">80 kr</p>
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
              onClick={() => safeIncrement("child")}
            >
              +
            </article>
          </section>
        </section>
      )}
        {/* Errormessage) */}
       {errorMessage && <p className="tickets-error-message">{errorMessage}</p>}
    </section>
  );
}