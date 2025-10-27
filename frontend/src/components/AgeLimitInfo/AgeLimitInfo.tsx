import { useEffect, useRef, useState } from "react";
import "./AgeLimitInfo.css";

export default function AgeLimitInfo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <section className="ageinfo-wrap" aria-label="Information om åldersgränser">
      <button
        type="button"
        className="ageinfo-trigger"
        onClick={() => setOpen(true)}
        title="Visa info om åldersgränser"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
          <path d="M12 8.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm-1.25 2.25h2v7h-2v-7z" fill="currentColor" />
        </svg>
        <span>Åldersgränser</span>
      </button>

      {open && (
        <div className="ageinfo-overlay">
          <div className="ageinfo-dialog" ref={dialogRef}>
            <header className="ageinfo-header">
              <h3>Åldersgränser på Filmvisarna</h3>
              <button
                type="button"
                className="ageinfo-close"
                onClick={() => setOpen(false)}
                aria-label="Stäng"
                title="Stäng"
              >
                ✕
              </button>
            </header>

            <div className="ageinfo-body">
              <p>Information kommer här.</p>
            </div>

            <footer className="ageinfo-footer">
              <button type="button" className="ageinfo-ok" onClick={() => setOpen(false)}>
                Okej, jag fattar
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}