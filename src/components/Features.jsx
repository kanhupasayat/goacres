import { FiSearch, FiMapPin, FiMessageCircle, FiUsers, FiZap, FiThumbsUp } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './Features.css';

const featureIcons = [
  <FiSearch />,
  <FiMapPin />,
  <FiUsers />,
  <FiMessageCircle />,
  <FiThumbsUp />,
  <FiZap />
];

const Features = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t, tArray } = useTranslation();

  const cards = tArray('features.cards');

  return (
    <section className="features section" id="features">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
        >
          <h2>{t('features.sectionTitle')}</h2>
          <p>{t('features.sectionSubtitle')}</p>
        </div>

        <div ref={gridRef} className="features-grid">
          {cards.map((card, index) => (
            <div
              className={`feature-card animate-fade-up stagger-${index + 1} ${gridVisible ? 'is-visible' : ''}`}
              key={index}
            >
              <div className="feature-icon">
                {featureIcons[index]}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
