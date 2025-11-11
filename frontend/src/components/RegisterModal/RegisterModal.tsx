// RegisterModal.tsx
import { useEffect, useRef } from "react";
import "./RegisterModal.css"; // optional: or reuse LoginModal.css if identical
import RegisterForm from "../RegisterForm/RegisterForm";

type RegisterModalProps = {
  open: boolean;
  onRequestClose?: () => void;
};

export default function RegisterModal({ open, onRequestClose }: RegisterModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onRequestClose?.();
    }
    function onClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onRequestClose?.();
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onRequestClose]);

  if (!open) return null;

  return (
    <div
      className="loginmodal-overlay"           // reuse same overlay class as LoginModal for consistency
      role="dialog"
      aria-modal="true"
      aria-label="Skapa konto"
    >
      <div className="loginmodal-dialog" ref={dialogRef}>
        <header className="loginmodal-header">
          <button
            type="button"
            className="loginmodal-close"
            onClick={onRequestClose}
            aria-label="Stäng"
            title="Stäng"
          >
            ✕
          </button>
        </header>

        <div className="loginmodal-body">
          <RegisterForm
            onSuccess={onRequestClose} // close after successful register
            onCancel={onRequestClose}  // close on cancel
          />
        </div>
      </div>
    </div>
  );
}