
export async function getMovies() {
  const res = await fetch("/api/movies/categories");
  if (!res.ok) throw new Error("Failed to fetch movies with categories");

  const data = await res.json(); 

  return data.map((m: any) => ({
    id: m.movie_id,
    title: m.film,
    category: m.kategorier ? m.kategorier.split(", ") : [],
     posterUrl: m.posterUrl,
     backdropUrl: m.backdropUrl

  }));
  
}

export async function getCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();

  return data.map((c: any) => ({
    id: c.id,
    title: c.title,
  }));
}

export async function getShowtimes(date?: string) {
  // Build the API URL dynamically based on the date
  const url = date ? `/api/screenings?date=${date}` : "/api/screenings";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch showtimes");

  const data = await res.json();

  return data.map((showtime: any) => ({
    screeningId: showtime.id,
    movieId: showtime.movieId,
    date: showtime.time.split("T")[0], // extract YYYY-MM-DD
    time: showtime.time.split("T")[1]?.slice(0, 5), // extract HH:mm
  }));
}
export async function getMoviesInformation() {
  const res = await fetch("/api/movies");
  if (!res.ok) throw new Error("Failed to fetch movies");

  const data = await res.json();

  return data.map((m: any) => ({
    id: m.movie_id,
    title: m.film,
    category: m.kategorier ? m.kategorier.split(", ") : [],
    posterUrl: m.posterUrl,
    backdropUrl: m.backdropUrl,
    description: m.description,
    trailerUrl: m.trailerUrl,
    runtimeMin: m.runtimeMin,
    ageLimit: m.ageLimit,
    releaseYear: m.releaseYear,
    language: m.language,
    country: m.country,
    castJson: m.castJson
  ? (typeof m.castJson === "string" ? JSON.parse(m.castJson) : m.castJson)
  : []
  }));
}
