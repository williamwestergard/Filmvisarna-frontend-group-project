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
  const [chosenSeatKey, setChosenSeatKey] = useState<string>("");

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

  // Select-list with available seats
  const selectableSeats = useMemo(() => {
    const selectedIds = new Set(selectedSeats.map((s) => s.seatId));
    return seats
      .filter((s) => s.isBooked !== 1 && !selectedIds.has(s.seatId))
      .sort((a, b) =>
        a.rowLabel === b.rowLabel
          ? a.seatNumber - b.seatNumber
          : a.rowLabel.localeCompare(b.rowLabel)
      );
  }, [seats, selectedSeats]);

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

  // Choose seat from select-list
  function handlePickSeat() {
    if (!chosenSeatKey) return;
    const [row, numberStr] = chosenSeatKey.split("|");
    const number = Number(numberStr);

    const seat = seats.find((s) => s.rowLabel === row && s.seatNumber === number);
    if (!seat) {
      alert("Kunde inte hitta platsen, försök igen.");
      return;
    }
    if (bookedSeats.includes(seat.seatId)) {
      alert("Platsen blev just bokad. Välj en annan.");
      return;
    }
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

    setChosenSeatKey("");
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
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 3h10a2 2 0 0 1 2 2v10h-2V6H7V3zm10 18H7a2 2 0 0 1-2-2V9h2v10h10v2zm-9-6h8v2H8v-2zm0-4h8v2H8V11z"
              fill="currentColor"
            />
          </svg>
          <span>Platsväljaren</span>
        </button>

        {pickerOpen && (
          <div id="seat-picker-panel" className="seat-picker-panel" role="dialog" aria-modal="false">
            <label className="seat-picker-label" htmlFor="seat-picker-select">
              Välj ledig plats
            </label>
            <select
              id="seat-picker-select"
              className="seat-picker-select"
              value={chosenSeatKey}
              onChange={(e) => setChosenSeatKey(e.target.value)}
            >
              <option value="">— Välj —</option>
              {selectableSeats.map((s) => (
                <option key={s.seatId} value={`${s.rowLabel}|${s.seatNumber}`}>
                  Rad {s.rowLabel} – Plats {s.seatNumber}
                </option>
              ))}
            </select>

            <div className="seat-picker-actions">
              <button
                type="button"
                className="seat-picker-add"
                onClick={handlePickSeat}
                disabled={
                  !chosenSeatKey ||
                  totalTickets <= 0 ||
                  selectedSeats.length >= totalTickets
                }
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

            <p className="seat-picker-hint">
              Du kan också klicka direkt på stolarna i kartan.
            </p>
          </div>
        )}
      </div>

      {name === "Halvan" ? (
        <AuditoriumTwo seats={seats} bookedSeats={bookedSeats} />
      ) : (
        <AuditoriumOne seats={seats} bookedSeats={bookedSeats} />
      )}
    </section>
  );
}