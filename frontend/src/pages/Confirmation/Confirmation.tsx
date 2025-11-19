import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Confirmation.css";

// --- Types for already-booked flow ---
interface BookingSeat {
  seatId: number;
  ticketTypeId: number;
}

interface Booking {
  id: number;
  screeningId: number;
  userId: number | null;
  createdAt?: string;
  seats: BookingSeat[];
  bookingUrl?: string;
  bookingNumber?: string;
  status?: string;
}

interface Screening {
  id: number;
  movieId: number;
  auditoriumId: number;
  time: string;
}

interface Movie {
  id: number;
  title: string;
  language: string;
  posterUrl?: string;
}

interface Auditorium {
  id: number;
  name: string;
}

interface SeatRow {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
  isBooked?: number;
}

// --- Types for draft flow ---
interface DraftSeat {
  seatId: number;
  row: string;
  number: number;
  auditorium: string;
}

interface Draft {
  movie: { id: number; title: string } | null;
  screening: { id: number; movieId: number; auditoriumId: number; time: string } | null;
  counts: { adult: number; senior: number; child: number };
  totalTickets: number;
  totalAmount: number;
  selectedSeats: DraftSeat[];
  email: string;
  userId: number | null;
  paketprisToShow?: any;
}

export default function Confirmation() {
  const navigate = useNavigate();
  const { bookingUrl } = useParams<{ bookingUrl?: string }>();

  // common UI state
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- State for legacy (already-booked) flow ---
  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [auditorium, setAuditorium] = useState<Auditorium | null>(null);
  const [allSeats, setAllSeats] = useState<SeatRow[]>([]);
  const [totalPriceFromApi, setTotalPriceFromApi] = useState<number | null>(null);

  // --- State for draft (new) flow ---
  const [draft, setDraft] = useState<Draft | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Helper: map seatIds -> label "Row-Number"
  const seatLabelMap = useMemo(() => {
    const m = new Map<number, string>();
    allSeats.forEach((s) => m.set(s.seatId, `${s.rowLabel}-${s.seatNumber}`));
    return m;
  }, [allSeats]);

  // --- LEGACY flow loader (if :bookingUrl exists) ---
  useEffect(() => {
    if (!bookingUrl) return;
    (async () => {
      try {
        setLoading(true);

        // Load already booked (unchanged)
        const byUrl = await fetch(`/api/bookings/url/${bookingUrl}`).then((r) =>
          r.json()
        );
        if (!byUrl?.ok || !byUrl.booking) {
          setErrorMsg("Bokningen kunde inte hittas.");
          return;
        }
        setBooking(byUrl.booking);

        // Screening
        const sc = await fetch(`/api/screenings/${byUrl.booking.screeningId}`).then((r) =>
          r.json()
        );
        setScreening(sc);

        // Movie
        const mv = await fetch(`/api/movies/${sc.movieId}`).then((r) => r.json());
        setMovie(mv);

        // Auditorium
        const aud = await fetch(`/api/auditoriums/${sc.auditoriumId}`).then((r) =>
          r.json()
        );
        setAuditorium(aud);

        // Seats (to label them)
        const st = await fetch(`/api/screenings/${sc.id}/seats`).then((r) =>
          r.json()
        );
        setAllSeats(st?.seats || []);

        // Totals (best effort)
        try {
          const tot = await fetch(`/api/booking-totals/${byUrl.booking.id}`).then((r) =>
            r.ok ? r.json() : null
          );
          if (tot?.totalPrice != null) setTotalPriceFromApi(tot.totalPrice);
        } catch {}
      } catch (err) {
        console.error(err);
        setErrorMsg("Kunde inte ladda bokningen.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingUrl]);

  // --- DRAFT flow loader (if NO :bookingUrl) ---
  useEffect(() => {
    if (bookingUrl) return; // skip if legacy mode
    (async () => {
      try {
        setLoading(true);
        const stored = localStorage.getItem("filmvisarna-draft");
        if (!stored) {
          setErrorMsg("Ingen bokning pågår. Gå tillbaka och välj biljetter.");
          return;
        }
        const parsed: Draft = JSON.parse(stored);
        if (!parsed?.screening?.id || !parsed?.movie?.id) {
          setErrorMsg("Ofullständigt utkast. Gå tillbaka och välj igen.");
          return;
        }
        setDraft(parsed);

        // Load server data (for labels & UI)
        const sc = await fetch(`/api/screenings/${parsed.screening.id}`).then((r) =>
          r.json()
        );
        setScreening(sc);

        const mv = await fetch(`/api/movies/${sc.movieId}`).then((r) => r.json());
        setMovie(mv);

        const aud = await fetch(`/api/auditoriums/${sc.auditoriumId}`).then((r) =>
          r.json()
        );
        setAuditorium(aud);

        const st = await fetch(`/api/screenings/${sc.id}/seats`).then((r) =>
          r.json()
        );
        setAllSeats(st?.seats || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("Kunde inte ladda bekräftelse.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingUrl]);

  // Format date/time
  const formattedDate = screening
    ? new Date(screening.time).toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const formattedTime = screening
    ? new Date(screening.time).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // --- LEGACY seat labels (already-booked) ---
  const legacySeatLabels =
    booking?.seats
      ?.map((b) => seatLabelMap.get(b.seatId) ?? `#${b.seatId}`)
      .join(", ") ?? "";

  // --- DRAFT seat labels ---
  const draftSeatLabels =
    draft?.selectedSeats?.map((s) => `${s.row}-${s.number}`).join(", ") ?? "";

  // Utility: assign ticket types like your original code (moved here for draft booking)
  function assignTicketTypesToSeats(realSeatIds: number[], counts: Draft["counts"]) {
    // NOTE: Ensure these IDs match your DB ticketType ids (you used 5=adult, 6=senior, 4=child)
    const list: { seatId: number; ticketTypeId: number }[] = [];
    let leftAdult = counts.adult || 0;
    let leftSenior = counts.senior || 0;
    let leftChild = counts.child || 0;

    for (const sId of realSeatIds) {
      if (leftAdult > 0) {
        list.push({ seatId: sId, ticketTypeId: 5 });
        leftAdult--;
      } else if (leftSenior > 0) {
        list.push({ seatId: sId, ticketTypeId: 6 });
        leftSenior--;
      } else if (leftChild > 0) {
        list.push({ seatId: sId, ticketTypeId: 4 });
        leftChild--;
      } else {
        list.push({ seatId: sId, ticketTypeId: 5 });
      }
    }
    return list;
  }

  // Helper to map auditoriumId => name if API is missing name
  function getAuditoriumNameFallback(id?: number) {
    if (!id) return "Okänd salong";
    if (auditorium?.name) return auditorium.name;
    if (id === 1) return "Helan";
    if (id === 2) return "Halvan";
    return `Salong ${id}`;
  }

  // ⬇️ NEW: this is the ONLY place that actually POSTs to /api/bookings (draft flow)
  async function finalizeBooking() {
    if (!draft || !screening) return;

    try {
      setBookingSubmitting(true);

      // Build the payload similar to your old handleBooking, but from draft
      const seatIds = draft.selectedSeats.map((s) => s.seatId);
      const seatsPayload = assignTicketTypesToSeats(seatIds, draft.counts);

      const payload: any = {
        screeningId: screening.id,
        seats: seatsPayload,
        email: draft.email,
        movieTitle: draft.movie?.title,
        auditoriumName: getAuditoriumNameFallback(screening.auditoriumId),
        screeningTime: screening.time,
      };

      if (draft.userId) {
        payload.userId = draft.userId;
      } else {
        payload.guest = true;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.ok || !data.booking) {
        console.error("Booking API error:", data);
        alert("Bokningen misslyckades. Försök igen.");
        return;
      }

      // Clean up draft and jump to tickets (or confirmation with url)
      localStorage.removeItem("filmvisarna-draft");
      localStorage.setItem("filmvisarna-booking", JSON.stringify(data.booking));

      // Your current flow has “Visa biljetterna” → /ticket/:bookingUrl
      const url = data.booking.bookingUrl;
      if (url) {
        navigate(`/ticket/${url}`);
      } else {
        // Fallback: go to confirmation with booking url route
        navigate(`/confirmation/${url}`);
      }
    } catch (err) {
      console.error("Finalize booking failed:", err);
      alert("Något gick fel vid bokningen.");
    } finally {
      setBookingSubmitting(false);
    }
  }

  if (loading) return <p className="loading">Laddar Bokning...</p>;

  if (errorMsg) {
    return (
      <main className="confirmation-page">
        <p style={{ color: "white", textAlign: "center" }}>{errorMsg}</p>
        <button
          className="book-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "2rem" }}
        >
          Tillbaka till startsidan
        </button>
      </main>
    );
  }

  // --- Render for LEGACY mode (already-booked, has :bookingUrl) ---
  if (bookingUrl && booking && movie && screening) {
    const sumText =
      totalPriceFromApi != null ? `${totalPriceFromApi} kr` : "Not available";

    return (
      <main className="confirmation-page">
        <button className="back-btn-top" onClick={() => navigate(-1)}>
          ← Gå tillbaka
        </button>

        <section className="booking-card">
          <div className="booking-info">
            <h2>{movie.title}</h2>
            <p className="language">{movie.language}</p>
            <p><strong>{formattedDate}</strong></p>
            <p>Tid: {formattedTime}</p>
            <p>Salong: {getAuditoriumNameFallback(screening.auditoriumId)}</p>
            <p>Platser {legacySeatLabels}</p>
            <p className="sum">Summa: {sumText}</p>

            <div className="button-group">
              <button
                className="book-btn"
                onClick={() => navigate(`/ticket/${bookingUrl}`)}
              >
                Visa biljetterna
              </button>
            </div>
          </div>

          {movie.posterUrl && (
            <img
              className="booking-movie-card"
              src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
              alt={movie.title}
            />
          )}
        </section>
      </main>
    );
  }

  // --- Render for NEW DRAFT mode (no :bookingUrl) ---
  if (draft && movie && screening) {
    return (
      <main className="confirmation-page">
        <button className="back-btn-top" onClick={() => navigate(-1)}>
          ← Gå tillbaka
        </button>

        <section className="booking-card">
          <div className="booking-info">
            <h2>{movie.title}</h2>
            <p className="language">{movie.language}</p>
            <p><strong>{formattedDate}</strong></p>
            <p>Tid: {formattedTime}</p>
            <p>Salong: {getAuditoriumNameFallback(screening.auditoriumId)}</p>
            <p>Platser {draftSeatLabels || "—"}</p>
            <p className="sum">
              Summa: {new Intl.NumberFormat("sv-SE").format(draft.totalAmount)} kr
            </p>

            <div className="button-group">
              {/* Only now we actually BOOK */}
              <button
                className="book-btn"
                onClick={finalizeBooking}
                disabled={bookingSubmitting}
              >
                {bookingSubmitting ? "Bokar..." : "Boka biljetter"}
              </button>

              {/* Optional secondary: go see seats again */}
              <button
                className="secondary-btn"
                onClick={() => navigate(-1)}
                disabled={bookingSubmitting}
              >
                Ändra val
              </button>
            </div>
          </div>

          {movie.posterUrl && (
            <img
              className="booking-movie-card"
              src={`http://localhost:4000/images/posters/${movie.posterUrl}`}
              alt={movie.title}
            />
          )}
        </section>
      </main>
    );
  }

  // Fallback
  return (
    <main className="confirmation-page">
      <p style={{ color: "white", textAlign: "center" }}>
        Ingen bokning pågår. Gå tillbaka och välj biljetter.
      </p>
      <button className="book-btn" onClick={() => navigate("/")}>
        Tillbaka till startsidan
      </button>
    </main>
  );
}
