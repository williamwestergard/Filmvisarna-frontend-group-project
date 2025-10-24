import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// screening information
type Screening = {
  id: number;
  movieId: number;
  auditoriumId: number;
  auditoriumName?: string;
  time: string;
  date?: string;
};

// Movie information
type Movie = {
  id: number;
  title: string;
  ageLimit?: number; //to control child ticket visibility
  paketpris?: {
    liten: { antal: number; pris: number };
    litenEn: { antal: number; pris: number };
  };
};

// Ticket types and prices
type TicketType = "adult" | "senior" | "child";

type TicketCounts = {
  adult: number;
  senior: number;
  child: number;
};

type TicketPrices = {
  adult: number;
  senior: number;
  child: number;
};

// seat type
type Seat = {
  seatId: number;
  row: string;
  number: number;
  auditorium: string;
};

// Context structure
type BookingContextType = {
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
  screening: Screening | null;
  setScreening: (screening: Screening | null) => void;

  tickets: number;
  setTickets: (tickets: number) => void;

  counts: TicketCounts;
  prices: TicketPrices;

  increment: (type: TicketType) => void;
  decrement: (type: TicketType) => void;
  setCount: (type: TicketType, value: number) => void;

  childAllowed: boolean;
  totalAmount: number;

  selectedSeats: Seat[];
  toggleSeat: (seat: Seat) => void;
  clearSeats: () => void;

  totalTickets: number;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  // Basic movie and screening state
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);

  // kept just in case older parts of the code still use "tickets"
  const [tickets, setTickets] = useState(0);

  // Ticket counters
  const [counts, setCounts] = useState<TicketCounts>({
    adult: 0,
    senior: 0,
    child: 0,
  });

  // Ticket prices (static for now, could come from backend)
  const [prices] = useState<TicketPrices>({
    adult: 140,
    senior: 120,
    child: 90,
  });

  // Selected seats
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Whether child tickets are allowed (depends on movie age limit)
  const [childAllowed, setChildAllowed] = useState(false); // default: false, hidden until known

  // total tickets = adult + senior + (child if allowed)
  const totalTickets =
    counts.adult + counts.senior + (childAllowed ? counts.child : 0);

  //Calculate total price dynamically
  const totalAmount =
    counts.adult * prices.adult +
    counts.senior * prices.senior +
    (childAllowed ? counts.child * prices.child : 0);

  // Update ticket counts
  const increment = (type: TicketType) => {
    if (type === "child" && !childAllowed) return; // prevent adding child tickets if not allowed
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const decrement = (type: TicketType) => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  const setCount = (type: TicketType, value: number) => {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, value) }));
  };

  //Seat selection logic (hard cap: cannot pick more than totalTickets)
  const toggleSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seatId === seat.seatId);
      if (isSelected) {
        // deselect if already chosen
        return prev.filter((s) => s.seatId !== seat.seatId);
      }
      // only add if we haven't reached max
      if (prev.length < totalTickets) {
        return [...prev, seat];
      }
      return prev; // ignore if max reached
    });
  };

  const clearSeats = () => setSelectedSeats([]);

  // Trim selected seats if user decreases ticket count
  useEffect(() => {
    if (selectedSeats.length > totalTickets) {
      setSelectedSeats((prev) => prev.slice(0, totalTickets));
    }
  }, [totalTickets, selectedSeats.length]);

  // Determine if child tickets should be shown based on ageLimit
  // Swedish age rule simplified:
  // 0 or 7 allowed
  // 11, 15, 18  not allowed
  // missing ageLimit → not allowed
  useEffect(() => {
    if (movie && typeof movie.ageLimit === "number") {
      setChildAllowed(movie.ageLimit <= 7);
      // if movie isn’t child-friendly, reset child count
      if (movie.ageLimit > 7) {
        setCounts((prev) => ({ ...prev, child: 0 }));
      }
    } else {
      setChildAllowed(false);
      setCounts((prev) => ({ ...prev, child: 0 }));
    }
  }, [movie?.id, movie?.ageLimit]);

  // Save all booking data to localStorage
  useEffect(() => {
    const data = {
      movie,
      screening,
      tickets,
      counts,
      prices,
      selectedSeats,
      childAllowed,
    };
    localStorage.setItem("filmvisarna-booking", JSON.stringify(data));
  }, [movie, screening, tickets, counts, prices, selectedSeats, childAllowed]);

  // Load booking data from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem("filmvisarna-booking");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMovie(data.movie || null);
        setScreening(data.screening || null);
        setTickets(data.tickets || 0);
        setCounts(data.counts || { adult: 0, senior: 0, child: 0 });
        setSelectedSeats(data.selectedSeats || []);
        setChildAllowed(!!data.childAllowed);
      } catch {
        console.warn("⚠️ Failed to parse saved booking data"); // ignore errors
      }
    }
  }, []);

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
        selectedSeats,
        toggleSeat,
        clearSeats,
        totalTickets,
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