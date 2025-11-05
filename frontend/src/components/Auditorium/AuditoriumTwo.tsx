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

function useSeatLogic(seats: Seat[], bookedSeats: number[]) {
  const { selectedSeats, toggleSeat, totalTickets } = useBooking();

  function onToggle(row: string, number: number) {
    const seat = seats.find((s) => s.rowLabel === row && s.seatNumber === number);
    if (!seat) return;

    const seatId = seat.seatId;
    const alreadySelected = selectedSeats.some((s) => s.seatId === seatId);

    if (alreadySelected) {
      toggleSeat({ seatId, row, number, auditorium: "Helan" });
      return;
    }

    if (totalTickets <= 0 || selectedSeats.length >= totalTickets) return;
    toggleSeat({ seatId, row, number, auditorium: "Helan" });
  }

  function isSelected(row: string, number: number) {
    const seat = seats.find((s) => s.rowLabel === row && s.seatNumber === number);
    if (!seat) return false;
    return selectedSeats.some((s) => s.seatId === seat.seatId);
  }

  function isOccupied(row: string, number: number) {
    const seat = seats.find((s) => s.rowLabel === row && s.seatNumber === number);
    if (!seat) return false;
    return bookedSeats.includes(seat.seatId);
  }

  return { onToggle, isSelected, isOccupied, totalTickets, selectedSeats };
}

type SeatBoxProps = {
  row: string;
  number: number;
  onClick: () => void;
  selected: boolean;
  occupied: boolean;
  disabled: boolean;
};

function SeatBox({ onClick, selected, occupied, disabled }: SeatBoxProps) {
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

export default function AuditoriumOne({ screeningId }: AuditoriumProps) {
  const { setAvailableSeatsCount } = useBooking();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    fetchSeats();
    intervalId = setInterval(fetchSeats, 60000); // refresh every 60s
    return () => clearInterval(intervalId);
  }, [screeningId, setAvailableSeatsCount]);

  const { onToggle, isSelected, isOccupied, totalTickets, selectedSeats } =
    useSeatLogic(seats, bookedSeats);

  const maxReached = totalTickets > 0 && selectedSeats.length >= totalTickets;

  // Group seats by row
  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.rowLabel]) acc[seat.rowLabel] = [];
    acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  Object.keys(rowsMap).forEach((r) =>
    rowsMap[r].sort((a, b) => a.seatNumber - b.seatNumber)
  );

  // Top & bottom rows
  const rowsTop = ["A", "B", "C", "D"].map((label) => ({
    label,
    seats: rowsMap[label]?.map((s) => s.seatNumber) || [],
  }));

  const rowsBottom = ["E", "F", "G", "H"].map((label) => ({
    label,
    seats: rowsMap[label]?.map((s) => s.seatNumber) || [],
  }));

  const renderRow = (rowLabel: string, seatNumbers: number[]) => (
    <section className={`auditorium-row row-${rowLabel}`} key={rowLabel}>
      <div className="seat-placeholder" />
      {seatNumbers.map((n) => {
        const selected = isSelected(rowLabel, n);
        const occupied = isOccupied(rowLabel, n);
        const disabled = occupied || (maxReached && !selected);
        return (
          <SeatBox
            key={`${rowLabel}${n}`}
            row={rowLabel}
            number={n}
            selected={selected}
            occupied={occupied}
            disabled={disabled}
            onClick={() => onToggle(rowLabel, n)}
          />
        );
      })}
      <div className="seat-placeholder" />
    </section>
  );

  return (
    <section className="auditorium-two-content">
      <p className="auditorium-text">Salong - Helan</p>
      <h2>Välj platser</h2>

      <section className="auditorium-container">
        <article className="auditorium">
          <img
            className="auditorium-screen"
            src={AuditoriumScreen}
            alt="Bioduk"
          />

          <section className="auditorium-seats-container">
            {loading ? (
              <div className="auditorium-seats-loading">
                <div className="auditorium-loader"></div>
                <p>Laddar platser...</p>
              </div>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                {rowsTop.map((row) => (
                  <div
                    key={row.label}
                    className={`auditorium-top-row row-${row.label}`}
                  >
                    {renderRow(row.label, row.seats)}
                  </div>
                ))}

                {rowsBottom.map((row) => (
                  <div
                    key={row.label}
                    className={`auditorium-bottom-row row-${row.label}`}
                  >
                    {renderRow(row.label, row.seats)}
                  </div>
                ))}
              </>
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
