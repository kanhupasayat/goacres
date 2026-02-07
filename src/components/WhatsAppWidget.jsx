import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = '916370997812';
  const defaultMessage = 'Hello! I am interested in buying a plot. Please share more details.';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-widget">
      {/* Popup Message */}
      {isOpen && (
        <div className="whatsapp-popup">
          <div className="popup-header">
            <div className="popup-avatar">
              <FaWhatsapp />
            </div>
            <div className="popup-info">
              <span className="popup-name">GOACRES</span>
              <span className="popup-status">Typically replies instantly</span>
            </div>
            <button className="popup-close" onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
          </div>
          <div className="popup-body">
            <div className="popup-message">
              <p>Hi there! 👋</p>
              <p>How can we help you today? Click below to chat with us on WhatsApp.</p>
            </div>
          </div>
          <div className="popup-footer">
            <button className="start-chat-btn" onClick={handleWhatsAppClick}>
              <FaWhatsapp />
              Start Chat
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`whatsapp-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp Chat"
      >
        {isOpen ? <FiX /> : <FaWhatsapp />}
        <span className="button-pulse"></span>
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="whatsapp-tooltip">
          Chat with us!
        </div>
      )}
    </div>
  );
};

export default WhatsAppWidget;
