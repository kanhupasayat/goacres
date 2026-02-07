import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './SiteVisit.css';

const WHATSAPP_NUMBER = '916370997812';

const SiteVisit = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! Mujhe Rourkela me plot dekhna hai. Site visit ke baare me batao.')}`;

  return (
    <section className="site-visit-section" ref={sectionRef}>
      <div className="site-visit-bg"></div>
      <div className="container">
        <div className={`site-visit-card ${isVisible ? 'is-visible' : ''}`}>
          <div className="site-visit-content">
            <div className="site-visit-badge">
              <FiCalendar />
              <span>100% FREE</span>
            </div>
            <h2>Plot Dekhna Hai? Baat Karo!</h2>
            <p className="site-visit-subtitle">
              Photo me aur asli me bahut fark hota hai. WhatsApp karo — hum broker se site visit arrange karwa denge, bilkul free.
            </p>

            <ul className="site-visit-benefits">
              <li>
                <FiCheckCircle />
                <span>Broker se direct milke plot dekh sakte ho</span>
              </li>
              <li>
                <FiCheckCircle />
                <span>Dekhne ke baad koi pressure nahi — apna time lo</span>
              </li>
            </ul>

            <a
              href={whatsappUrl}
              className="site-visit-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              <span>Plot Dekhna Hai — WhatsApp Karo</span>
            </a>

            <p className="site-visit-note">
              <FiMapPin /> Rourkela ke sabhi areas me plots available
            </p>
          </div>

          <div className="site-visit-visual">
            <div className="visit-stat-card">
              <span className="visit-stat-number">50+</span>
              <span className="visit-stat-label">Plots Listed</span>
            </div>
            <div className="visit-stat-card">
              <span className="visit-stat-number">30 min</span>
              <span className="visit-stat-label">Me Response</span>
            </div>
            <div className="visit-stat-card accent">
              <span className="visit-stat-number">FREE</span>
              <span className="visit-stat-label">Buyers Ke Liye</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteVisit;
