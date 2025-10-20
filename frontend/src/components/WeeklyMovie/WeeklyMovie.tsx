import { useEffect, useState } from 'react';
import './WeeklyMovie.css';

interface Paketpris {
     liten: {
    antal: number;
    pris: number;
  };
    litenEn: {       
    antal: number;
    pris: number;
  };
}

interface Film {
    id: number;
    title: string;
    description: string;
    posterUrl: string;
    releaseYear: number;
    paketpris: Paketpris;
}

const WeeklyMovie: React.FC = () => {
    const [film, setFilm] = useState<Film | null>(null);

    useEffect(() => {
        fetch('/api/movies/weekly')
        .then((res) => res.json())
        .then((data) => setFilm(data))
        .catch((err) => console.error('Error fetching Vecanks Film:', err));
    }, []);

    if (!film) return <p>Laddar Veckans Film...</p>

    return (
        <div className="weekly-movie-card">
            <div className="badge"> Veckans Film!</div>
            <img className="film-poster" src={film.posterUrl} alt={film.title} />
            <h2>{film.title} ({film.releaseYear})</h2>
            <p>{film.description}</p>
            <div className="paketpris">
                Paketpris: {film.paketpris.liten.antal} liten popcorn för {film.paketpris.liten.pris} kr <br />
                Eller: {film.paketpris.litenEn.antal} liten popcorn för {film.paketpris.litenEn.pris} kr
            </div>
            <button className="book-button">Boka Nu</button>
        </div>
    )
}

export default WeeklyMovie;