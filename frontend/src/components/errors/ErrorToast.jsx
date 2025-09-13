import { useEffect } from 'react';

export default function ErrorToast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!message) return null;

  return (
    <div className="error-toast">
      <span className="error-message">{message}</span>
      <button className="close-button" onClick={onClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
}
