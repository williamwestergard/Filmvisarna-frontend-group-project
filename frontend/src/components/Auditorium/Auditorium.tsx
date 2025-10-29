import { useEffect, useState } from "react";
import AuditoriumOne from "./AuditoriumOne";
import AuditoriumTwo from "./AuditoriumTwo";
import { useBooking } from "../../Context/BookingContext";

interface ApiSeat {
  seatId: number;
  auditoriumId: number;
  rowLabel: string;
  seatNumber: number;
  isBooked: number;
}

export default function Auditorium() {
  const { screening } = useBooking();
  const [seats, setSeats] = useState<ApiSeat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!screening?.id) return;
    let intervalId: ReturnType<typeof setInterval>;

    async function fetchSeats() {
      setLoading(true);
      try {
        if (!screening) throw new Error("Ingen visning vald ännu.");
const res = await fetch(`/api/screenings/${screening.id}/seats`);
        if (!res.ok) throw new Error("Failed to load seats");
        const data = await res.json();
        if (!data.ok) throw new Error("Invalid response");

        setSeats(data.seats);
        const booked = data.seats
          .filter((seat: ApiSeat) => seat.isBooked === 1)
          .map((seat: ApiSeat) => seat.seatId);
        setBookedSeats(booked);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Kunde inte hämta bokade platser.");
      } finally {
        setLoading(false);
      }
    }

    fetchSeats();
    intervalId = setInterval(fetchSeats, 10000);
    return () => clearInterval(intervalId);
  }, [screening?.id]);

  if (!screening?.id)
    return (
      <section className="auditorium-content">
        <h2>Välj platser</h2>
        <p className="auditorium-placeholder-text">Vänligen välj dag och tid.</p>
      </section>
    );

  if (loading)
    return (
      <section className="auditorium-content">
        <p className="auditorium-placeholder-text">Laddar säten...</p>
      </section>
    );

  if (error)
    return (
      <section className="auditorium-content">
        <p className="auditorium-placeholder-text">{error}</p>
      </section>
    );

  const name =
    screening.auditoriumName ??
    (screening.auditoriumId === 1
      ? "Helan"
      : screening.auditoriumId === 2
      ? "Halvan"
      : undefined);

  if (name === "Halvan")
    return <AuditoriumTwo seats={seats} bookedSeats={bookedSeats} />;
  return <AuditoriumOne seats={seats} bookedSeats={bookedSeats} />;
}
