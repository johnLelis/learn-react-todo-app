import { useEffect, useState } from 'react';

const SuccessToast = ({ message, visible, onClose }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) {
      setShow(true);
      const hideTimer = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 2000);

      return () => clearTimeout(hideTimer);
    }
  }, [visible, onClose]);

  if (!visible && !show) return null;
  return (
    <div className={`feedback-toast success ${show ? 'show' : ''}`}>
      <span className="toast-icon">✅</span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default SuccessToast;
