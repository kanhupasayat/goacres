import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAward, FiShoppingBag, FiSun } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import staticPlots from '../data/plots';
import './Listings.css';

const WHATSAPP_NUMBER = '919187428518';
const API_URL = import.meta.env.VITE_API_URL || '';

const Listings = () => {
  const [plots, setPlots] = useState(staticPlots);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t } = useTranslation();

  // Static data loads instantly, API updates silently in background
  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/api/plots?limit=100`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const list = data.plots || data;
        if (list && list.length > 0) setPlots(list);
      })
      .catch(() => {});
  }, []);

  // Build 3 category cards from plots data
  const categories = useMemo(() => {
    const types = [
      { id: 'Residential', icon: <FiHome />, titleKey: 'listings.residential.title', descKey: 'listings.residential.desc' },
      { id: 'Commercial', icon: <FiShoppingBag />, titleKey: 'listings.commercial.title', descKey: 'listings.commercial.desc' },
      { id: 'Farm House', icon: <FiSun />, titleKey: 'listings.farmHouse.title', descKey: 'listings.farmHouse.desc' },
    ];

    return types.map(type => {
      const matching = plots.filter(p => p.type === type.id);
      const photo = matching.length > 0 ? matching[0].photos[0] : null;
      return { ...type, count: matching.length, photo };
    });
  }, [plots]);

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
        </div>

        {/* Category Cards */}
        <div ref={gridRef} className="category-grid">
          {categories.map((cat, index) => (
            <Link
              to={`/plots?type=${encodeURIComponent(cat.id)}`}
              className={`category-card ${gridVisible ? 'is-visible' : ''}`}
              key={cat.id}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="category-card-image">
                {cat.photo && <img src={cat.photo} alt={t(cat.titleKey)} loading="lazy" />}
                <div className="category-card-overlay"></div>
                <span className="category-card-icon">{cat.icon}</span>
              </div>

              <div className="category-card-content">
                <h3 className="category-card-title">{t(cat.titleKey)}</h3>
                <p className="category-card-desc">{t(cat.descKey)}</p>
                <div className="category-card-footer">
                  <span className="category-card-count">{cat.count} {t('listings.plotsAvailable')}</span>
                  <span className="category-card-cta">{t('listings.exploreCta')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="view-all-wrap">
          <Link to="/plots" className="view-all-btn">
            {t('listings.viewAllButton')} →
          </Link>
        </div>

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
