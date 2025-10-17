

export async function getMovies() {
  const res = await fetch("/api/movies/categories");
  if (!res.ok) throw new Error("Failed to fetch movies with categories");

  const data = await res.json(); 

  return data.map((m: any) => ({
    id: m.movie_id,
    title: m.film,
    category: m.kategorier ? m.kategorier.split(", ") : [],
     posterUrl: m.posterUrl,

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