// src/components/Auditorium/AuditoriumTwo.tsx
import "./auditorium.css";
import { useEffect, useState } from "react";
import AuditoriumScreen from "../../assets/images/auditorium/auditorium-screen.png";
import { useBooking } from "../../Context/BookingContext";

interface Seat {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
  isBooked: number;
}

interface AuditoriumProps {
  screeningId: number;
}

// Reusable seat box component
function SeatBox({
  onClick,
  selected,
  occupied,
  disabled,
}: {
  onClick: () => void;
  selected: boolean;
  occupied: boolean;
  disabled: boolean;
}) {
  const className = [
    "auditorium-seat",
    selected ? "is-selected" : "",
    occupied ? "is-occupied" : "",
    disabled && !selected ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      onClick={!disabled ? onClick : undefined}
      aria-disabled={disabled}
      title={occupied ? "Upptagen plats" : undefined}
    >
      {occupied ? "✖" : ""}
    </article>
  );
}

export default function AuditoriumTwo({ screeningId }: AuditoriumProps) {
  const { totalTickets, selectedSeats, toggleSeat, setAvailableSeatsCount } =
    useBooking();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Loads seat data for the given screening and refreshes periodically
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    async function fetchSeats() {
      setLoading(true);
      try {
        const res = await fetch(`/api/screenings/${screeningId}/seats`);
        if (!res.ok) throw new Error("Failed to load seats");
        const data = await res.json();
        if (!data.ok) throw new Error("Invalid response");

        setSeats(data.seats);

        const booked = data.seats
          .filter((s: Seat) => s.isBooked === 1)
          .map((s: Seat) => s.seatId);
        setBookedSeats(booked);

        setAvailableSeatsCount(data.seats.length - booked.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Kunde inte hämta bokade platser.");
      } finally {
        setLoading(false);
      }
    }
  }
}

    fetchSeats();
    intervalId = setInterval(fetchSeats, 60000);
    return () => clearInterval(intervalId);
  }, [screeningId, setAvailableSeatsCount]);

  // Creates a map of rows so seats can be rendered in correct row order
  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.rowLabel]) acc[seat.rowLabel] = [];
    acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  Object.keys(rowsMap).forEach((r) =>
    rowsMap[r].sort((a, b) => a.seatNumber - b.seatNumber)
  );

  // Automatic seat selection logic based on row priority and center proximity
  useEffect(() => {
    if (totalTickets <= 0 || seats.length === 0) return;

    // Clear previous auto-selected seats
    selectedSeats.forEach((s) =>
      toggleSeat({
        seatId: s.seatId,
        row: s.row,
        number: s.number,
        auditorium: "Halvan",
      })
    );

    // Priority order for this auditorium layout
    const rowOrder = ["C", "D", "B", "E", "A", "F"];

    let bestGroup: Seat[] = [];

    for (const row of rowOrder) {
      const rowSeats = rowsMap[row];
      if (!rowSeats) continue;

      const free = rowSeats.filter((s) => !bookedSeats.includes(s.seatId));
      if (free.length < totalTickets) continue;

      // Identify connected free seat groups
      const groups: Seat[][] = [];
      let currentGroup: Seat[] = [];

      for (let i = 0; i < rowSeats.length; i++) {
        const seat = rowSeats[i];
        const isFree = !bookedSeats.includes(seat.seatId);

        if (isFree) {
          currentGroup.push(seat);
        } else if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
          currentGroup = [];
        }
      }
      if (currentGroup.length > 0) groups.push([...currentGroup]);

      const validGroups = groups.filter((g) => g.length >= totalTickets);
      if (validGroups.length === 0) continue;

      // Select the group closest to row center
      const firstNum = rowSeats[0].seatNumber;
      const lastNum = rowSeats[rowSeats.length - 1].seatNumber;
      const mid = (firstNum + lastNum) / 2;

      let bestDist = Infinity;
      let closestGroup: Seat[] = [];

      for (const g of validGroups) {
        for (let start = 0; start <= g.length - totalTickets; start++) {
          const sub = g.slice(start, start + totalTickets);
          const subMid =
            sub.reduce((sum, s) => sum + s.seatNumber, 0) / sub.length;
          const dist = Math.abs(mid - subMid);
          if (dist < bestDist) {
            bestDist = dist;
            closestGroup = sub;
          }
        }
      }

      if (closestGroup.length > 0) {
        bestGroup = closestGroup;
        break;
      }
    }

    // Select the final seat group
    if (bestGroup.length > 0) {
      bestGroup.forEach((seat) => {
        toggleSeat({
          seatId: seat.seatId,
          row: seat.rowLabel,
          number: seat.seatNumber,
          auditorium: "Halvan",
        });
      });
    }
  }, [totalTickets, seats]);

  const maxReached =
    totalTickets > 0 && selectedSeats.length >= totalTickets;

  // Renders a single full row of seats
  const renderRow = (rowLabel: string, rowSeats: Seat[]) => (
    <section className={`auditorium-row row-${rowLabel}`} key={rowLabel}>
      {rowSeats.map((seat) => {
        const selected = selectedSeats.some((s) => s.seatId === seat.seatId);
        const occupied = bookedSeats.includes(seat.seatId);
        const disabled = occupied || (maxReached && !selected);
        return (
          <SeatBox
            key={seat.seatId}
            selected={selected}
            occupied={occupied}
            disabled={disabled}
            onClick={() =>
              toggleSeat({
                seatId: seat.seatId,
                row: seat.rowLabel,
                number: seat.seatNumber,
                auditorium: "Halvan",
              })
            }
          />
        );
      })}
    </section>
  );

  return (
    <section className="auditorium-one-content">
      <p className="auditorium-text">Salong - Halvan</p>
      <h2>Välj platser</h2>

      <section className="auditorium-container">
        <article className="auditorium">
          <img
            className="auditorium-screen"
            src={AuditoriumScreen}
            alt="Bioduk"
          />
       <section className="auditorium-seats-container">
          {error ? (
  <p>{error}</p>
) : (
              Object.entries(rowsMap)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([label, rowSeats]) => renderRow(label, rowSeats))
            )}
          </section>
        </article>
      </section>

      <article className="auditorium-information-bottom">
        <article className="auditorium-information-bottom-user-seat-container">
          <article className="auditorium-information-bottom-user-seat"></article>
          <p>Ditt val</p>
        </article>

        <article className="auditorium-information-bottom-occupied-seatcontainer">
          <article className="auditorium-information-bottom-occupied-seat"></article>
          <p>Upptagen</p>
        </article>
      </article>
    </section>
  );
}
