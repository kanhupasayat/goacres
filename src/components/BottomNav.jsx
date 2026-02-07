import { useState, useEffect, useRef } from 'react';
import { FiHome, FiGrid, FiInfo, FiPhone } from 'react-icons/fi';
import './BottomNav.css';

const tabs = [
  { id: 'home', label: 'Home', icon: <FiHome />, href: '#home' },
  { id: 'listings', label: 'Plots', icon: <FiGrid />, href: '#listings' },
  { id: 'about', label: 'About', icon: <FiInfo />, href: '#about' },
  { id: 'contact', label: 'Contact', icon: <FiPhone />, href: '#contact' },
];

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

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
    e.preventDefault();
    setActiveTab(tab.id);
    const el = document.getElementById(tab.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`bottom-nav ${isVisible ? '' : 'bottom-nav--hidden'}`}>
      <div className="bottom-nav-inner">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.href}
            className={`bottom-nav-tab ${activeTab === tab.id ? 'bottom-nav-tab--active' : ''}`}
            onClick={(e) => handleTabClick(e, tab)}
          >
            <span className="bottom-nav-icon">{tab.icon}</span>
            <span className="bottom-nav-label">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
