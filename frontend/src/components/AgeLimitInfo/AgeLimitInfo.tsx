import { useState } from "react";
import "./AgeLimitInfo.css";

export default function AgeLimitInfo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="ageinfo-wrap" aria-label="Information om åldersgränser">
      <button
        type="button"
        className="ageinfo-trigger"
        onClick={() => setOpen(true)}
        title="Visa info om åldersgränser"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
          <path
            d="M12 8.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm-1.25 2.25h2v7h-2v-7z"
            fill="currentColor"
          />
        </svg>
        <span>Åldersgränser</span>
      </button>
      
    </section>
  );
}