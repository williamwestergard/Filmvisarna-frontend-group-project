import { useEffect, useRef } from "react";
import "./LoginModal.css";
import LoginForm from "../LoginForm/LoginForm";

type LoginModalProps = {
  open: boolean;
  onRequestClose?: () => void;
};

// Modal dialog for user login
export default function LoginModal({ open, onRequestClose }: LoginModalProps) {
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

  if (!open) return null; // Do not render anything if modal is closed

  return (
    <div
      className="loginmodal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Logga in"
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
          {/* LoginForm */}
          <LoginForm onClose={onRequestClose} />
        </div>
      </div>
    </div>
  );
}