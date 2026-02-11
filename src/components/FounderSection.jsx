import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './FounderSection.css';

const FounderSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { t, tArray } = useTranslation();

  const stats = tArray('founder.stats');

  return (
    <section className="founder-section" ref={sectionRef}>
      <div className="founder-bg" />
      <div className="container">
        <div className={`founder-card ${isVisible ? 'is-visible' : ''}`}>

          {/* Avatar Initial */}
          <div className="founder-avatar">
            <span>{t('founder.name').charAt(0)}</span>
          </div>

          <span className="founder-label">{t('founder.label')}</span>
          <h3 className="founder-name">{t('founder.name')}</h3>
          <span className="founder-title">{t('founder.title')}</span>

          <div className="founder-divider"></div>

          <blockquote className="founder-quote">
            "{t('founder.quote')}"
          </blockquote>

          {/* Stats */}
          <div className="founder-stats">
            {stats.map((stat, index) => (
              <div className="founder-stat" key={index}>
                <span className="founder-stat-value">{stat.value}</span>
                <span className="founder-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderSection;
