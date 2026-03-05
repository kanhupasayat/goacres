import { FaWhatsapp } from 'react-icons/fa';
import { FiHome, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './ListProperty.css';

const WHATSAPP_NUMBER = '919187428518';

const ListProperty = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { t, tArray } = useTranslation();

  const benefits = tArray('listProperty.benefits');
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('listProperty.whatsappMessage'))}`;

  return (
    <section className="list-property-section" ref={sectionRef}>
      <div className="list-property-bg"></div>
      <div className="container">
        <div className={`list-property-card ${isVisible ? 'is-visible' : ''}`}>
          <div className="list-property-content">
            <span className="list-property-badge">{t('listProperty.badge')}</span>
            <h2>{t('listProperty.heading')}</h2>
            <p className="list-property-subtitle">{t('listProperty.subtitle')}</p>

            <div className="list-property-benefits">
              {benefits.map((benefit, index) => (
                <div className="list-property-benefit" key={index}>
                  <div className="list-property-benefit-icon">
                    {index === 0 ? <FiUsers /> : index === 1 ? <FiTrendingUp /> : <FiHome />}
                  </div>
                  <div>
                    <strong>{benefit.title}</strong>
                    <p>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl}
              className="list-property-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              <span>{t('listProperty.button')}</span>
            </a>

            <p className="list-property-note">{t('listProperty.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListProperty;
