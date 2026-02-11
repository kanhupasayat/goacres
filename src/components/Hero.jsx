import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { useTranslation } from '../hooks/useTranslation';
import './Hero.css';

const heroImages = [
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/29/89/f6/img-20160930-094803-largejpg.jpg?w=2000&h=-1&s=1',
  'https://avathioutdoors.gumlet.io/travelGuide/dev/rourkela_P3166.jpg',
  'https://images.unsplash.com/photo-1518196744992-78329b7b6614?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1600761650077-46a4f5a4c3ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1606707761551-e36dc1a23f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1730405704088-3d8f36e32b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1738714064251-dd573bfe4075?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
];

const WHATSAPP_NUMBER = '919187428518';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroRef = useRef(null);
  const slideIntervalRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        if (scrolled < heroHeight) {
          setParallaxOffset(scrolled * 0.12);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('hero.whatsappMessage'))}`;

  return (
    <section className="hero hero-parallax" id="home" ref={heroRef}>
      <div
        className="hero-slideshow-container"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
      </div>
      <div className="hero-slideshow-overlay"></div>

      <div className="container hero-content">
        <div className={`hero-text animate-fade-up ${heroLoaded ? 'is-visible' : ''}`}>
          <p className="hero-tag">{t('hero.tag')}</p>
          <h1>{t('hero.h1')}</h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className={`hero-cta-group animate-fade-up stagger-2 ${heroLoaded ? 'is-visible' : ''}`}>
          <a
            href={whatsappUrl}
            className="btn btn-whatsapp-hero"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>{t('hero.cta')}</span>
          </a>
          <a href="tel:+919187428518" className="btn btn-call-hero">
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
