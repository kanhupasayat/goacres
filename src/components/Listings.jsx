import { useState } from 'react';
import { FiMapPin, FiMaximize2, FiHome, FiAward, FiLock, FiEye, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './Listings.css';

const WHATSAPP_NUMBER = '916370997812';

const properties = [
  {
    id: 1,
    title: 'Premium Corner Plot',
    location: 'Civil Township, Rourkela',
    sizeRange: '2,000 - 2,500',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Residential',
    highlight: 'Corner Plot',
    viewers: 14,
    plotsLeft: 2
  },
  {
    id: 2,
    title: 'Commercial Plot - Main Road',
    location: 'Sector 19, Rourkela',
    sizeRange: '3,000 - 3,500',
    image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Commercial',
    highlight: 'Main Road Facing',
    viewers: 9,
    plotsLeft: 1
  },
  {
    id: 3,
    title: 'Residential Plot - Ready',
    location: 'Koel Nagar, Rourkela',
    sizeRange: '1,400 - 1,800',
    image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Residential',
    highlight: 'Ready for Construction',
    viewers: 21,
    plotsLeft: 3
  },
  {
    id: 4,
    title: 'Farm House Land',
    location: 'Vedvyas, Rourkela',
    sizeRange: '4,500 - 5,500',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Farm House',
    highlight: 'Scenic View',
    viewers: 7,
    plotsLeft: 1
  },
  {
    id: 5,
    title: 'Budget Friendly Plot',
    location: 'Chhend Colony, Rourkela',
    sizeRange: '1,000 - 1,400',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Residential',
    highlight: 'Budget Friendly',
    viewers: 18,
    plotsLeft: 4
  },
  {
    id: 6,
    title: 'Prime Commercial Space',
    location: 'Main Road, Rourkela',
    sizeRange: '4,000 - 5,000',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Commercial',
    highlight: 'High Footfall Area',
    viewers: 11,
    plotsLeft: 1
  }
];

const Listings = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t } = useTranslation();

  const filters = [
    { id: 'all', label: t('listings.filterTabs.all') },
    { id: 'residential', label: t('listings.filterTabs.residential') },
    { id: 'commercial', label: t('listings.filterTabs.commercial') },
    { id: 'farmhouse', label: t('listings.filterTabs.farmHouse') }
  ];

  const filteredProperties = activeFilter === 'all'
    ? properties
    : properties.filter(p => p.type.toLowerCase().replace(' ', '') === activeFilter.toLowerCase().replace(' ', ''));

  const getWhatsAppUrl = (property) => {
    const message = t('listings.whatsappMessage').replace('{title}', property.title).replace('{location}', property.location);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="listings-premium section" id="listings">
      <div className="listings-bg-pattern"></div>
      <div className="listings-glow listings-glow-1"></div>
      <div className="listings-glow listings-glow-2"></div>

      <div className="container">
        <div
          ref={titleRef}
          className={`premium-section-header ${titleVisible ? 'is-visible' : ''}`}
        >
          <div className="premium-label">
            <FiAward />
            <span>{t('listings.premiumLabel')}</span>
          </div>
          <h2 className="premium-title">
            <span className="title-line">{t('listings.titleLine1')}</span>
            <span className="title-highlight">{t('listings.titleHighlight')}</span>
          </h2>
          <p className="premium-subtitle">
            {t('listings.subtitle')}
          </p>

          <div className="urgency-banner">
            <FiClock />
            <span>{t('listings.urgencyPrefix')} <strong>{properties.length} {t('listings.urgencyPlotsText')}</strong> {t('listings.urgencySuffix')}</span>
          </div>

          <div className="filter-tabs">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="premium-listings-grid" id="listings-scroll">
          {filteredProperties.map((property, index) => (
            <div
              className={`premium-property-card ${gridVisible ? 'is-visible' : ''}`}
              key={property.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="premium-card-image">
                <img src={property.image} alt={property.title} loading="lazy" decoding="async" />
                <div className="image-overlay"></div>

                <div className="premium-badges">
                  {property.plotsLeft <= 2 && (
                    <span className="badge-urgent">
                      {t('listings.badgeUrgent').replace('{count}', property.plotsLeft)}
                    </span>
                  )}
                  <span className="badge-new">{property.type}</span>
                </div>

                {/* Viewer count */}
                <div className="viewer-count">
                  <FiEye />
                  <span>{property.viewers} {t('listings.viewerText')}</span>
                </div>

                <div className="quick-view-overlay">
                  <a
                    href={getWhatsAppUrl(property)}
                    className="quick-view-btn whatsapp-overlay-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp style={{ marginRight: '8px' }} />
                    <span>{t('listings.priceCta')}</span>
                  </a>
                </div>
              </div>

              <div className="premium-card-content">
                <div className="property-type-tag">
                  <FiHome />
                  <span>{property.highlight}</span>
                </div>

                <h3 className="premium-property-title">{property.title}</h3>

                <div className="premium-property-location">
                  <FiMapPin />
                  <span>{property.location}</span>
                </div>

                <div className="property-stats">
                  <div className="stat-item">
                    <FiMaximize2 />
                    <span><strong>{property.sizeRange}</strong> Sq.Ft</span>
                  </div>
                </div>

                {/* Blurred Price */}
                <div className="price-hidden-section">
                  <div className="price-blurred">
                    <FiLock className="lock-icon" />
                    <span className="blurred-amount">&#8377; XX,XX,XXX</span>
                  </div>
                  <a
                    href={getWhatsAppUrl(property)}
                    className="premium-cta-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp />
                    <span>{t('listings.priceCta')}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swipe-hint">{t('listings.swipeHint')}</div>

        {/* Secret Deals Banner */}
        <div className="secret-deals-banner">
          <div className="secret-deals-content">
            <div className="secret-icon">&#128274;</div>
            <h3>{t('listings.secretDeals.title')}</h3>
            <p>{t('listings.secretDeals.description')}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('listings.secretDeals.whatsappMessage'))}`}
              className="secret-deals-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              <span>{t('listings.secretDeals.button')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listings;
