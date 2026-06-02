import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaCheckDouble } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useTranslation } from '../hooks/useTranslation';
import { trackEvent } from '../utils/analytics';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const { t } = useTranslation();
  const chatBodyRef = useRef(null);

  const phoneNumber = '919187428518';

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Chat animation sequence
  useEffect(() => {
    if (!isOpen) {
      setChatStep(0);
      return;
    }

    const timers = [];

    // Step 1: Customer message appears
    timers.push(setTimeout(() => setChatStep(1), 400));
    // Step 2: Typing indicator
    timers.push(setTimeout(() => setChatStep(2), 1300));
    // Step 3: First reply
    timers.push(setTimeout(() => setChatStep(3), 2500));
    // Step 4: Typing again
    timers.push(setTimeout(() => setChatStep(4), 3200));
    // Step 5: Second reply
    timers.push(setTimeout(() => setChatStep(5), 4500));

    return () => timers.forEach(clearTimeout);
  }, [isOpen]);

  // Auto-scroll chat body
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatStep]);

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { plotTitle: 'General Enquiry', page: 'WhatsAppWidget' });
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(t('whatsappWidget.defaultMessage'))}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Mobile backdrop — outside widget for clean z-index */}
      {isOpen && (
        <div className="whatsapp-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Chat Popup — outside widget for clean z-index */}
      {isOpen && (
        <div className="whatsapp-popup">
          {/* Header */}
          <div className="popup-header">
            <div className="popup-avatar">
              <img className="popup-avatar-logo" src="/logo.png" alt="GOACRES" />
            </div>
            <div className="popup-info">
              <span className="popup-name">{t('whatsappWidget.popupName')}</span>
              <span className="popup-status">
                <span className="status-dot" />
                {t('whatsappWidget.popupStatus')}
              </span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="popup-body" ref={chatBodyRef}>
            {/* Customer message - right side green */}
            {chatStep >= 1 && (
              <div className="chat-msg chat-msg-right msg-animate">
                <div className="chat-bubble chat-bubble-green">
                  <p>{t('whatsappWidget.customerMsg')}</p>
                  <span className="chat-meta">
                    {timeStr}
                    <FaCheckDouble className="chat-tick tick-blue" />
                  </span>
                </div>
              </div>
            )}

            {/* Typing indicator (before reply 1) */}
            {chatStep === 2 && (
              <div className="chat-msg chat-msg-left msg-animate">
                <div className="chat-bubble chat-bubble-white typing-bubble">
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            {/* GOACRES reply 1 */}
            {chatStep >= 3 && (
              <div className="chat-msg chat-msg-left msg-animate">
                <div className="chat-bubble chat-bubble-white">
                  <p>{t('whatsappWidget.replyMsg1')}</p>
                  <span className="chat-meta">{timeStr}</span>
                </div>
              </div>
            )}

            {/* Typing indicator for second message */}
            {chatStep === 4 && (
              <div className="chat-msg chat-msg-left msg-animate">
                <div className="chat-bubble chat-bubble-white typing-bubble">
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            {/* GOACRES reply 2 */}
            {chatStep >= 5 && (
              <div className="chat-msg chat-msg-left msg-animate">
                <div className="chat-bubble chat-bubble-white">
                  <p>{t('whatsappWidget.replyMsg2')}</p>
                  <span className="chat-meta">{timeStr}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="popup-footer">
            <button className="start-chat-btn" onClick={handleWhatsAppClick}>
              <FaWhatsapp />
              {t('whatsappWidget.startChat')}
            </button>
          </div>
        </div>
      )}

      {/* Floating Button + Tooltip */}
      <div className="whatsapp-widget">
        <button
          className={`whatsapp-button ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp Chat"
        >
          {isOpen ? <FiX /> : <FaWhatsapp />}
          <span className="button-pulse"></span>
        </button>

        {!isOpen && (
          <div className="whatsapp-tooltip">
            {t('whatsappWidget.tooltip')}
          </div>
        )}
      </div>
    </>
  );
};

export default WhatsAppWidget;
