import { useEffect, useMemo, useState } from "react";
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
  const {
    screening,
    selectedSeats,
    toggleSeat,
    totalTickets,
    setAvailableSeatsCount, // placeholder for available seats updater
  } = useBooking();
  

  const [seats, setSeats] = useState<ApiSeat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI-state
  const [pickerOpen, setPickerOpen] = useState(false);

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

        // update available seats count for this screening
        const available = data.seats.length - booked.length;
        setAvailableSeatsCount(available);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Kunde inte hämta bokade platser.");
      } finally {
        setLoading(false);
      }
    }

    fetchSeats();
    intervalId = setInterval(fetchSeats, 60000);
    return () => clearInterval(intervalId);
  }, [screening?.id, setAvailableSeatsCount]);


  useEffect(() => {
  if (pickerOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [pickerOpen]);

  // Group seats by row for the structured list
  const rows = useMemo(() => {
    const byRow = new Map<string, ApiSeat[]>();
    for (const s of seats) {
      if (!byRow.has(s.rowLabel)) byRow.set(s.rowLabel, []);
      byRow.get(s.rowLabel)!.push(s);
    }
    const sortedRowLabels = Array.from(byRow.keys()).sort((a, b) =>
      a.localeCompare(b)
    );
    for (const key of sortedRowLabels) {
      byRow.get(key)!.sort((a, b) => a.seatNumber - b.seatNumber);
    }
    return sortedRowLabels.map((label) => ({
      label,
      seats: byRow.get(label)!,
    }));
  }, [seats]);

  function auditoriumNameForToggle() {
    return (
      screening?.auditoriumName ??
      (screening?.auditoriumId === 1
        ? "Helan"
        : screening?.auditoriumId === 2
        ? "Halvan"
        : "Salong")
    );
  }

  // Quick toggle seat by row and number
  function quickToggleSeat(row: string, number: number) {
    const seat = seats.find((s) => s.rowLabel === row && s.seatNumber === number);
    if (!seat) {
      alert("Kunde inte hitta platsen, försök igen.");
      return;
    }
    const isBooked = bookedSeats.includes(seat.seatId);
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
    if (isBooked) return;

    // Deselect if already selected
    if (isSelected) {
      toggleSeat({
        seatId: seat.seatId,
        row: seat.rowLabel,
        number: seat.seatNumber,
        auditorium: auditoriumNameForToggle(),
      });
      return;
    }
    // Enforce ticket cap
    if (totalTickets <= 0) {
      alert("Välj antal biljetter först.");
      return;
    }
    if (selectedSeats.length >= totalTickets) {
      alert("Du har redan valt maximalt antal platser.");
      return;
    }

    toggleSeat({
      seatId: seat.seatId,
      row: seat.rowLabel,
      number: seat.seatNumber,
      auditorium: auditoriumNameForToggle(),
    });
  }

  if (!screening?.id)
    return (
      <section className="auditorium-content">
        <h2>Välj platser</h2>
        <p className="auditorium-placeholder-text">Vänligen välj dag och tid.</p>
      </section>
    );


  const name =
    screening.auditoriumName ??
    (screening.auditoriumId === 1
      ? "Helan"
      : screening.auditoriumId === 2
      ? "Halvan"
      : undefined);

  return (
<>
   
{pickerOpen && (
  <>
    <div
      className="seat-picker-overlay"
      onClick={() => setPickerOpen(false)}
    />
   
  </>
)}


    <section className="auditorium-content">
      
      <div className="seat-picker">
        <button
          type="button"
          className="seat-picker-toggle"
          aria-expanded={pickerOpen}
          aria-controls="seat-picker-panel"
          onClick={() => setPickerOpen((v) => !v)}
          title="Platsväljaren"
        >
          {/*Icon - seat picker */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
          <span>Detaljerad vy</span>
        </button>

        {pickerOpen && (
        
  <div
    id="seat-picker-panel"
    className="seat-picker-panel"
    role="dialog"
    aria-modal="false"
  >
     
    <div className="seat-picker-actions">
      <button
        type="button"
        className="seat-picker-add"
        onClick={() => {
          if (selectedSeats.length >= totalTickets && totalTickets > 0) {
            setPickerOpen(false);
          }
        }}
        disabled={totalTickets <= 0 || selectedSeats.length < totalTickets}
      >
        Välj platser
      </button>
      <button type="button" className="seat-picker-close" onClick={() => setPickerOpen(false)}>
        Stäng
      </button>
    </div>

    <div className="seat-picker-rows">
      {rows.map(({ label, seats: rowSeats }) => {
        const rowBooked = rowSeats.filter((s) => bookedSeats.includes(s.seatId)).length;
        const rowSelected = rowSeats.filter((s) =>
          selectedSeats.some((sel) => sel.seatId === s.seatId)
        ).length;
        const rowFree = rowSeats.length - rowBooked - rowSelected;

        return (
          <section key={label} className="seat-row">
            <header className="seat-row-header">
              <h4 className="seat-row-title">Rad {label}</h4>
              <div className="seat-row-badges">
                <span className="badge badge-free">Lediga: {rowFree}</span>
                <span className="badge badge-selected">Valda: {rowSelected}</span>
                <span className="badge badge-booked">Upptagna: {rowBooked}</span>
              </div>
            </header>

            <ul className="seat-row-list" role="list">
              {rowSeats.map((s) => {
                const isBooked = bookedSeats.includes(s.seatId);
                const isSelected = selectedSeats.some((sel) => sel.seatId === s.seatId);
                const disabled =
                  isBooked || (!isSelected && (totalTickets <= 0 || selectedSeats.length >= totalTickets));
                const labelText = `Plats ${s.seatNumber}`;
                const statusText = isBooked ? "Upptagen" : isSelected ? "Vald" : "Ledig";

                return (
                  <li key={s.seatId} className="seat-row-item">
                    <button
                      type="button"
                      className={`seat-chip ${isBooked ? "is-booked" : isSelected ? "is-selected" : "is-free"}`}
                      aria-pressed={isSelected}
                      aria-label={`Rad ${label} ${labelText} – ${statusText}`}
                      disabled={disabled}
                      onClick={() => quickToggleSeat(s.rowLabel, s.seatNumber)}
                      title={`Rad ${label} – ${labelText} (${statusText})`}
                    >
                      {s.seatNumber}
                    </button>
                  </li>
                );
                
              })}
            </ul>
          </section>
        );
      })}
    </div>

    <p className="seat-picker-hint">
      Klicka på en ledig plats här ovan eller direkt i platskartan.
    </p>
  </div>
)}


      </div>

       {name === "Halvan" ? (
        <AuditoriumTwo screeningId={screening.id} />
      ) : (
        <AuditoriumOne screeningId={screening.id} />
      )}

    </section>
    </>
  );
  
}