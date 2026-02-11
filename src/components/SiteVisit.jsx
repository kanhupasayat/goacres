import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './SiteVisit.css';

const WHATSAPP_NUMBER = '919187428518';

const SiteVisit = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { t, tArray } = useTranslation();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('siteVisit.whatsappMessage'))}`;
  const benefits = tArray('siteVisit.benefits');
  const stats = tArray('siteVisit.stats');

  return (
    <section className="site-visit-section" ref={sectionRef}>
      <div className="site-visit-bg"></div>
      <div className="container">
        <div className={`site-visit-card ${isVisible ? 'is-visible' : ''}`}>
          <div className="site-visit-content">
            <div className="site-visit-badge">
              <FiCalendar />
              <span>{t('siteVisit.badge')}</span>
            </div>
            <h2>{t('siteVisit.heading')}</h2>
            <p className="site-visit-subtitle">
              {t('siteVisit.subtitle')}
            </p>

            <ul className="site-visit-benefits">
              {benefits.map((benefit, index) => (
                <li key={index}>
                  <FiCheckCircle />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappUrl}
              className="site-visit-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              <span>{t('siteVisit.button')}</span>
            </a>

            <p className="site-visit-note">
              <FiMapPin /> {t('siteVisit.note')}
            </p>
          </div>

          <div className="site-visit-visual">
            {stats.map((stat, index) => (
              <div className={`visit-stat-card ${index === stats.length - 1 ? 'accent' : ''}`} key={index}>
                <span className="visit-stat-number">{stat.value}</span>
                <span className="visit-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteVisit;
