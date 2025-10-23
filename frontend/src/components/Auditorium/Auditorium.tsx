import "./auditorium.css";
import { useBooking } from "../../Context/BookingContext";
import AuditoriumOne from "./AuditoriumOne";
import AuditoriumTwo from "./AuditoriumTwo";


function Auditorium() {
  const { screening } = useBooking(); 

  

  return (
    <section className="auditorium-content">

     {screening ? (
            screening.auditoriumId === 1 ? (
              <p className="auditorium-text">Salong - Helan</p>
            ) : screening.auditoriumId === 2 ? (
                 <p className="auditorium-text">Salong - Halvan</p>
            ) : null
          ) : null}

      <h2>Välj platser</h2>

      {screening ? (
            screening.auditoriumId === 1 ? (
              <AuditoriumOne />
            ) : screening.auditoriumId === 2 ? (
              <AuditoriumTwo />
            ) : null
          ) : null}

    
    </section>
  );
}

export default Auditorium;
