import "./Ticket.css";
import { useParams } from "react-router-dom";

export default function TicketPage() {
  const { bookingId } = useParams();

  // Mocked booking data, this will later be replaced with data from the backend
  const booking = {
    movieTitle: "Filmtitel",
    dateLabel: "Tisdag 18 sept.",
    timeLabel: "kl 14:30",
    priceType: "Ordinarie",
    seats: [
      { row: "E", number: 20, auditorium: "Salong 2" },
      { row: "E", number: 21, auditorium: "Salong 2" },
    ],
    bookingCode: bookingId ?? "HÄR KOMMER ETT BOKNINGSNUMMER",
  };

  return (
    <section className="ticket-page">
      <div className="ticket">
        <header className="ticket-header">
          <h1 className="ticket-title">Dina biljetter är bokade!</h1>
        </header>

        {/* bookibg information */}
        <div className="ticket-body">
          <section className="ticket-info-panel" aria-label="Bokningsinformation">
            <h2 className="ti-title">{booking.movieTitle}</h2>
            <dl className="ti-list">
              <div className="ti-row">
                <dt>Dag och datum</dt>
                <dd>{booking.dateLabel}</dd>
              </div>
              <div className="ti-row">
                <dt>Tid</dt>
                <dd>{booking.timeLabel}</dd>
              </div>
              <div className="ti-row">
                <dt>Biljettyp</dt>
                <dd>{booking.priceType}</dd>
              </div>
              <div className="ti-row">
                <dt>Platser</dt>
                <dd>
                  {booking.seats.map((s, i) => (
                    <span key={i} className="ti-seat">
                      Rad {s.row} – stol {s.number} ({s.auditorium})
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          {/* Right panel for information */}
          <aside className="ticket-note" aria-label="Viktig information">
            <p className="note-title">OBS:</p>
            <p className="note-text">
              Visa upp bokningsnumret till personalen i kassan för att använda dina bokade platser.
            </p>
          </aside>
        </div>

        <div className="ticket-divider" aria-hidden="true" />
          {/* Booking number footer */}
        <footer className="ticket-footer">
          <p className="ticket-footer-label">Bokningsnummer:</p>
          <div className="ticket-number-slot">{booking.bookingCode}</div>
        </footer>
      </div>
    </section>
  );
}