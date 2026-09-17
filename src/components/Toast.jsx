import React, { useEffect } from 'react';
import { Bookmark, CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <aside className="toast-container" aria-live="polite">
      <div className="toast-message" id="active-toast">
        <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}
