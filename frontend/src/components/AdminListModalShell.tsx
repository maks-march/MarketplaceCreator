import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/AdminListModals.css';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const AdminListModalShell: React.FC<Props> = ({ open, title, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    // if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="almb-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="almb-shell" role="dialog" aria-modal="true">
        <div className="almb-head">
          <div className="almb-title">{title}</div>
          <button className="almb-close" aria-label="Закрыть" onClick={onClose}>×</button>
        </div>

        <div className="almb-card">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminListModalShell;