import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTranslation } from '../hooks/useTranslation';
import LanguageToggle from './LanguageToggle';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Logo */}
        <a href="#" className="logo">
          <span className="logo-brand">GOACRES</span>
        </a>

        {/* Desktop Navigation */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><a href="#home" onClick={closeMenu}>{t('header.nav.home')}</a></li>
            <li><a href="#listings" onClick={closeMenu}>{t('header.nav.buyPlots')}</a></li>
            <li><a href="#about" onClick={closeMenu}>{t('header.nav.aboutUs')}</a></li>
            <li><a href="#contact" onClick={closeMenu}>{t('header.nav.contact')}</a></li>
          </ul>
        </nav>

        {/* Language Toggle (replaces WhatsApp button) */}
        <div className="header-cta">
          <LanguageToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;
