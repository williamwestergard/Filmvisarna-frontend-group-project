// frontend/src/context/BookingContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Screening = {
  id: number;
  movieId: number;
  auditoriumId: number;
  time: string;
};

type Movie = {
  id: number;
  title: string;
  ageLimit?: number | string;
  paketpris?: {
    liten: { antal: number; pris: number };
    litenEn: { antal: number; pris: number };
  };
};
// Define ticket types
type TicketType = "adult" | "senior" | "child";

type TicketCounts = {
  adult: number;
  senior: number;
  child: number;
};
// Define ticket prices
type TicketPrices = {
  adult: number;
  senior: number;
  child: number;
};
// Define the shape of the booking context
type BookingContextType = {
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
  screening: Screening | null;
  setScreening: (screening: Screening | null) => void;
  // Total number of tickets
  tickets: number;
  setTickets: (tickets: number) => void;
  // Ticket counts and prices
  counts: TicketCounts;
  prices: TicketPrices;
  increment: (type: TicketType) => void;
  decrement: (type: TicketType) => void;
  setCount: (type: TicketType, value: number) => void;
  // Whether children are allowed for the selected movie
  childAllowed: boolean;
  totalAmount: number;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);
// BookingProvider component to wrap around parts of the app that need booking context
export function BookingProvider({ children }: { children: ReactNode }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  // State to hold ticket counts
  const [counts, setCounts] = useState<TicketCounts>({
    adult: 0,
    senior: 0,
    child: 0,
  });
  // Fixed ticket prices
  const [prices] = useState<TicketPrices>({
    adult: 140,
    senior: 126,
    child: 100,
  });
  // Determine if children are allowed based on movie's age limit
  const childAllowed = useMemo(() => {
    const al = movie?.ageLimit;
    if (al === undefined || al === null) return false;
    if (typeof al === "string") return al.toLowerCase().includes("barn");
    if (typeof al === "number") return al <= 7;
    return false;
  }, [movie?.ageLimit]);

  const increment = (type: TicketType) =>
    setCounts((c) => ({ ...c, [type]: c[type] + 1 }));

  const decrement = (type: TicketType) =>
    setCounts((c) => ({ ...c, [type]: Math.max(0, c[type] - 1) }));

  const setCount = (type: TicketType, value: number) =>
    setCounts((c) => ({ ...c, [type]: Math.max(0, value | 0) }));
  // Calculate total number of tickets
  const tickets =
    counts.adult + counts.senior + (childAllowed ? counts.child : 0);
  // Calculate total amount based on counts and prices
  const totalAmount = useMemo(() => {
    return (
      counts.adult * prices.adult +
      counts.senior * prices.senior +
      (childAllowed ? counts.child * prices.child : 0)
    );
  }, [counts, prices, childAllowed]);
  // Function to set total tickets
  const setTickets = (n: number) => {
    const safe = Math.max(0, n | 0);
    setCounts((c) => ({ ...c, adult: safe }));
  };
  // Provide the context values to children componentss
  return (
    <BookingContext.Provider
      value={{
        movie,
        setMovie,
        screening,
        setScreening,
        tickets,
        setTickets,
        counts,
        prices,
        increment,
        decrement,
        setCount,
        childAllowed,
        totalAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}