// frontend/src/context/BookingContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

// Types
export type TicketType = "adult" | "senior" | "child";

type Screening = {
  id: number;
  movieId?: number;
  auditoriumId?: number;
  auditoriumName?: "Helan" | "Halvan";
  dateLabel?: string;
  timeLabel?: string;
};

type Movie = {
  id: number;
  title: string;
  ageLimit?: number | string; // can be number or string from DB
  paketpris?: {
    liten: { antal: number; pris: number };
    litenEn: { antal: number; pris: number };
  };
};

type TicketCounts = { adult: number; senior: number; child: number };
type TicketPrices = { adult: number; senior: number; child: number };

type Seat = { seatId: number; row: string; number: number; auditorium: string };

type BookingContextType = {
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
  screening: Screening | null;
  setScreening: (screening: Screening | null) => void;

  /** Ticket-logic */
  counts: TicketCounts;
  prices: TicketPrices;
  increment: (type: TicketType) => void;
  decrement: (type: TicketType) => void;
  setCount: (type: TicketType, value: number) => void;
  totalTickets: number;
  totalAmount: number;
  childAllowed: boolean;

  /** seats */
  selectedSeats: Seat[];
  toggleSeat: (seat: Seat) => void;
  clearSeats: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// function to determine if child tickets are allowed based on ageLimit
function computeChildAllowed(ageLimit?: number | string): boolean {
  if (ageLimit == null) return false;
  if (typeof ageLimit === "number") {
    // Ex: 0, 7, 11, 15
    return ageLimit <= 7; // ticket type child allowed for age limits 0 and 7
  }
  const txt = ageLimit.trim().toLowerCase();
  // db values like "barntillåten", "0", "barn", "alla", "tillåten"
  return (
    txt.includes("barntillåten") ||
    txt === "0" ||
    txt === "barn" ||
    txt.includes("alla") ||
    txt.includes("tillåten")
  );
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);

  // Prices (can be extended to be dynamic later)
  const [prices] = useState<TicketPrices>({
    adult: 140,
    senior: 126, // 10% rabatt
    child: 95,
  });

  // ticket counts
  const [counts, setCounts] = useState<TicketCounts>({
    adult: 0,
    senior: 0,
    child: 0,
  });

  // selected seats
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // check if child tickets are allowed for the selected movie
  const childAllowed = useMemo(() => computeChildAllowed(movie?.ageLimit), [movie?.ageLimit]);

  // Totals
  const totalTickets = counts.adult + counts.senior + counts.child;
  const totalAmount =
    counts.adult * prices.adult + counts.senior * prices.senior + counts.child * prices.child;

  // ticket - logik
  function setCount(type: TicketType, value: number) {
    setCounts((prev) => {
      const next = { ...prev };
      if (type === "child" && !childAllowed) return prev; // if child not allowed, do nothing
      next[type] = Math.max(0, value | 0);
      return next;
    });
  }
  // Increment / Decrement
  function increment(type: TicketType) {
    if (type === "child" && !childAllowed) return;
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }

  function decrement(type: TicketType) {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
  }

  // Seats – hard limit: cannot select more than the number of purchased tickets
  function toggleSeat(seat: Seat) {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seatId === seat.seatId);
      if (exists) {
        return prev.filter((s) => s.seatId !== seat.seatId);
      }
      if (totalTickets > 0 && prev.length >= totalTickets) {
        return prev; // do not add more seats than tickets
      }
      return [...prev, seat];
    });
  }
 // Clear selected seats
  function clearSeats() {
    setSelectedSeats([]);
  }

  // Trim seats if the number of tickets is reduced
  if (selectedSeats.length > totalTickets) {
    setSelectedSeats((prev) => prev.slice(0, Math.max(0, totalTickets)));
  }
 
  const value: BookingContextType = {
    movie,
    setMovie,
    screening,
    setScreening,

    counts,
    prices,
    increment,
    decrement,
    setCount,
    totalTickets,
    totalAmount,
    childAllowed,

    selectedSeats,
    toggleSeat,
    clearSeats,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}