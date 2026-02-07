import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useTranslation } from '../hooks/useTranslation';
import './ExitPopup.css';

const WHATSAPP_NUMBER = '916370997812';

const ExitPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('exitPopupShown');
    if (alreadyShown) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShowPopup(true);
        sessionStorage.setItem('exitPopupShown', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    // For mobile: show after 45 seconds of browsing
    const mobileTimer = setTimeout(() => {
      if (window.innerWidth <= 768 && !sessionStorage.getItem('exitPopupShown')) {
        setShowPopup(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    }, 45000);

    // Desktop: mouse leave detection
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('exitPopup.whatsappMessage'))}`;

  if (!showPopup) return null;

  return (
    <div className="exit-popup-overlay" onClick={closePopup}>
      <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
        <button className="exit-popup-close" onClick={closePopup}>
          <FiX />
        </button>

        <div className="exit-popup-content">
          <div className="exit-popup-emoji">{t('exitPopup.emoji')}</div>
          <h2>{t('exitPopup.heading')}</h2>
          <h3>{t('exitPopup.subheading')}</h3>
          <p>
            {t('exitPopup.description')}
          </p>

          <a
            href={whatsappUrl}
            className="exit-popup-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>{t('exitPopup.button')}</span>
          </a>

          <button className="exit-popup-dismiss" onClick={closePopup}>
            {t('exitPopup.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;
