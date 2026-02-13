import { useState, useEffect, useRef, useCallback } from 'react';
import { FiCheckCircle, FiSearch, FiMessageCircle, FiMapPin, FiShield, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './WhyChooseUs.css';

const WHATSAPP_NUMBER = '919187428518';

const stepIcons = [<FiSearch />, <FiMessageCircle />, <FiMapPin />, <FiShield />];

// Parse "50+" → { num: 50, prefix: "", suffix: "+" }
// Parse "30 min" → { num: 30, prefix: "", suffix: " min" }
// Parse "FREE" → { num: null, prefix: "", suffix: "FREE" }
function parseStatValue(val) {
  const match = val.match(/^(\D*?)(\d+)(.*)$/);
  if (!match) return { num: null, prefix: '', suffix: val };
  return { num: parseInt(match[2], 10), prefix: match[1], suffix: match[3] };
}

// Counter-up hook
function useCountUp(target, isVisible, duration = 1800) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current || target === null) return;
    hasRun.current = true;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return target === null ? null : count;
}

const StatNumber = ({ value, isVisible }) => {
  const { num, prefix, suffix } = parseStatValue(value);
  const count = useCountUp(num, isVisible);

  if (num === null) return <span className="stat-number">{value}</span>;
  return <span className="stat-number">{prefix}{count}{suffix}</span>;
};

const WhyChooseUs = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: howRef, isVisible: howVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t, tArray } = useTranslation();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whyChooseUs.whatsappMessage'))}`;

  const stats = tArray('whyChooseUs.stats');
  const steps = tArray('whyChooseUs.howItWorks.steps');
  const benefits = tArray('whyChooseUs.whyChoose.benefits');
  const testimonials = tArray('whyChooseUs.testimonials.items');
  return (
    <section className="why-choose section" id="about">
      <div className="container">
        {/* Stats Section */}
        <div ref={statsRef} className="stats-container">
          {stats.map((stat, index) => (
            <div
              className={`stat-item animate-scale-up stagger-${index + 1} ${statsVisible ? 'is-visible' : ''}`}
              key={index}
            >
              <StatNumber value={stat.value} isVisible={statsVisible} />
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div ref={howRef} className={`how-it-works ${howVisible ? 'is-visible' : ''}`}>
          <div className="section-title" style={{ marginBottom: '40px' }}>
            <h2>{t('whyChooseUs.howItWorks.title')}</h2>
            <p>{t('whyChooseUs.howItWorks.subtitle')}</p>
          </div>
          <div className="how-steps">
            {steps.map((item, index) => (
              <div className={`how-step animate-fade-up stagger-${index + 1} ${howVisible ? 'is-visible' : ''}`} key={index}>
                <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="step-icon">{stepIcons[index]}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="how-cta">
            <a
              href={whatsappUrl}
              className="btn btn-whatsapp-consult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              {t('whyChooseUs.howItWorks.cta')}
            </a>
          </div>
        </div>

        <div className="why-choose-content">
          <div
            ref={contentRef}
            className={`why-choose-text animate-fade-right ${contentVisible ? 'is-visible' : ''}`}
          >
            <div
              ref={titleRef}
              className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
              style={{ textAlign: 'left', marginBottom: '30px' }}
            >
              <h2>{t('whyChooseUs.whyChoose.title')}</h2>
              <p>{t('whyChooseUs.whyChoose.subtitle')}</p>
            </div>

            <div className="mission-statement">
              <p>
                <strong>GOACRES</strong> {t('whyChooseUs.whyChoose.missionStatement').replace('GOACRES ', '')}
              </p>
            </div>

            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={`animate-fade-left stagger-${index + 1} ${contentVisible ? 'is-visible' : ''}`}
                >
                  <FiCheckCircle className="check-icon" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappUrl}
              className="btn btn-whatsapp-consult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              {t('whyChooseUs.whyChoose.cta')}
            </a>
          </div>

          {/* Testimonials */}
          <div
            ref={testimonialsRef}
            className={`testimonials-container animate-fade-left ${testimonialsVisible ? 'is-visible' : ''}`}
          >
            <h3>{t('whyChooseUs.testimonials.title')}</h3>
            <div className="testimonials-grid">
              {testimonials.map((item, index) => (
                <div
                  className={`testimonial-card animate-fade-up stagger-${index + 1} ${testimonialsVisible ? 'is-visible' : ''}`}
                  key={index}
                >
                  <div className="testimonial-rating">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} className="star-filled" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{item.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{item.name.charAt(0)}</div>
                    <div className="author-info">
                      <span className="author-name">{item.name}</span>
                      <span className="author-location">{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
