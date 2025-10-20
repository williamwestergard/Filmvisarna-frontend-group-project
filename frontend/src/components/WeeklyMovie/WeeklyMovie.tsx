// src/components/WeeklyMovie/WeeklyMovie.tsx
import { useEffect, useState } from 'react';
import './WeeklyMovie.css';

interface Paketpris {
  liten: { antal: number; pris: number };
  litenEn: { antal: number; pris: number };
}

interface Film {
  id: number;
  title: string;
  description: string;
  posterUrl: string | null;
  releaseYear: number;
  paketpris: Paketpris;
}

const WeeklyMovie: React.FC = () => {
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    fetch('/api/movies/weekly') // relative URL works with Vite proxy
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched weekly film:', data); // Debug fetched data
        setFilm(data);
      })
      .catch((err) => console.error('Error fetching Veckans Film:', err));
  }, []);

  if (!film) return <p>Loading Veckans Film...</p>;

  // Build full poster URL
 const posterSrc = film.posterUrl
  ? `http://localhost:4000/images/posters/${film.posterUrl}`
  : '/placeholder-poster.jpg';

  console.log('Poster URL:', posterSrc); // Debug the image URL

  return (
    <div className="weekly-movie-card">
      <div className="badge">🎬 Veckans Film!</div>
      <img className="film-poster" src={posterSrc} alt={film.title} />
      <h2>
        {film.title} ({film.releaseYear})
      </h2>
      <p>{film.description}</p>
      <div className="paketpris">
        ✨ Paketpris: {film.paketpris.liten.antal} liten popcorn för{' '}
        {film.paketpris.liten.pris}kr 🍿
        <br />
        Eller: {film.paketpris.litenEn.antal} liten popcorn för{' '}
        {film.paketpris.litenEn.pris}kr 🍿
      </div>
      <button className="book-button">Boka Nu</button>
    </div>
  );
};

export default WeeklyMovie;