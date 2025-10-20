
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

export async function getShowtimes() {
  const res = await fetch("/api/showtimes");
  if (!res.ok) throw new Error("Failed to fetch showtimes");

  const data = await res.json();

  return data.map((showtime: any) => ({
    screeningId: showtime.screeningId,
    movieId: showtime.movieId,
    date: showtime.date,
    time: showtime.time,
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
  }));
}
