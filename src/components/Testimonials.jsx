import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './Testimonials.css';

const Testimonials = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { tArray, t } = useTranslation();

  const items = tArray('whyChooseUs.testimonials.items');

  return (
    <section className="testimonials-section section" ref={sectionRef}>
      <div className="testimonials-bg">
        <div className="testimonials-glow testimonials-glow-1"></div>
        <div className="testimonials-glow testimonials-glow-2"></div>
      </div>

      <div className="container">
        <div className={`testimonials-header ${isVisible ? 'is-visible' : ''}`}>
          <span className="testimonials-label">TESTIMONIALS</span>
          <h2>{t('whyChooseUs.testimonials.title')}</h2>
        </div>

        <div className="testimonials-grid">
          {items.map((item, index) => (
            <div
              className={`testimonial-card ${isVisible ? 'is-visible' : ''}`}
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="testimonial-quote-icon">
                <FaQuoteLeft />
              </div>

              <div className="testimonial-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <FaStar key={s} />
                ))}
              </div>

              <p className="testimonial-text">{item.text}</p>

              <div className="testimonial-divider"></div>

              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {item.name.charAt(0)}
                </div>
                <div className="testimonial-info">
                  <span className="testimonial-name">{item.name}</span>
                  <span className="testimonial-location">
                    <FiMapPin />
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
