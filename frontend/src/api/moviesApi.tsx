export async function getMovies() {
  const res = await fetch('/api/movies'); 
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}