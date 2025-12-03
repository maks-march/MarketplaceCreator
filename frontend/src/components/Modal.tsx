import React from 'react';
import '../styles/ui.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, footer, children, width = 1120 }) => {
  return (
    <div className="ui-modal-backdrop">
      <div className="ui-modal-shell" style={{ width }}>
        <div className="ui-modal">
          <div className="ui-modal-header">
            <h2 className="ui-modal-title">{title}</h2>
            <button onClick={onClose} aria-label="close" className="ui-modal-close">✖</button>
          </div>
          <div>{children}</div>
          {footer && <div className="ui-modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};