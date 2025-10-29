import "./auditorium.css";
import AuditoriumScreen from "../../assets/images/auditorium/auditorium-screen.png";
import { useBooking } from "../../Context/BookingContext";

interface Seat {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
  isBooked: number;
}

interface AuditoriumProps {
  seats: Seat[];
  bookedSeats: number[];
}

function useSeatLogic(seats: Seat[], bookedSeats: number[]) {
  const { selectedSeats, toggleSeat, totalTickets } = useBooking();

  function onToggle(row: string, number: number) {
    const seat = seats.find(
      (s) => s.rowLabel === row && s.seatNumber === number
    );
    if (!seat) {
      console.error(`❌ Kunde inte hitta seatId för ${row}-${number}`);
      return;
    }

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
    const seat = seats.find(
      (s) => s.rowLabel === row && s.seatNumber === number
    );
    if (!seat) return false;
    return selectedSeats.some((s) => s.seatId === seat.seatId);
  }

  function isOccupied(row: string, number: number) {
    const seat = seats.find(
      (s) => s.rowLabel === row && s.seatNumber === number
    );
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

export default function AuditoriumOne({ seats, bookedSeats }: AuditoriumProps) {
  const { onToggle, isSelected, isOccupied, totalTickets, selectedSeats } =
    useSeatLogic(seats, bookedSeats);

  const maxReached = totalTickets > 0 && selectedSeats.length >= totalTickets;

  // --- Group seats by row ---
  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.rowLabel]) acc[seat.rowLabel] = [];
    acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort seat numbers within each row
  Object.keys(rowsMap).forEach((r) =>
    rowsMap[r].sort((a, b) => a.seatNumber - b.seatNumber)
  );

  // Define top and bottom row groups
  const rowsTop = ["A", "B", "C", "D"].map((label) => ({
    label,
    seats: rowsMap[label]?.map((s) => s.seatNumber) || [],
  }));

  const rowsBottom = ["E", "F", "G", "H"].map((label) => ({
    label,
    seats: rowsMap[label]?.map((s) => s.seatNumber) || [],
  }));

  // --- Render helper for row sections ---
  const renderRow = (rowLabel: string, seatNumbers: number[]) => (
    <section className={`auditorium-row row-${rowLabel}`}>
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
    <section className="auditorium-content">
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
            {rowsTop.map((row, i) => (
              <div key={i} className={`auditorium-top-row row-${row.label}`}>
                {renderRow(row.label, row.seats)}
              </div>
            ))}

            {rowsBottom.map((row, i) => (
              <div key={i} className={`auditorium-bottom-row row-${row.label}`}>
                {renderRow(row.label, row.seats)}
              </div>
            ))}
          </section>
        </article>
      </section>
    </section>
  );
}
