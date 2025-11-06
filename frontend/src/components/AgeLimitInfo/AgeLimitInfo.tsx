import { useEffect, useRef, useState } from "react";
import "./AgeLimitInfo.css";

export default function AgeLimitInfo() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
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

  useEffect(() => {
    if (!open && btnRef.current) btnRef.current.focus();
  }, [open]);

  return (
    <section className="ageinfo-wrap" aria-label="Information om åldersgränser">
      <button
        ref={btnRef}
        type="button"
        className="ageinfo-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
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
        <div
          className="ageinfo-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ageinfo-title"
          aria-describedby="ageinfo-desc"
        >
          <div className="ageinfo-dialog" ref={dialogRef}>
            <header className="ageinfo-header">
              <h3 id="ageinfo-title">Åldersgränser på Filmvisarna</h3>
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

            <div className="ageinfo-body" id="ageinfo-desc">
              <ul className="ageinfo-list">
                <li>
                  <strong>Barntillåten</strong> – Alla åldrar välkomna.
                </li>
                <li>
                  <strong>7+</strong> – Barn under 7 år i vuxet sällskap.
                </li>
                <li>
                  <strong>11+</strong> – Barn 7–10 år i vuxet sällskap.
                </li>
                <li>
                  <strong>15+</strong> – Från 15 år. 
                </li>
              </ul>
              <p className="ageinfo-note">
              
                Tips: På filmsidan visar vi åldersgränsen bredvid genrerna. När
                du väljer biljetter kan <em>barnbiljett</em> endast väljas för
                barntillåtna visningar.
              </p>
            </div>

            <footer className="ageinfo-footer">
              <button type="button" className="ageinfo-ok" onClick={() => setOpen(false)}>
                Stäng
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}