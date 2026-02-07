import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#listings" onClick={closeMenu}>Buy Plots</a></li>
            <li><a href="#about" onClick={closeMenu}>About Us</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
          </ul>
        </nav>

        {/* WhatsApp Button */}
        <div className="header-cta">
          <a href="https://wa.me/916370997812" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>
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
