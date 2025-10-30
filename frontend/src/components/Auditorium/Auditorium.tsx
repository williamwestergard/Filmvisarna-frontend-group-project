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
  const { screening, selectedSeats, toggleSeat, totalTickets } = useBooking();
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
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Kunde inte hämta bokade platser.");
      } finally {
        setLoading(false);
      }
    }

    fetchSeats();
    intervalId = setInterval(fetchSeats, 30000);
    return () => clearInterval(intervalId);
  }, [screening?.id]);


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

  return (
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
          {/* Small inline SVG icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 3h10a2 2 0 0 1 2 2v10h-2V6H7V3zm10 18H7a2 2 0 0 1-2-2V9h2v10h10v2zm-9-6h8v2H8v-2zm0-4h8v2H8V11z"
              fill="currentColor"
            />
          </svg>
          <span>Platsväljaren</span>
        </button>
       {/* Panel with seat selection options and list */}
        {pickerOpen && (
          <div id="seat-picker-panel" className="seat-picker-panel" role="dialog" aria-modal="false">
            <label className="seat-picker-label" htmlFor="seat-picker-select">
              Välj ledig plats
            </label>
            <div className="seat-picker-actions">
  <button
    type="button"
    className="seat-picker-add"
    onClick={() => {
      if (selectedSeats.length >= totalTickets && totalTickets > 0) {
        setPickerOpen(false); // stänger panelen när alla platser valts
      }
    }}
    disabled={totalTickets <= 0 || selectedSeats.length < totalTickets}
  >
    Välj plats
  </button>

  <button
    type="button"
    className="seat-picker-close"
    onClick={() => setPickerOpen(false)}
  >
    Stäng
  </button>
</div>

            
            {/* rows list with row counters and seat "chips"
                counts for free/selected/booked per row for quick scanning
               - Disabled states shows rules consistently with the map
            */}
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
                          isBooked ||
                          (!isSelected && (totalTickets <= 0 || selectedSeats.length >= totalTickets));
                        const labelText = `Plats ${s.seatNumber}`;
                        const statusText = isBooked
                          ? "Upptagen"
                          : isSelected
                          ? "Vald"
                          : "Ledig";

                        return (
                          <li key={s.seatId} className="seat-row-item">
                            <button
                              type="button"
                              className={[
                                "seat-chip",
                                isBooked ? "is-booked" : isSelected ? "is-selected" : "is-free",
                              ].join(" ")}
                              aria-pressed={isSelected}
                              aria-label={`Rad ${label} ${labelText} – ${statusText}`}
                              disabled={isBooked || disabled}
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
      {/* Render auditorium based on name */}
      {name === "Halvan" ? (
        <AuditoriumTwo seats={seats} bookedSeats={bookedSeats} />
      ) : (
        <AuditoriumOne seats={seats} bookedSeats={bookedSeats} />
      )}
    </section>
  );
}