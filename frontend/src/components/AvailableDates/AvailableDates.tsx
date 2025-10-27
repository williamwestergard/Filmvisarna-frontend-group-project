import { useEffect, useState } from "react";
import "./availableDates.css";
import { useBooking } from "../../Context/BookingContext";
import ArrowLeft from "../../assets/images/auditorium/arrow-triangle-left.png";
import ArrowRight from "../../assets/images/auditorium/arrow-triangle-right.png";

type Screening = {
  id: number;
  movieId: number;
  auditoriumId: number;
  time: string;
};

type AvailableDatesProps = {
  movieId: number;
  onSelectScreening?: (screening: Screening) => void;
};


// Get week number (Monday–Sunday)
function getWeekNumber(date: Date) {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekOffset(allDates: string[], selectedDate: string) {
  const index = allDates.findIndex((d) => d === selectedDate);
  if (index === -1) return 0;
  return Math.floor(index / 7);
}

// Get Monday for any given date
function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1); // Shift to Monday
  return new Date(d.setDate(diff));
}

function AvailableDates({ movieId, onSelectScreening }: AvailableDatesProps) {
  const { setScreening } = useBooking();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedScreeningId, setSelectedScreeningId] = useState<number | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);


   // Fetch screenings 
  useEffect(() => {
    if (!movieId) return;
    fetch(`/api/screenings?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data: Screening[]) => {
        const movieScreenings = data.filter((s) => s.movieId === movieId);
        setScreenings(movieScreenings);
      })
      .catch((err) => console.error(err));
  }, [movieId]);


useEffect(() => {
  const savedData = localStorage.getItem("selectedScreening");
  if (!savedData) return;

  const { movieId: savedMovieId, screening, selectedDate: savedDate, weekOffset: savedWeekOffset, expiresAt } = JSON.parse(savedData);

  if (savedMovieId === movieId && Date.now() < expiresAt) {
    setSelectedDate(savedDate);
    setSelectedScreeningId(screening?.id || null);
    setScreening(screening || null);
    setWeekOffset(savedWeekOffset || 0);
  }
}, [screenings, movieId, setScreening]);


 useEffect(() => {
  return () => {
    // Only clear if leaving the booking page
    if (!location.pathname.startsWith("/booking")) {
      localStorage.removeItem("selectedScreening");
    }
  };
}, [location.pathname]);

  useEffect(() => {
    if (!movieId) return;

    // Fetch screenings only for this movie
    fetch(`/api/screenings?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data: Screening[]) => {
        const movieScreenings = data.filter((s) => s.movieId === movieId);
        setScreenings(movieScreenings);
      })
      .catch((err) => console.error("Error fetching screenings:", err));
  }, [movieId]);

  // Work only with the current movie's screenings
  const uniqueDates = Array.from(
    new Set(screenings.map((s) => s.time.slice(0, 10)))
  ).sort();


  const firstScreeningDate = new Date(uniqueDates[0]);
  const lastScreeningDate = new Date(uniqueDates[uniqueDates.length - 1]);
  const firstMonday = getMonday(firstScreeningDate);

  // Generate all dates for full weeks
  const allDates: string[] = [];
  const tempDate = new Date(firstMonday);
  const lastSunday = new Date(lastScreeningDate);
  lastSunday.setDate(lastSunday.getDate() + (7 - lastSunday.getDay() || 7));

  while (tempDate <= lastSunday) {
    allDates.push(tempDate.toISOString().slice(0, 10));
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const startIndex = weekOffset * 7;
  const datesForCurrentWeek = allDates.slice(startIndex, startIndex + 7);

  const screeningsForSelectedDate = screenings.filter(
    (s) => s.time.slice(0, 10) === selectedDate
  );

const handleSelectDate = (date: string) => {
  if (screenings.some((s) => s.time.slice(0, 10) === date)) {
    setSelectedDate(date);
    setSelectedScreeningId(null);

    const expiresAt = Date.now() + 10 * 60 * 1000;
    const data = { movieId, screening: null, selectedDate: date, weekOffset, expiresAt };
    localStorage.setItem("selectedScreening", JSON.stringify(data));
  }
};

const handleSelectTime = (screening: Screening) => {
  setSelectedScreeningId(screening.id);
  setSelectedDate(screening.time.slice(0, 10));
  onSelectScreening?.(screening);
  setScreening(screening);

  const expiresAt = Date.now() + 10 * 60 * 1000;
  const data = { movieId, screening, selectedDate: screening.time.slice(0, 10), weekOffset, expiresAt };
  localStorage.setItem("selectedScreening", JSON.stringify(data));
};

  useEffect(() => {
    if (screenings.length === 0) return;
    const savedData = localStorage.getItem("selectedScreening");
    if (!savedData) return;

    const { movieId: savedMovieId, screening, selectedDate: savedDate, weekOffset: savedWeekOffset, expiresAt } = JSON.parse(savedData);

    if (savedMovieId === movieId && Date.now() < expiresAt) {
      setSelectedDate(savedDate);
      setSelectedScreeningId(screening?.id || null);
      setScreening(screening || null);
      setWeekOffset(savedWeekOffset || 0);
    }
  }, [screenings, movieId, setScreening]);

  // Clear localStorage when leaving booking page
  useEffect(() => {
    return () => {
      if (!location.pathname.startsWith("/booking")) {
        localStorage.removeItem("selectedScreening");
      }
    };
  }, [location.pathname]);


  return (
    <section className="available-dates">
      <h2>Tillgängliga tider</h2>

      <section className="available-dates-content">
        <section className="choose-day-and-month">
          <article className="day-and-month-container">
            <h3>Välj dag</h3>
            {selectedDate && (
              <p className="current-month">
                {new Date(selectedDate).toLocaleString("sv-SE", { month: "long" })}
              </p>
            )}
          </article>

          <article className="choose-week">
            <img
              className={`choose-week-arrow-left ${weekOffset === 0 ? "disabled" : ""}`}
              src={ArrowLeft}
              onClick={() => { if (weekOffset > 0) setWeekOffset(prev => prev - 1); }}
            />

            <span className="current-week">
              {datesForCurrentWeek.length > 0 ? `v.${getWeekNumber(new Date(datesForCurrentWeek[0]))}` : ""}
            </span>

            <img
              className={`choose-week-arrow-right ${
                (() => {
                  const nextStartIndex = (weekOffset + 1) * 7;
                  const nextWeekDates = allDates.slice(nextStartIndex, nextStartIndex + 7);
                  const hasNextWeekScreening = nextWeekDates.some(date =>
                    screenings.some(s => s.time.slice(0, 10) === date)
                  );
                  return hasNextWeekScreening ? "" : "disabled";
                })()
              }`}
              src={ArrowRight}
              onClick={() => {
                const nextStartIndex = (weekOffset + 1) * 7;
                const nextWeekDates = allDates.slice(nextStartIndex, nextStartIndex + 7);
                const hasNextWeekScreening = nextWeekDates.some(date =>
                  screenings.some(s => s.time.slice(0, 10) === date)
                );
                if (hasNextWeekScreening) setWeekOffset(prev => prev + 1);
              }}
            />
          </article>
        </section>

        {/* Dates (Mån–Sön) */}
        <section className="dates-container">
          {datesForCurrentWeek.map(date => {
            const hasScreening = screenings.some(s => s.time.slice(0, 10) === date);
            const day = new Date(date).toLocaleString("sv-SE", { weekday: "short" });
            const dayNumber = new Date(date).getDate();
            const isSelected = selectedDate === date;

            return (
              <article
                key={date}
                className={`date-card ${isSelected ? "selected" : ""} ${!hasScreening ? "no-screening" : ""}`}
                onClick={() => handleSelectDate(date)}
              >
                {hasScreening ? (
                  <>
                    <p className="date-card-date">{dayNumber}</p>
                    <p className="date-card-day">{day}</p>
                  </>
                ) : (
                  <p className="date-card-cross">✕</p>
                )}
              </article>
            );
          })}
        </section>

        {/* Time cards */}
        <section className="choose-day-content">
          {selectedDate && screeningsForSelectedDate.map(screening => {
            const time = new Date(screening.time).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
            const isSelected = selectedScreeningId === screening.id;

            return (
              <article
                key={screening.id}
                className={`choose-day-container ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelectTime(screening)}
              >
                <p className="choose-day-text">{new Date(screening.time).toLocaleDateString("sv-SE", { weekday: "short" })}</p>
                <p className="choose-day-time">Kl {time}</p>
              </article>
            );
          })}
          {!selectedDate && <p className="choose-day-placeholder">Välj en dag för att se tider</p>}
        </section>
      </section>
    </section>
  );
}

export default AvailableDates;
