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
      toggleSeat({ seatId, row, number, auditorium: "Halvan" });
      return;
    }

    if (totalTickets <= 0 || selectedSeats.length >= totalTickets) return;
    toggleSeat({ seatId, row, number, auditorium: "Halvan" });
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

export default function AuditoriumTwo({ seats, bookedSeats }: AuditoriumProps) {
  const { onToggle, isSelected, isOccupied, totalTickets, selectedSeats } =
    useSeatLogic(seats, bookedSeats);

  const maxReached = totalTickets > 0 && selectedSeats.length >= totalTickets;

  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.rowLabel]) acc[seat.rowLabel] = [];
    acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  Object.keys(rowsMap).forEach((r) =>
    rowsMap[r].sort((a, b) => a.seatNumber - b.seatNumber)
  );

  return (
    <section className="auditorium-content">
      <p className="auditorium-text">Salong - Halvan</p>
      <h2>Välj platser</h2>

      <section className="auditorium-container">
        <article className="auditorium">
          <img className="auditorium-screen" src={AuditoriumScreen} alt="Bioduk" />
          <section className="auditorium-seats-container">
            {Object.entries(rowsMap).map(([rowLabel, rowSeats]) => (
              <section key={rowLabel} className="auditorium-row">
                {rowSeats.map((seat) => {
                  const selected = isSelected(seat.rowLabel, seat.seatNumber);
                  const occupied = isOccupied(seat.rowLabel, seat.seatNumber);
                  const disabled = occupied || (maxReached && !selected);
                  return (
                    <SeatBox
                      key={seat.seatId}
                      row={seat.rowLabel}
                      number={seat.seatNumber}
                      selected={selected}
                      occupied={occupied}
                      disabled={disabled}
                      onClick={() =>
                        onToggle(seat.rowLabel, seat.seatNumber)
                      }
                    />
                  );
                })}
              </section>
            ))}
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
