import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { showLanguageSelector, changeLanguage } = useLanguage();

  if (!showLanguageSelector) return null;

  return (
    <div className="lang-selector-overlay">
      <div className="lang-selector-modal">
        <div className="lang-selector-brand">GOACRES</div>
        <h2 className="lang-selector-title">Choose Your Language</h2>
        <p className="lang-selector-subtitle">Apni bhasha chunein</p>

        <div className="lang-selector-buttons">
          <button
            className="lang-selector-btn lang-btn-hi"
            onClick={() => changeLanguage('hi')}
          >
            <span className="lang-btn-label">Hinglish</span>
            <span className="lang-btn-desc">Hindi + English Mix</span>
          </button>
          <button
            className="lang-selector-btn lang-btn-en"
            onClick={() => changeLanguage('en')}
          >
            <span className="lang-btn-label">English</span>
            <span className="lang-btn-desc">Full English</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
