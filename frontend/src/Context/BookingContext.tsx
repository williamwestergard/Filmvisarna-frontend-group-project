import { createContext, useContext, useState } from "react";
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
  paketpris?: {
    liten: { antal: number; pris: number };
    litenEn: { antal: number; pris: number };
  };
};

type BookingContextType = {
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
  screening: Screening | null;
  setScreening: (screening: Screening | null) => void;
  tickets: number;
  setTickets: (tickets: number) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [tickets, setTickets] = useState(0);

  return (
    <BookingContext.Provider
      value={{ movie, setMovie, screening, setScreening, tickets, setTickets }}
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
