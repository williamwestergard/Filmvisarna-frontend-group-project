import "./auditorium.css";
import AuditoriumScreen from "../../assets/images/auditorium/auditorium-screen.png";
import { useBooking } from "../../Context/BookingContext";

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
    { row: "A", seats: [1, 2, 3, 4, 5, 6, 7, 8] },
    { row: "B", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { row: "C", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { row: "D", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  ];

  const rowsBottom = [
    { row: "E", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { row: "F", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { row: "G", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "H", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
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
            <section className="auditorium-one-seats-first-row">
            <div className="seat-placeholder" />
            <div className="seat-placeholder" />


              {rowsTop[0].seats.map((n) => {
                const selected = isSelected("A", n);
                const occupied = isOccupied("A", n);
                const disabled = occupied || (maxReached && !selected);
                return (
                  <SeatBox
                    key={`A${n}`}
                    row="A"
                    number={n}
                    selected={selected}
                    occupied={occupied}
                    disabled={disabled}
                    onClick={() => onToggle("A", n)}
                  />
                );
              })}
     
            <div className="seat-placeholder" />
           <div className="seat-placeholder" />
            </section>

            <section className="auditorium-one-seats-second-row">
              <div className="seat-placeholder" />
        

              {rowsTop[1].seats.map((n) => {
                const selected = isSelected("B", n);
                const occupied = isOccupied("B", n);
                const disabled = occupied || (maxReached && !selected);
                return (
                  <SeatBox
                    key={`B${n}`}
                    row="B"
                    number={n}
                    selected={selected}
                    occupied={occupied}
                    disabled={disabled}
                    onClick={() => onToggle("B", n)}
                  />
                );
              })}
                    <div className="seat-placeholder" />
            <div className="seat-placeholder" />

            </section>

       <section className="auditorium-one-seats-third-row">
  <div className="seat-placeholder" />
  {rowsTop[2].seats.map((n) => {
    const selected = isSelected("C", n);
    const occupied = isOccupied("C", n);
    const disabled = occupied || (maxReached && !selected);
    return (
      <SeatBox
        key={`C${n}`}
        row="C"
        number={n}
        selected={selected}
        occupied={occupied}
        disabled={disabled}
        onClick={() => onToggle("C", n)}
      />
    );
  })}
  <div className="seat-placeholder" />
</section>

<section className="auditorium-one-seats-fourth-row">
  <div className="seat-placeholder" />
  {rowsTop[3].seats.map((n) => {
    const selected = isSelected("D", n);
    const occupied = isOccupied("D", n);
    const disabled = occupied || (maxReached && !selected);
    return (
      <SeatBox
        key={`D${n}`}
        row="D"
        number={n}
        selected={selected}
        occupied={occupied}
        disabled={disabled}
        onClick={() => onToggle("D", n)}
      />
    );
  })}
  <div className="seat-placeholder" />
</section>

 <section className="auditorium-one-seats-fifth-row">
    <div className="seat-placeholder" />
  {rowsBottom[0].seats.map((n) => {
    const selected = isSelected("E", n);
    const occupied = isOccupied("E", n);
    const disabled = occupied || (maxReached && !selected);
    return (
      <SeatBox
        key={`E${n}`}
        row="E"
        number={n}
        selected={selected}
        occupied={occupied}
        disabled={disabled}
        onClick={() => onToggle("E", n)}
      />
    );
  })}
  <div className="seat-placeholder" />
</section>

<section className="auditorium-one-seats-sixth-row">
    <div className="seat-placeholder" />
  {rowsBottom[1].seats.map((n) => {
    const selected = isSelected("F", n);
    const occupied = isOccupied("F", n);
    const disabled = occupied || (maxReached && !selected);
    return (
      <SeatBox
        key={`F${n}`}
        row="F"
        number={n}
        selected={selected}
        occupied={occupied}
        disabled={disabled}
        onClick={() => onToggle("F", n)}
      />
    );
  })}
    <div className="seat-placeholder" />
</section>

<section className="auditorium-one-seats-seventh-row">
  {rowsBottom[2].seats.map((n) => {
    const selected = isSelected("G", n);
    const occupied = isOccupied("G", n);
    const disabled = occupied || (maxReached && !selected);
    return (
      <SeatBox
        key={`G${n}`}
        row="G"
        number={n}
        selected={selected}
        occupied={occupied}
        disabled={disabled}
        onClick={() => onToggle("G", n)}
      />
    );
  })}
</section>

<section className="auditorium-one-seats-eighth-row">
  {rowsBottom[3].seats.map((n) => {
    const selected = isSelected("H", n);
    const occupied = isOccupied("H", n);
    const disabled = occupied || (maxReached && !selected);
    return (
      <SeatBox
        key={`H${n}`}
        row="H"
        number={n}
        selected={selected}
        occupied={occupied}
        disabled={disabled}
        onClick={() => onToggle("H", n)}
      />
    );
  })}
</section>


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