import "./CancelBookingModal.css";

type CancelBookingModalProps = {
  isOpen: boolean;
  bookingTitle: string;
  screeningTime: string;
  auditoriumName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
};

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  bookingTitle,
  screeningTime,
  auditoriumName,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="cancel-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
    >
      <div className="cancel-modal__dialog">
        <h3 id="cancel-dialog-title">Avboka {bookingTitle}?</h3>
        <p className="cancel-modal__text">
          Bokning {new Date(screeningTime).toLocaleString("sv-SE")} i{" "}
          {auditoriumName}. Är du säker på att du vill ta bort bokningen?
        </p>
        <div className="cancel-modal__actions">
          <button
            className="cancel-modal__keep"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Behåll bokningen
          </button>
          <button
            className="cancel-modal__confirm"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Avbokar..." : "Avboka"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
