import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { useTranslation } from '../hooks/useTranslation';
import { trackEvent } from '../utils/analytics';
import './Hero.css';

const WHATSAPP_NUMBER = '919187428518';

const Hero = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [animState, setAnimState] = useState('in'); // 'in' | 'out'
  const { t, tArray } = useTranslation();

  const rotatingWords = tArray('hero.h1RotatingWords');

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!rotatingWords || rotatingWords.length <= 1) return;
    const interval = setInterval(() => {
      setAnimState('out');
      setTimeout(() => {
        setWordIndex(prev => (prev + 1) % rotatingWords.length);
        setAnimState('in');
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, [rotatingWords?.length]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('hero.whatsappMessage'))}`;

  return (
    <section className="hero" id="home">
      {/* Background Video */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://res.cloudinary.com/dx9tverbw/video/upload/so_0,w_1280,q_70,f_jpg/v1770928268/fyqxsvjhegjl7t20zfx9.jpg"
      >
        <source src="https://res.cloudinary.com/dx9tverbw/video/upload/q_auto,f_auto/v1770928268/fyqxsvjhegjl7t20zfx9.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className={`hero-text animate-fade-up ${heroLoaded ? 'is-visible' : ''}`}>
          <p className="hero-tag">{t('hero.tag')}</p>
          <h1>
            <span className="hero-h1-part1">{t('hero.h1Part1')}</span>{' '}
            <span className={`hero-h1-part2 rotate-word rotate-${animState}`}>
              {rotatingWords?.[wordIndex] || t('hero.h1Part2')}
            </span>
          </h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
        </div>

        <div className={`hero-cta-group animate-fade-up stagger-2 ${heroLoaded ? 'is-visible' : ''}`}>
          <a
            href={whatsappUrl}
            className="btn btn-whatsapp-hero"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { plotTitle: 'General Enquiry', page: 'Hero' })}
          >
            <FaWhatsapp />
            <span>{t('hero.cta')}</span>
          </a>
          <a
            href="tel:+919187428518"
            className="btn btn-call-hero"
            onClick={() => trackEvent('call_click', { plotTitle: 'General Enquiry', page: 'Hero' })}
          >
            <FiPhone />
            <span>{t('hero.callButton')}</span>
          </a>
        </div>

        <p className={`hero-trust-line animate-fade-up stagger-3 ${heroLoaded ? 'is-visible' : ''}`}>
          {t('hero.trustLine')}
        </p>
      </div>

      <div className="scroll-indicator scroll-indicator-animated">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
