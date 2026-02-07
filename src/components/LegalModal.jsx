import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './LegalModal.css';

const LegalModal = ({ title, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-header">
          <h2>{title}</h2>
          <button className="legal-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="legal-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
