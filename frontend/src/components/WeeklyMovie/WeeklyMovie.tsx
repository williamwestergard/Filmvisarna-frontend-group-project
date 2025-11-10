import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WeeklyMovie.css";

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
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/movies/weekly")
      .then((res) => res.json())
      .then((data) => setFilm(data))
      .catch((err) => console.error("Error fetching Veckans Film:", err));
  }, []);

  if (!film) return <p>Laddar veckans film...</p>;

  const posterSrc = film.posterUrl
    ? `http://localhost:4000/images/posters/${film.posterUrl}`
    : "/placeholder-poster.jpg";

  const slugify = (title: string) =>
    title
      .toLowerCase()
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/\s+/g, "-");

  const handleBookingClick = () => {
    const movieSlug = slugify(film.title);
    navigate(`/booking/${movieSlug}`, {
      state: { paketpris: film.paketpris },
    });
  };

  return (
  <div className="weekly-movie">
  <img className="weekly-movie-img" src={posterSrc} alt={film.title} />
  <div className="weekly-movie-content">
    <h2>{film.title} ({film.releaseYear})</h2>
    <p>{film.description}</p>
    <div className="paketpris">
      Paketpris:<br></br> {film.paketpris.liten.antal} liten popcorn för {film.paketpris.liten.pris} kr
      <br />
      Eller: <br></br>{film.paketpris.litenEn.antal} liten popcorn för {film.paketpris.litenEn.pris} kr
    </div>
    <button className="weekly-btn" onClick={handleBookingClick}>
          Boka nu
        </button>
  </div>
</div>
  );
};

export default WeeklyMovie;