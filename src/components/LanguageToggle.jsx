import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  const toggle = () => {
    changeLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <button className="lang-toggle" onClick={toggle} aria-label="Toggle language">
      {/* Desktop pill with sliding indicator */}
      <span className="lang-toggle-pill">
        <span className={`lang-toggle-slider ${language === 'en' ? 'slider-right' : ''}`} />
        <span className={`lang-toggle-option ${language === 'hi' ? 'active' : ''}`}>
          <span className="lang-flag">हि</span>
          <span className="lang-label">HI</span>
        </span>
        <span className={`lang-toggle-option ${language === 'en' ? 'active' : ''}`}>
          <span className="lang-flag">EN</span>
          <span className="lang-label">EN</span>
        </span>
      </span>

      {/* Mobile button */}
      <span className={`lang-toggle-mobile ${language === 'en' ? 'is-en' : ''}`}>
        <span className="lang-mobile-text">{language === 'hi' ? 'हि' : 'EN'}</span>
        <span className="lang-mobile-switch">
          <span className="lang-mobile-dot" />
        </span>
      </span>
    </button>
  );
};

export default LanguageToggle;
