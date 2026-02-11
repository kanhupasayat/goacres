import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './RecentlySold.css';

const WHATSAPP_NUMBER = '919187428518';

const soldProperties = [
  {
    id: 1,
    title: 'Residential Plot',
    location: 'Koel Nagar, Rourkela',
    size: '1,600 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Commercial Plot',
    location: 'Sector 19, Rourkela',
    size: '3,200 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Corner Plot - Premium',
    location: 'Civil Township, Rourkela',
    size: '2,400 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

const RecentlySold = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t, tArray } = useTranslation();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('recentlySold.whatsappMessage'))}`;
  const soldTimes = tArray('recentlySold.soldTimes');

  return (
    <section className="recently-sold section" ref={sectionRef}>
      <div className="container">
        <div className={`sold-header ${isVisible ? 'is-visible' : ''}`}>
          <h2>{t('recentlySold.heading')} <span className="sold-highlight">{t('recentlySold.headingHighlight')}</span></h2>
          <p>{t('recentlySold.subtitle')}</p>
        </div>

        <div className="sold-grid">
          {soldProperties.map((property, index) => (
            <div
              className={`sold-card ${isVisible ? 'is-visible' : ''}`}
              key={property.id}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="sold-card-image">
                <img src={property.image} alt={property.title} loading="lazy" decoding="async" />
                <div className="sold-overlay"></div>
                <div className="sold-stamp">{t('recentlySold.soldStamp')}</div>
                <div className="sold-time">{soldTimes[index]}</div>
              </div>
              <div className="sold-card-content">
                <h4>{property.title}</h4>
                <div className="sold-location">
                  <FiMapPin />
                  <span>{property.location}</span>
                </div>
                <span className="sold-size">{property.size}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`sold-cta ${isVisible ? 'is-visible' : ''}`}>
          <p className="sold-cta-text">{t('recentlySold.ctaText')}</p>
          <a
            href={whatsappUrl}
            className="sold-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>{t('recentlySold.ctaButton')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentlySold;
