import { useState, useEffect, useRef } from 'react';
import { RiHomeLine, RiHomeFill, RiMapPin2Line, RiMapPin2Fill, RiShieldCheckLine, RiShieldCheckFill, RiChat1Line, RiChat1Fill } from 'react-icons/ri';
import { useTranslation } from '../hooks/useTranslation';
import './BottomNav.css';

const smoothScrollTo = (el, duration = 900) => {
  const start = window.scrollY;
  const target = el.getBoundingClientRect().top + start;
  const distance = target - start;
  let startTime = null;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', label: t('bottomNav.tabs.home'), iconOutline: <RiHomeLine />, iconFill: <RiHomeFill />, href: '/#home' },
    { id: 'listings', label: t('bottomNav.tabs.plots'), iconOutline: <RiMapPin2Line />, iconFill: <RiMapPin2Fill />, href: '/#listings' },
    { id: 'about', label: t('bottomNav.tabs.about'), iconOutline: <RiShieldCheckLine />, iconFill: <RiShieldCheckFill />, href: '/#about' },
    { id: 'contact', label: t('bottomNav.tabs.contact'), iconOutline: <RiChat1Line />, iconFill: <RiChat1Fill />, href: '/#contact' },
  ];

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active tab detection
  useEffect(() => {
    const sectionIds = ['home', 'listings', 'about', 'contact'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleTabClick = (e, tab) => {
    const el = document.getElementById(tab.id);
    if (el) {
      // On home page — scroll to section
      e.preventDefault();
      setActiveTab(tab.id);
      smoothScrollTo(el);
    }
    // On other pages — let the href (/#section) navigate to home
  };

  return (
    <nav className={`bottom-nav ${isVisible ? '' : 'bottom-nav--hidden'}`}>
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={`bottom-nav-tab ${isActive ? 'bottom-nav-tab--active' : ''}`}
              onClick={(e) => handleTabClick(e, tab)}
            >
              <span className="bottom-nav-icon">
                {isActive ? tab.iconFill : tab.iconOutline}
              </span>
              <span className="bottom-nav-label">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
