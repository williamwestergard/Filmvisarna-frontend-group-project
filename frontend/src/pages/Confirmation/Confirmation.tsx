import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Confirmation.css";

// Data models for legacy (already-booked) flow
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

// Data models for draft (pre-booking) flow
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

  // --- Popup state ---
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Helper: map seatIds -> label "Row-Number"
  const seatLabelMap = useMemo(() => {
    const m = new Map<number, string>();
    allSeats.forEach((s) => m.set(s.seatId, `${s.rowLabel}-${s.seatNumber}`));
    return m;
  }, [allSeats]);

  // --- Legacy booking loader ---
  useEffect(() => {
    if (!bookingUrl) return;

    (async () => {
      try {
        setLoading(true);
        const byUrl = await fetch(`/api/bookings/url/${bookingUrl}`).then((r) => r.json());
        if (!byUrl?.ok || !byUrl.booking) {
          setErrorMsg("Bokningen kunde inte hittas.");
          return;
        }
        setBooking(byUrl.booking);

        const sc = await fetch(`/api/screenings/${byUrl.booking.screeningId}`).then((r) => r.json());
        setScreening(sc);

        const mv = await fetch(`/api/movies/${sc.movieId}`).then((r) => r.json());
        setMovie(mv);

        const aud = await fetch(`/api/auditoriums/${sc.auditoriumId}`).then((r) => r.json());
        setAuditorium(aud);

        const st = await fetch(`/api/screenings/${sc.id}/seats`).then((r) => r.json());
        setAllSeats(st?.seats || []);

        try {
          const tot = await fetch(`/api/booking-totals/${byUrl.booking.id}`).then((r) =>
            r.ok ? r.json() : null
          );
          if (tot?.totalPrice != null) setTotalPriceFromApi(tot.totalPrice);
        } catch {}
      } catch (err) {
        console.error(err);
        setPopupMessage("Kunde inte ladda bokningen.");
        setPopupVisible(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingUrl]);


  // --- Draft booking loader ---
  useEffect(() => {
    if (bookingUrl) return;

    (async () => {
      try {
        setLoading(true);
        const stored = localStorage.getItem("filmvisarna-draft");
        if (!stored) {
          setPopupMessage("Ingen bokning pågår. Gå tillbaka och välj biljetter.");
          setPopupVisible(true);
          return;
        }
        const parsed: Draft = JSON.parse(stored);
        if (!parsed?.screening?.id || !parsed?.movie?.id) {
          setPopupMessage("Ofullständigt utkast. Gå tillbaka och välj igen.");
          setPopupVisible(true);
          return;
        }
        setDraft(parsed);

        const sc = await fetch(`/api/screenings/${parsed.screening.id}`).then((r) => r.json());
        setScreening(sc);

        const mv = await fetch(`/api/movies/${sc.movieId}`).then((r) => r.json());
        setMovie(mv);

        const aud = await fetch(`/api/auditoriums/${sc.auditoriumId}`).then((r) => r.json());
        setAuditorium(aud);

        const st = await fetch(`/api/screenings/${sc.id}/seats`).then((r) => r.json());
        setAllSeats(st?.seats || []);
      } catch (err) {
        console.error(err);
        setPopupMessage("Kunde inte ladda bekräftelse.");
        setPopupVisible(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingUrl]);

  // Loads draft (in-progress) booking if no bookingUrl exists
  useEffect(() => {
    if (bookingUrl) return;

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

        // Loads server data for UI details
        const sc = await fetch(`/api/screenings/${parsed.screening.id}`).then((r) => r.json());
        setScreening(sc);

        const mv = await fetch(`/api/movies/${sc.movieId}`).then((r) => r.json());
        setMovie(mv);

        const aud = await fetch(`/api/auditoriums/${sc.auditoriumId}`).then((r) => r.json());
        setAuditorium(aud);

        const st = await fetch(`/api/screenings/${sc.id}/seats`).then((r) => r.json());
        setAllSeats(st?.seats || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("Kunde inte ladda bekräftelse.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingUrl]);

  // Formats date and time for display
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

  // Generates readable seat list for legacy flow
  const legacySeatLabels =
    booking?.seats?.map((b) => seatLabelMap.get(b.seatId) ?? `#${b.seatId}`).join(", ") ?? "";

  // Generates readable seat list for draft flow
  const draftSeatLabels =
    draft?.selectedSeats?.map((s) => `${s.row}-${s.number}`).join(", ") ?? "";

  // Assigns ticket types to seats based on selected counts
  function assignTicketTypesToSeats(realSeatIds: number[], counts: Draft["counts"]) {
    const list: { seatId: number; ticketTypeId: number }[] = [];
    let leftAdult = counts.adult;
    let leftSenior = counts.senior;
    let leftChild = counts.child;

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

  // Provides a fallback auditorium name if server data is missing
  function getAuditoriumNameFallback(id?: number) {
    if (!id) return "Okänd salong";
    if (auditorium?.name) return auditorium.name;
    if (id === 1) return "Helan";
    if (id === 2) return "Halvan";
    return `Salong ${id}`;
  }

  // Finalizes and submits a draft booking
  async function finalizeBooking() {
    if (!draft || !screening) return;

    try {
      setBookingSubmitting(true);

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
         setPopupMessage("Bokningen misslyckades. Försök igen.");
        setPopupVisible(true);
        return;
      }

      localStorage.removeItem("filmvisarna-draft");
      localStorage.setItem("filmvisarna-booking", JSON.stringify(data.booking));

      const url = data.booking.bookingUrl;
      if (url) {
        navigate(`/ticket/${url}`);
      } else {
        navigate(`/confirmation/${url}`);
      }
    } catch (err) {
      console.error("Finalize booking failed:", err);
      setPopupMessage("Något gick fel vid bokningen.");
       setPopupVisible(true);
    } finally {
      setBookingSubmitting(false);
    }
  }

  return (
  <main className="confirmation-page">
    {/* Popup overlay */}
    {popupVisible && (
      <div className="booking-fail-overlay">
        <div className="booking-fail-content">
          <h2 className="booking-fail-h2">{popupMessage}</h2>
          <button className="booking-fail-button" onClick={() => setPopupVisible(false)}>
            Stäng
          </button>
        </div>
      </div>
    )}

    {/* Loading */}
    {loading && <p className="loading">Laddar Bokning...</p>}

    {/* Error fallback */}
    {!loading && errorMsg && (
      <div style={{ textAlign: "center", color: "white" }}>
        <p>{errorMsg}</p>
        <button className="book-btn" onClick={() => navigate("/")} style={{ marginTop: "2rem" }}>
          Tillbaka till startsidan
        </button>
      </div>
    )}

    {/* Legacy booked confirmation */}
    {!loading && bookingUrl && booking && movie && screening && (
      <section className="booking-card">
        <div className="booking-info">
          <button type="button" className="confirmation-back-link" onClick={() => navigate(-1)}>
            <span className="confirmation-back-arrow">←</span>
            <span>Tillbaka</span>
          </button>

          <h2>{movie.title}</h2>
          <p className="language">{movie.language}</p>
          <p><strong>{formattedDate}</strong></p>
          <p>Tid: {formattedTime}</p>
          <p>Salong: {getAuditoriumNameFallback(screening.auditoriumId)}</p>
          <p>Platser {legacySeatLabels}</p>
          <p className="sum">{totalPriceFromApi != null ? `${totalPriceFromApi} kr` : "N/A"}</p>

          <div className="button-group">
            <button className="book-btn" onClick={() => navigate(`/ticket/${bookingUrl}`)}>
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
    )}

    {/* Draft confirmation */}
    {!loading && draft && movie && screening && (
      <section className="booking-card">
        <div className="booking-info">
          <button type="button" className="confirmation-back-link" onClick={() => navigate(-1)}>
            <span className="confirmation-back-arrow">←</span>
            <span>Tillbaka</span>
          </button>

          <h2>{movie.title}</h2>
          <p className="language">{movie.language}</p>
          <p><strong>{formattedDate}</strong></p>
          <p>Tid: {formattedTime}</p>
          <p>Salong: {getAuditoriumNameFallback(screening.auditoriumId)}</p>
          <p>Platser {draftSeatLabels || "—"}</p>
          <p className="sum">{new Intl.NumberFormat("sv-SE").format(draft.totalAmount)} kr</p>

          <div className="button-group">
            <button className="book-btn" onClick={finalizeBooking} disabled={bookingSubmitting}>
              {bookingSubmitting ? "Bokar..." : "Boka biljetter"}
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
    )}

    {/* Default fallback */}
    {!loading && !booking && !draft && !errorMsg && (
      <div style={{ textAlign: "center", color: "white" }}>
        <p>Ingen bokning pågår. Gå tillbaka och välj biljetter.</p>
        <button className="book-btn" onClick={() => navigate("/")}>
          Tillbaka till startsidan
        </button>
      </div>
    )}
  </main>
);


}
