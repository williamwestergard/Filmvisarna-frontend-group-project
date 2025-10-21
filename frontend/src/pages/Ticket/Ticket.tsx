import "./Ticket.css";

export default function TicketPage() {
  return (
    <section className="ticket-page">
      <div className="ticket">
        {/* Decorative cutouts on the left/right */}
        <span className="ticket-notch ticket-notch--left" aria-hidden="true" />
        <span className="ticket-notch ticket-notch--right" aria-hidden="true" />

        {/* Grey headerband */}
        <header className="ticket-header" aria-hidden="true" />

        {/* section on side */} 
        <div className="ticket-body"> 
          <div className="ticket-info" aria-hidden="true" /> 
          <aside className="ticket-note" aria-hidden="true" /> 
        </div>

        {/* Perforated divider */}
        <div className="ticket-divider" aria-hidden="true" /> 

        {/* Footer for bookingnumber */}
        <footer className="ticket-footer">
          <div className="ticket-number-slot" aria-hidden="true" />
        </footer>
      </div>
    </section>
  );
}