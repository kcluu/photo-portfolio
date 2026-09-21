import type { ReactNode } from "react";
import "./InfoModal.css";

interface InfoModalProps {
  title: string;
  body: ReactNode[];
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal = ({ title, body, isOpen, onClose }: InfoModalProps) => (
  <>
    <div
      className="info-modal-scrim"
      style={{ opacity: isOpen ? 0.86 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      onClick={onClose}
    />

    <div
      className={`info-modal-box ${isOpen ? "info-modal-box-visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={title}
    >
      <button type="button" className="info-modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="info-modal-title">{title}</div>
      {body.map((paragraph, index) => (
        <p key={index} className="info-modal-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  </>
);
