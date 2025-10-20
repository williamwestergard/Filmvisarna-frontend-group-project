import "./ticketsAmount.css"


function TicketsAmount() {

  return (
    <>
    <section className="tickets-amount-content">
      <h2>Välj antal biljetter</h2>

    <section className="tickets-amount-container">
        <section className="tickets-amount-type">
      <p>Ordinär</p>
    
        </section>

       <section className="tickets-amount-add-amount-container">
      <article className="ticket-amount-button minus">-</article>
      <span className="tickets-amount-number">0</span> 
      <article className="ticket-amount-button plus">+</article>
</section>
</section>

    <section className="tickets-amount-container">
        <section className="tickets-amount-type">
      <p>Pensionär</p>
        <p className="tickets-amount-type-reduced-price">10% rabatt</p>
        </section>

       <section className="tickets-amount-add-amount-container">
      <article className="ticket-amount-button minus">-</article>
      <span className="tickets-amount-number">0</span> 
      <article className="ticket-amount-button plus">+</article>
</section>
</section>


</section>
  
    </>
  )
}

export default  TicketsAmount