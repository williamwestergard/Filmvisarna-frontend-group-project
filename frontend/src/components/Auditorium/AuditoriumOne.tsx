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
      <p className="auditorium-text">Salong - Helan</p>
      <h2>Välj platser</h2>

      <section className="auditorium-container">
        <article className="auditorium">
          <img className="auditorium-screen" src={AuditoriumScreen} alt="Bioduk" />
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
    </section>
  );
}
