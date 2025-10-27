import "./auditorium.css";
import { useBooking } from "../../Context/BookingContext";
import AuditoriumScreen from "../../assets/images/auditorium/auditorium-screen.png";

// Create seat ID so we can toggle in a stable way.
const makeSeatId = (rowIndex: number, seatNo: number) =>
  2000 + rowIndex * 100 + seatNo;

function useSeatLogic() {
  const { selectedSeats, toggleSeat, totalTickets } = useBooking();

  function onToggle(row: string, number: number) {
    const seatId = makeSeatId(row.charCodeAt(0), number);
    const alreadySelected = selectedSeats.some((s) => s.seatId === seatId);

    // only allow deselecting an already selected seat
    if (alreadySelected) {
      toggleSeat({ seatId, row, number, auditorium: "Halvan" });
      return;
    }

    // if attempting to select a new seat: stop if max tickets reached
    if (totalTickets <= 0) return;
    if (selectedSeats.length >= totalTickets) return;

    toggleSeat({ seatId, row, number, auditorium: "Halvan" });
  }

  function isSelected(row: string, number: number) {
    const seatId = makeSeatId(row.charCodeAt(0), number);
    return selectedSeats.some((s) => s.seatId === seatId);
  }

  function isOccupied(_row: string, _num: number) {
    return false;
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
      role="button"
      title={
        disabled && !selected ? "Du har redan valt max antal platser" : undefined
      }
    />
  );
}

export default function AuditoriumTwo() {
  const { onToggle, isSelected, isOccupied, totalTickets, selectedSeats } =
    useSeatLogic();

  // define the seating layout: two rows with 4 seats each on top,
  // two rows with 6 seats each on bottom
  const rowsTop = [
    { row: "A", seats: [1, 2, 3, 4, 5, 6] },
    { row: "B", seats: [1, 2, 3, 4, 5, 6, 7, 8] },
    
  ];
  const rowsBottom = [
    { row: "C", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { row: "D", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
     { row: "E", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { row: "F", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  ];
  // determine if max seats selected
  const maxReached = totalTickets > 0 && selectedSeats.length >= totalTickets;

  return (
    <section className="auditorium-content">
      <p className="auditorium-text">Salong - Halvan</p>
      <h2>Välj platser</h2>

      <section className="auditorium-container">
        <article className="auditorium">
        <img
  className="auditorium-screen"
  src={AuditoriumScreen}
  alt="Bild på en bioduk"
/>

          <section className="auditorium-seats-container">
            <section className="auditorium-two-seats-first-row">
            <div className="seat-placeholder" />
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
           <div className="seat-placeholder" />
  
            </section>

            <section className="auditorium-two-seats-second-row">
              <div className="seat-placeholder" />
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

       
      <section className="auditorium-two-seats-third-row">
  <div className="seat-placeholder" />
  {rowsBottom[0].seats.map((n) => {
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
      <div className="seat-placeholder" />
</section>
          
            <section className="auditorium-two-seats-fourth-row">
         <div className="seat-placeholder" />
              {rowsBottom[1].seats.map((n) => {
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

 <section className="auditorium-two-seats-fifth-row">
   <div className="seat-placeholder" />
  {rowsBottom[2].seats.map((n) => {
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

<section className="auditorium-two-seats-sixth-row">
  {rowsBottom[3].seats.map((n) => {
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