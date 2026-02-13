import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from '../hooks/useTranslation';
import './FounderSection.css';

const springConfig = { damping: 30, stiffness: 100, mass: 2 };

const FounderSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { t, tArray } = useTranslation();
  const cardRef = useRef(null);

  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scale = useSpring(1, springConfig);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, springConfig);

  const stats = tArray('founder.stats');

  function handleMouse(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -10);
    rotateY.set((offsetX / (rect.width / 2)) * 10);
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleEnter() {
    scale.set(1.03);
    glareOpacity.set(1);
  }

  function handleLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }

  return (
    <section className="founder-section" ref={sectionRef}>
      <div className="founder-bg" />
      <div className="container">
        <div
          className="founder-tilt-wrapper"
          ref={cardRef}
          onMouseMove={handleMouse}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <motion.div
            className={`founder-card ${isVisible ? 'is-visible' : ''}`}
            style={{ rotateX, rotateY, scale }}
          >
            {/* Glare overlay */}
            <motion.div
              className="founder-glare"
              style={{
                opacity: glareOpacity,
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
              }}
            />

            {/* Avatar Initial */}
            <div className="founder-avatar">
              <span>{t('founder.name').charAt(0)}</span>
            </div>

            <span className="founder-label">{t('founder.label')}</span>
            <h3 className="founder-name">{t('founder.name')}</h3>
            <span className="founder-title">{t('founder.title')}</span>

            <div className="founder-divider"></div>

            <blockquote className="founder-quote">
              "{t('founder.quote')}"
            </blockquote>

            {/* Stats */}
            <div className="founder-stats">
              {stats.map((stat, index) => (
                <div className="founder-stat" key={index}>
                  <span className="founder-stat-value">{stat.value}</span>
                  <span className="founder-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
