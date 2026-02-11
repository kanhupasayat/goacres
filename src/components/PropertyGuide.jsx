import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiInfo, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './PropertyGuide.css';

const WHATSAPP_NUMBER = '919187428518';

const PropertyGuide = () => {
  const [activeTab, setActiveTab] = useState('benefit');
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation({ threshold: 0.2 });
  const { t, tArray } = useTranslation();

  const directItems = tArray('propertyGuide.directCard.items');
  const verifiedItems = tArray('propertyGuide.verifiedCard.items');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('propertyGuide.whatsappMessage'))}`;

  return (
    <section className="property-guide section">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
        >
          <span className="pg-label">{t('propertyGuide.sectionLabel')}</span>
          <h2>{t('propertyGuide.sectionTitle')}</h2>
        </div>

        {/* Mobile Tabs */}
        <div className="pg-tabs">
          <button
            className={`pg-tab pg-tab-benefit ${activeTab === 'benefit' ? 'pg-tab-active' : ''}`}
            onClick={() => setActiveTab('benefit')}
          >
            <FiCheckCircle />
            <span>{t('propertyGuide.verifiedCard.title')}</span>
          </button>
          <button
            className={`pg-tab pg-tab-risk ${activeTab === 'risk' ? 'pg-tab-active' : ''}`}
            onClick={() => setActiveTab('risk')}
          >
            <FiInfo />
            <span>{t('propertyGuide.directCard.title')}</span>
          </button>
        </div>

        <div ref={cardsRef} className="pg-comparison">
          {/* Risk Card */}
          <div className={`pg-card pg-card-risk animate-fade-up stagger-1 ${cardsVisible ? 'is-visible' : ''} ${activeTab === 'risk' ? 'pg-card-mob-active' : ''}`}>
            <h3 className="pg-card-title pg-card-title-risk">
              {t('propertyGuide.directCard.title')}
            </h3>
            <ul className="pg-list">
              {directItems.map((item, index) => (
                <li key={index} className="pg-list-item pg-list-item-risk">
                  <span className="pg-icon pg-icon-risk">
                    <FiInfo />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits Card */}
          <div className={`pg-card pg-card-benefit animate-fade-up stagger-2 ${cardsVisible ? 'is-visible' : ''} ${activeTab === 'benefit' ? 'pg-card-mob-active' : ''}`}>
            <span className="pg-badge">{t('propertyGuide.verifiedCard.badge')}</span>
            <h3 className="pg-card-title pg-card-title-benefit">
              {t('propertyGuide.verifiedCard.title')}
            </h3>
            <ul className="pg-list">
              {verifiedItems.map((item, index) => (
                <li key={index} className="pg-list-item pg-list-item-benefit">
                  <span className="pg-icon pg-icon-benefit">
                    <FiCheckCircle />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mission Statement */}
        <div
          ref={missionRef}
          className={`pg-mission animate-fade-up ${missionVisible ? 'is-visible' : ''}`}
        >
          <FiShield className="pg-mission-icon" />
          <p>{t('propertyGuide.mission')}</p>
        </div>

        {/* CTA Button */}
        <div className="pg-cta-wrap">
          <a
            href={whatsappUrl}
            className="pg-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>{t('propertyGuide.cta')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PropertyGuide;
