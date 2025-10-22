import { useEffect, useState } from "react";
import "./availableDates.css";
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

// Helper: get ISO week number (Monday–Sunday)
function getWeekNumber(date: Date) {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
}

// Helper: get Monday for any given date
function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue...
  const diff = d.getDate() - (day === 0 ? 6 : day - 1); // shift to Monday
  return new Date(d.setDate(diff));
}

function AvailableDates({ movieId, onSelectScreening }: AvailableDatesProps) {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedScreeningId, setSelectedScreeningId] = useState<number | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    if (!movieId) return;

    // ✅ Fetch screenings only for this movie
    fetch(`/api/screenings?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data: Screening[]) => {
        const movieScreenings = data.filter((s) => s.movieId === movieId); // filter just in case
        setScreenings(movieScreenings);

        const uniqueDates = Array.from(
          new Set(movieScreenings.map((s) => s.time.slice(0, 10)))
        ).sort();
        if (uniqueDates.length > 0) setSelectedDate(uniqueDates[0]);
      })
      .catch((err) => console.error("Error fetching screenings:", err));
  }, [movieId]);

  // ✅ Work only with the current movie's screenings
  const uniqueDates = Array.from(new Set(screenings.map((s) => s.time.slice(0, 10)))).sort();

  if (uniqueDates.length === 0) {
    return <p>Inga tillgängliga visningar.</p>;
  }

  // Determine first and last dates for this movie only
  const firstScreeningDate = new Date(uniqueDates[0]);
  const lastScreeningDate = new Date(uniqueDates[uniqueDates.length - 1]);

  // Get Monday for first screening
  const firstMonday = getMonday(firstScreeningDate);

// Generate dates from first Monday to last Sunday (always full weeks)
const allDates: string[] = [];
const tempDate = new Date(firstMonday);

// Find the Sunday after the last screening
const lastSunday = new Date(lastScreeningDate);
lastSunday.setDate(lastSunday.getDate() + (7 - lastSunday.getDay() || 7));

while (tempDate <= lastSunday) {
  allDates.push(tempDate.toISOString().slice(0, 10));
  tempDate.setDate(tempDate.getDate() + 1);
}
  // Week navigation (7-day chunks)
  const startIndex = weekOffset * 7;
  const datesForCurrentWeek = allDates.slice(startIndex, startIndex + 7);

  // Screenings for selected date
  const screeningsForSelectedDate = screenings.filter(
    (s) => s.time.slice(0, 10) === selectedDate
  );

  const handleSelectDate = (date: string) => {
    if (screenings.some((s) => s.time.slice(0, 10) === date)) {
      setSelectedDate(date);
      setSelectedScreeningId(null);
    }
  };

  const handleSelectTime = (screening: Screening) => {
    setSelectedScreeningId(screening.id);
    onSelectScreening?.(screening);
  };

  return (
    <section className="available-dates">
      <h2>Tillgängliga tider</h2>

      <section className="available-dates-content">
        {/* Header */}
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
    onClick={() => {
      if (weekOffset > 0) setWeekOffset((prev) => prev - 1);
    }}
  />

  <span className="current-week">
    {datesForCurrentWeek.length > 0
      ? `v.${getWeekNumber(new Date(datesForCurrentWeek[0]))}`
      : ""}
  </span>

  <img
    className={`choose-week-arrow-right ${
      (() => {
        const nextStartIndex = (weekOffset + 1) * 7;
        const nextWeekDates = allDates.slice(nextStartIndex, nextStartIndex + 7);
        const hasNextWeekScreening = nextWeekDates.some((date) =>
          screenings.some((s) => s.time.slice(0, 10) === date)
        );
        return hasNextWeekScreening ? "" : "disabled";
      })()
    }`}
    src={ArrowRight}
    onClick={() => {
      const nextStartIndex = (weekOffset + 1) * 7;
      const nextWeekDates = allDates.slice(nextStartIndex, nextStartIndex + 7);
      const hasNextWeekScreening = nextWeekDates.some((date) =>
        screenings.some((s) => s.time.slice(0, 10) === date)
      );

      if (hasNextWeekScreening) setWeekOffset((prev) => prev + 1);
    }}
  />
</article>

        </section>

        {/* Dates (Mon–Sun) */}
        <section className="dates-container">
          {datesForCurrentWeek.map((date) => {
            const hasScreening = screenings.some((s) => s.time.slice(0, 10) === date);
            const day = new Date(date).toLocaleString("sv-SE", { weekday: "short" });
            const dayNumber = new Date(date).getDate();
            const isSelected = selectedDate === date;

            return (
              <article
                key={date}
                className={`date-card ${isSelected ? "selected" : ""} ${
                  !hasScreening ? "no-screening" : ""
                }`}
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
          {screeningsForSelectedDate.map((screening) => {
            const time = new Date(screening.time).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isSelected = selectedScreeningId === screening.id;

            return (
              <article
                key={screening.id}
                className={`choose-day-container ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelectTime(screening)}
              >
                <p className="choose-day-text">
                  {new Date(screening.time).toLocaleDateString("sv-SE", { weekday: "short" })}
                </p>
                <p className="choose-day-time">Kl {time}</p>
              </article>
            );
          })}
        </section>
      </section>
    </section>
  );
}

export default AvailableDates;
