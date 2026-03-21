import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import { getCachedPlots, awaitPlots, prefetchPlots } from '../utils/plotsCache';
import './RecentlySold.css';

const WHATSAPP_NUMBER = '919187428518';

const fallbackSold = [
  {
    id: 1,
    title: 'Residential Plot',
    location: 'Koel Nagar, Rourkela',
    sqft: 1600,
    photos: ['/plots/sold/1.webp']
  },
  {
    id: 2,
    title: 'Farm House Land',
    location: 'Vedvyas, Rourkela',
    sqft: 3200,
    photos: ['/plots/sold/2.jpg']
  },
  {
    id: 3,
    title: 'Premium Corner Plot',
    location: 'Fertilizer, Rourkela',
    sqft: 2400,
    photos: ['/plots/sold/3.jpg']
  }
];

const RecentlySold = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t, tArray } = useTranslation();
  const [soldProperties, setSoldProperties] = useState(fallbackSold);

  useEffect(() => {
    const cached = getCachedPlots();
    if (cached && cached.length > 0) {
      const sold = cached.filter(p => p.status === 'Sold').slice(0, 3);
      if (sold.length > 0) setSoldProperties(sold);
    } else {
      prefetchPlots();
      awaitPlots().then(apiPlots => {
        if (apiPlots && apiPlots.length > 0) {
          const sold = apiPlots.filter(p => p.status === 'Sold').slice(0, 3);
          if (sold.length > 0) setSoldProperties(sold);
        }
      });
    }
  }, []);

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
              key={property.id || property.slug || index}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="sold-card-image">
                <img src={property.photos?.[0] || property.image} alt={property.title} loading="lazy" decoding="async" />
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
                <span className="sold-size">{property.sqft ? `${property.sqft.toLocaleString()} Sq.Ft` : property.size}</span>
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
