
import "./BookingTimeout.css"

type Props = {
  open: boolean;
  onReload: () => void;
};

export default function SimpleBookingTimeoutModal({ open, onReload }: Props) {
  if (!open) return null;
  return (

   <section className="booking-timeout-overlay">
  <div className="booking-timeout-blurred-background"></div>

  <div
    className="booking-timeout-content"
    role="dialog"
    aria-modal="true"
    aria-label="Sessionen gick ut"
  >
    <h2 className="booking-timeout-h2">Sessionen gick ut</h2>
    <article className="booking-timeout-underline"></article>
    <p className="booking-timeout-p">
      Du har väntat mer än 10 minuter. För att visa korrekta platser och priser
      behöver sidan uppdateras.
    </p>
    <div>
      <button className="booking-timeout-button" onClick={onReload}>
        Uppdatera sidan
      </button>
    </div>
  </div>
</section>

  )
};
