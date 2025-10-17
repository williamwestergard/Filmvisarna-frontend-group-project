

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
