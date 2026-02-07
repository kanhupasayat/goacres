import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import './ExitPopup.css';

const WHATSAPP_NUMBER = '916370997812';

const ExitPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

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

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! Mujhe exclusive plots ki details chahiye jo website pe nahi hain. Please share karo.')}`;

  if (!showPopup) return null;

  return (
    <div className="exit-popup-overlay" onClick={closePopup}>
      <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
        <button className="exit-popup-close" onClick={closePopup}>
          <FiX />
        </button>

        <div className="exit-popup-content">
          <div className="exit-popup-emoji">🔥</div>
          <h2>Ruko!</h2>
          <h3>3 Naye Plots Aaye Hain Jo<br />Abhi Website Pe Nahi Hain</h3>
          <p>
            Ye exclusive plots sirf WhatsApp pe available hain — limited time ke liye. Abhi pucho, kal shayad bik jaayein.
          </p>

          <a
            href={whatsappUrl}
            className="exit-popup-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>Exclusive Plots Dekho — WhatsApp</span>
          </a>

          <button className="exit-popup-dismiss" onClick={closePopup}>
            Nahi chahiye, main baad me dekhunga
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;
