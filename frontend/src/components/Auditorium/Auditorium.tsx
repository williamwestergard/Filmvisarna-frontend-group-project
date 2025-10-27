import AuditoriumOne from "./AuditoriumOne";
import AuditoriumTwo from "./AuditoriumTwo";
import { useBooking } from "../../Context/BookingContext";

export default function Auditorium() {
  const { screening } = useBooking();


  if (!screening?.id) return (
    <>
        <section className="auditorium-content">
      <h2>Välj platser</h2>
      <p className="auditorium-placeholder-text">Vänligen välj dag och tid.</p>
      </section>
      </>
  );
  
  const name =
    screening.auditoriumName ??
    (screening.auditoriumId === 1
      ? "Helan"
      : screening.auditoriumId === 2
      ? "Halvan"
      : undefined);

  if (name === "Halvan") return <AuditoriumTwo />;

  // Default: Helan
  return ( 
  <AuditoriumOne />
)
}