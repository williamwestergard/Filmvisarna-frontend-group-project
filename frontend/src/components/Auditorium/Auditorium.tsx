import AuditoriumOne from "./AuditoriumOne";
import AuditoriumTwo from "./AuditoriumTwo";
import { useBooking } from "../../context/BookingContext";

export default function Auditorium() {
  const { screening } = useBooking();

  // Don't show anything until the user has selected a date and time (screening should then be set)
  if (!screening?.id) return null;
  
  const name =
    screening.auditoriumName ??
    (screening.auditoriumId === 1
      ? "Helan"
      : screening.auditoriumId === 2
      ? "Halvan"
      : undefined);

  if (name === "Halvan") return <AuditoriumTwo />;

  // Default: Helan
  return <AuditoriumOne />;
}