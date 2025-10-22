import "./Ticket.css";

export default function TicketPage() {
  return (
    <section className="ticket-page">
      <div className="ticket">
        {/* Decorative cutouts on the left/right */}
        <span className="ticket-notch ticket-notch--left" aria-hidden="true" />
        <span className="ticket-notch ticket-notch--right" aria-hidden="true" />

        {/* Grey headerband */}
        <header className="ticket-header">
          <h1 className="ticket-title">Dina biljetter är bokade!</h1>
        </header>

        {/* section on side */}
<div className="ticket-body">
  <div className="ticket-info" aria-hidden="true" />

  <aside className="ticket-note" aria-label="Viktig information">
    <p className="note-title">OBS:</p>
    <p className="note-text">
      Visa upp bokningsnumret till personalen i kassan för att använda dina bokade platser.
    </p>
  </aside>
</div>

        {/* Perforated divider */}
        <div className="ticket-divider" aria-hidden="true" /> 

         {/* Footer for bookingnumber */}
         <footer className="ticket-footer">
          <p className="ticket-footer-label">Bokningsnummer:</p>
          <div className="ticket-number-slot" aria-hidden="true" /> {/* Place for booking number // {bookingId} from backend */}
        </footer>
      </div>
    </section>
  );
}