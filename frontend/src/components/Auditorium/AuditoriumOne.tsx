import "./auditorium.css";
import AuditoriumScreen from "../../assets/images/auditorium/auditorium-screen.png";
import { useBooking } from "../../context/BookingContext";

/** Create seat ID so we can toggle in a stable way. */
const makeSeatId = (rowIndex: number, seatNo: number) =>
  1000 + rowIndex * 100 + seatNo;
// Example: Row A (65) seat 1 => 1000 + 6500 + 1 = 7501
function useSeatLogic() {
  const { selectedSeats, toggleSeat, totalTickets } = useBooking();
  // Handle toggling a seat
  function onToggle(row: string, number: number) {
    const seatId = makeSeatId(row.charCodeAt(0), number);
    const alreadySelected = selectedSeats.some((s) => s.seatId === seatId);

    // Always allow deselecting an already selected seat
    if (alreadySelected) {
      toggleSeat({ seatId, row, number, auditorium: "Helan" });
      return;
    }

    // If attempting to select a new seat: stop if the maximum number of tickets has been reached
    if (totalTickets <= 0) return;
    if (selectedSeats.length >= totalTickets) return;

    toggleSeat({ seatId, row, number, auditorium: "Helan" });
  }
  // Check if a seat is selected
  function isSelected(row: string, number: number) {
    const seatId = makeSeatId(row.charCodeAt(0), number);
    return selectedSeats.some((s) => s.seatId === seatId);
  }

  // No occupied seats hardcoded – connect to backend later if needed
  function isOccupied(_row: string, _num: number) {
    return false;
  }
  // Return the seat logic functions and data
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
// SeatBox component - representing an individual seat
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
      role="button"
      title={
        disabled && !selected ? "Du har redan valt max antal platser" : undefined
      }
    />
  );
}
// AuditoriumOne component -representing the seating layout for "Helan"
export default function AuditoriumOne() {
  const { onToggle, isSelected, isOccupied, totalTickets, selectedSeats } =
    useSeatLogic();

  // Layout according to your existing markup:
  // First 4 rows: 6 seats between placeholders
  // Fifth & sixth rows: 8 seats
  const rowsTop = [
    { row: "A", seats: [1, 2, 3, 4, 5, 6] },
    { row: "B", seats: [1, 2, 3, 4, 5, 6] },
    { row: "C", seats: [1, 2, 3, 4, 5, 6] },
    { row: "D", seats: [1, 2, 3, 4, 5, 6] },
  ];

  const rowsBottom = [
    { row: "E", seats: [1, 2, 3, 4, 5, 6, 7, 8] },
    { row: "F", seats: [1, 2, 3, 4, 5, 6, 7, 8] },
  ];

  // Restriction: lock new selections when the maximum is reached,
  // but always allow clicking on an already selected seat (to deselect).
  const maxReached = totalTickets > 0 && selectedSeats.length >= totalTickets;

  return (
    <section className="auditorium-content">
      <p className="auditorium-text">Salong - Helan</p>
      <h2>Välj platser</h2>

      <section className="auditorium-container">
        <article className="auditorium">
        <img
          className="auditorium-screen"
          src={AuditoriumScreen}
          alt="Bild på en bioduk"
          />

          <section className="auditorium-seats-container">
            {/* Upper 4 rows with placeholders on the sides */}
            {rowsTop.map((r, idx) => (
              <section
                key={r.row}
                className={`auditorium-one-seats-${
                  ["first", "second", "third", "fourth"][idx]
                }-row`}
              >
                <div className="seat-placeholder" />
                {r.seats.map((n) => {
                  const selected = isSelected(r.row, n);
                  const occupied = isOccupied(r.row, n);
                  const disabled = occupied || (maxReached && !selected);
                  return (
                    <SeatBox
                      key={`${r.row}${n}`}
                      row={r.row}
                      number={n}
                      selected={selected}
                      occupied={occupied}
                      disabled={disabled}
                      onClick={() => onToggle(r.row, n)}
                    />
                  );
                })}
                <div className="seat-placeholder" />
              </section>
            ))}

            {/* Lower 2 rows without placeholders */}
            {rowsBottom.map((r, idx) => (
              <section
                key={r.row}
                className={`auditorium-one-seats-${
                  ["fifth", "sixth"][idx]
                }-row`}
              >
                {r.seats.map((n) => {
                  const selected = isSelected(r.row, n);
                  const occupied = isOccupied(r.row, n);
                  const disabled = occupied || (maxReached && !selected);
                  return (
                    <SeatBox
                      key={`${r.row}${n}`}
                      row={r.row}
                      number={n}
                      selected={selected}
                      occupied={occupied}
                      disabled={disabled}
                      onClick={() => onToggle(r.row, n)}
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