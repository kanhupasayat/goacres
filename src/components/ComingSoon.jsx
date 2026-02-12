import { useState, useEffect } from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import './ComingSoon.css';

const WHATSAPP_NUMBER = '919187428518';

const ComingSoon = ({ launchDate, message }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(launchDate + 'T00:00:00+05:30').getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know about upcoming plots on GOACRES.')}`;

  return (
    <section className="cs-section">
      <div className="cs-bg" />
      <div className="container cs-content">
        <div className="cs-badge">LAUNCHING 22 MARCH 2026</div>
        <h2 className="cs-title">{message || '200+ Premium Plots Are Coming to Rourkela!'}</h2>
        <p className="cs-subtitle">Residential, Commercial & Farm House — Rourkela ke best plots ek jagah. Verified listings, trusted Real Estate Advisors.</p>

        <div className="cs-timer">
          <div className="cs-timer-box">
            <span className="cs-timer-value">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="cs-timer-label">Days</span>
          </div>
          <span className="cs-timer-sep">:</span>
          <div className="cs-timer-box">
            <span className="cs-timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="cs-timer-label">Hours</span>
          </div>
          <span className="cs-timer-sep">:</span>
          <div className="cs-timer-box">
            <span className="cs-timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="cs-timer-label">Minutes</span>
          </div>
          <span className="cs-timer-sep">:</span>
          <div className="cs-timer-box">
            <span className="cs-timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="cs-timer-label">Seconds</span>
          </div>
        </div>

        <p className="cs-notify">Sabse pehle jaanne ke liye follow karo!</p>

        <div className="cs-buttons">
          <a href={whatsappUrl} className="cs-btn cs-btn-whatsapp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp /> WhatsApp Us
          </a>
          <a href="https://www.instagram.com/goacres.in/" className="cs-btn cs-btn-instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram /> Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
