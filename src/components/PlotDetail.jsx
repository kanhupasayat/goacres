import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiMapPin, FiMaximize2, FiHome, FiNavigation, FiChevronLeft,
  FiChevronRight, FiPhone, FiCheckCircle, FiXCircle, FiCompass,
  FiGrid, FiTruck, FiDroplet, FiZap, FiMap, FiInfo, FiShare2,
  FiShoppingBag, FiCreditCard, FiSun, FiActivity, FiAlertTriangle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import SEO from './SEO';
import { awaitPlots, getCachedPlots, getCachedPlot, prefetchPlots } from '../utils/plotsCache';
import { trackEvent } from '../utils/analytics';
import './PlotDetail.css';

const DEFAULT_WHATSAPP = '919187428518';

const PlotDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activePhoto, setActivePhoto] = useState(0);
  const [plot, setPlot] = useState(() => getCachedPlot(slug));
  const [allPlots, setAllPlots] = useState(() => getCachedPlots() || []);
  const touchStartX = useRef(0);
  const galleryRef = useRef(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [apiDone, setApiDone] = useState(false);

  // Use prefetch cache or trigger API call
  useEffect(() => {
    const cached = getCachedPlots();
    if (cached && cached.length > 0) {
      setAllPlots(cached);
      const found = cached.find(p => p.slug === slug);
      if (found) setPlot(found);
      setApiDone(true);
    } else {
      prefetchPlots();
      awaitPlots().then(apiPlots => {
        if (apiPlots && apiPlots.length > 0) {
          setAllPlots(apiPlots);
          const found = apiPlots.find(p => p.slug === slug);
          if (found) setPlot(found);
        }
        setApiDone(true);
      });
    }
  }, [slug]);

  if (!plot && !apiDone) {
    return null; // Suspense skeleton will show while loading
  }

  if (!plot) {
    return (
      <div className="pd-not-found">
        <h2>Plot Not Found</h2>
        <Link to="/plots">← Back to Plots</Link>
      </div>
    );
  }

  useEffect(() => {
    if (plot) trackEvent('plot_view', { plotTitle: plot.title, plotSlug: plot.slug });
  }, [plot?.slug]);

  const advisorPhone = plot.advisorPhone || DEFAULT_WHATSAPP;
  const advisorName = plot.advisorName || 'GOACRES';
  const advisorPhoto = plot.advisorPhoto || null;
  const whatsappMessage = t('plotDetail.whatsappMessage')
    .replace('{title}', plot.title)
    .replace('{location}', plot.location);
  const whatsappUrl = `https://wa.me/${advisorPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const nextPhoto = () => {
    setActivePhoto(prev => (prev + 1) % plot.photos.length);
  };

  const prevPhoto = () => {
    setActivePhoto(prev => (prev - 1 + plot.photos.length) % plot.photos.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextPhoto();
    if (diff < -50) prevPhoto();
  };

  const handleShare = async () => {
    const shareData = {
      title: plot.title,
      text: `${plot.title} - ${plot.location}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Smart recommended plots — score by area, price, type
  const plotId = plot.id || plot.slug;
  const currentArea = plot.location.split(',')[0].trim().toLowerCase();
  const currentAvgPrice = (plot.pricePerDecimal.min + plot.pricePerDecimal.max) / 2;

  const scored = allPlots
    .filter(p => (p.id || p.slug) !== plotId)
    .map(p => {
      let score = 0;
      const tags = [];

      // Same area (highest weight)
      const pArea = p.location.split(',')[0].trim().toLowerCase();
      if (pArea === currentArea) {
        score += 30;
        tags.push('sameArea');
      }

      // Similar price range (within 50% of avg price)
      const pAvg = (p.pricePerDecimal.min + p.pricePerDecimal.max) / 2;
      const priceDiff = Math.abs(pAvg - currentAvgPrice) / currentAvgPrice;
      if (priceDiff <= 0.5) {
        score += 20 - Math.round(priceDiff * 20);
        tags.push('similarPrice');
      }

      // Same type
      if (p.type === plot.type) {
        score += 10;
        tags.push('sameType');
      }

      return { ...p, _score: score, _tags: tags };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);

  const recommended = scored;

  const formatLakh = (amount) => {
    const lakh = amount / 100000;
    return lakh % 1 === 0 ? `₹${lakh}L` : `₹${lakh.toFixed(1)}L`;
  };

  const nearbyIcons = {
    hospital: <FiActivity />,
    school: <FiHome />,
    market: <FiShoppingBag />,
    bank: <FiCreditCard />,
    temple: <FiSun />,
    railway: <FiTruck />,
    bus: <FiTruck />,
    petrol: <FiDroplet />,
    highway: <FiMap />,
    river: <FiNavigation />,
    park: <FiSun />,
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Already an embed URL
    if (url.includes('/embed/')) return url;
    // YouTube shorts: youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    // YouTube watch: youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    // youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  };

  const getWaterText = () => {
    if (plot.water === true) return t('plotDetail.available');
    if (plot.water === 'Borewell') return t('plotDetail.borewell');
    return t('plotDetail.no');
  };

  const detailItems = [
    { icon: <FiMaximize2 />, label: t('plotDetail.size'), value: `${plot.sqft.toLocaleString()} Sq.Ft` },
    { icon: <FiGrid />, label: t('plotDetail.decimal'), value: `${plot.decimal} Decimal` },
    { icon: <FiMap />, label: t('plotDetail.dimensions'), value: plot.dimensions },
    { icon: <FiTruck />, label: t('plotDetail.roadWidth'), value: `${plot.roadWidth} ${plot.roadType}` },
    { icon: <FiCompass />, label: t('plotDetail.facing'), value: `${plot.facing} Facing` },
    { icon: <FiNavigation />, label: t('plotDetail.cornerPlot'), value: plot.cornerPlot ? t('plotDetail.yes') : t('plotDetail.no') },
    { icon: <FiHome />, label: t('plotDetail.boundaryWall'), value: plot.boundaryWall ? t('plotDetail.yes') : t('plotDetail.no') },
    { icon: <FiDroplet />, label: t('plotDetail.waterSupply'), value: getWaterText() },
    { icon: <FiZap />, label: t('plotDetail.electricity'), value: plot.electricity ? t('plotDetail.available') : t('plotDetail.no') },
    { icon: <FiInfo />, label: t('plotDetail.status'), value: plot.status },
  ];

  return (
    <div className="plot-detail-page">
      <SEO
        title={`${plot.title} - ${plot.location} | ${plot.type} Plot`}
        description={`${plot.title} in ${plot.location}. ${plot.sqft.toLocaleString()} Sq.Ft, ${plot.decimal} Decimal, ${plot.facing} facing. Price: ${formatLakh(plot.pricePerDecimal.min)}-${formatLakh(plot.pricePerDecimal.max)}/Decimal. ${plot.highlight}. Contact GOACRES for details.`}
        path={`/plot/${plot.slug}`}
        image={plot.photos[0]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": plot.title,
          "description": `${plot.title} - ${plot.type} plot in ${plot.location}. ${plot.sqft.toLocaleString()} Sq.Ft, ${plot.facing} facing.`,
          "url": `https://goacres.in/plot/${plot.slug}`,
          "image": plot.photos,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": plot.location.split(',')[0].trim(),
            "addressRegion": "Odisha",
            "addressCountry": "IN"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": plot.pricePerDecimal.min,
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": plot.pricePerDecimal.min,
              "priceCurrency": "INR",
              "unitText": "per Decimal"
            }
          }
        }}
      />
      <div className="container">
        {/* Back button */}
        <div className="pd-back-bar">
          <button className="pd-back-btn" onClick={() => navigate(-1)}>
            {t('plotDetail.backButton')}
          </button>
          <button className="pd-share-btn" onClick={handleShare}>
            <FiShare2 />
            <span>{t('plotDetail.shareText')}</span>
          </button>
        </div>

        {/* Hero: Gallery + Info */}
        <div className="pd-hero">
          {/* Photo Gallery */}
          <div className="pd-gallery">
            <div
              className="pd-main-image"
              ref={galleryRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={plot.photos[activePhoto]}
                alt={`${plot.title} - Photo ${activePhoto + 1}`}
                loading="eager"
              />
              <button className="pd-arrow pd-arrow-left" onClick={prevPhoto}>
                <FiChevronLeft />
              </button>
              <button className="pd-arrow pd-arrow-right" onClick={nextPhoto}>
                <FiChevronRight />
              </button>
              <span className="pd-photo-counter">
                {activePhoto + 1} / {plot.photos.length}
              </span>
            </div>

            {/* Thumbnails — desktop */}
            <div className="pd-thumbnails">
              {plot.photos.map((photo, index) => (
                <button
                  key={index}
                  className={`pd-thumb ${index === activePhoto ? 'pd-thumb-active' : ''}`}
                  onClick={() => setActivePhoto(index)}
                >
                  <img src={photo} alt={`Thumbnail ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>

            {/* Dots — mobile */}
            <div className="pd-dots">
              {plot.photos.map((_, index) => (
                <button
                  key={index}
                  className={`pd-dot ${index === activePhoto ? 'pd-dot-active' : ''}`}
                  onClick={() => setActivePhoto(index)}
                />
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="pd-info">
            <div className="pd-info-top">
              <span className="pd-type-badge">{plot.type}</span>
              {plot.cornerPlot && <span className="pd-corner-badge">Corner Plot</span>}
              {plot.status === 'Sold' && <span className="pd-sold-badge">SOLD</span>}
            </div>

            <h1 className="pd-title">{plot.title}</h1>

            <div className="pd-location">
              <FiMapPin />
              <span>{plot.location}</span>
            </div>

            <div className="pd-highlight-tag">
              <FiCheckCircle />
              <span>{plot.highlight}</span>
            </div>

            {/* Price per decimal */}
            <div className="pd-price-block">
              <span className="pd-price-range">{formatLakh(plot.pricePerDecimal.min)} - {formatLakh(plot.pricePerDecimal.max)}</span>
              <span className="pd-price-unit">/ Decimal</span>
            </div>

            {/* Quick stats */}
            <div className="pd-quick-stats">
              <div className="pd-qstat">
                <span className="pd-qstat-value">{plot.sqft.toLocaleString()}</span>
                <span className="pd-qstat-label">Sq.Ft</span>
              </div>
              <div className="pd-qstat">
                <span className="pd-qstat-value">{plot.decimal}</span>
                <span className="pd-qstat-label">Decimal</span>
              </div>
              <div className="pd-qstat">
                <span className="pd-qstat-value">{plot.facing}</span>
                <span className="pd-qstat-label">Facing</span>
              </div>
              <div className="pd-qstat">
                <span className="pd-qstat-value">{plot.roadWidth}</span>
                <span className="pd-qstat-label">Road</span>
              </div>
            </div>

            {/* Advisor Info */}
            <div className="pd-advisor-info">
              {advisorPhoto ? (
                <img className="pd-advisor-avatar pd-advisor-photo" src={advisorPhoto} alt={advisorName} />
              ) : (
                <div className="pd-advisor-avatar">{advisorName.charAt(0)}</div>
              )}
              <div className="pd-advisor-text">
                <span className="pd-advisor-name">{advisorName}</span>
                <span className="pd-advisor-label">Real Estate Advisor</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="pd-cta-buttons">
              <a
                href={whatsappUrl}
                className="pd-cta-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { plotTitle: plot.title, plotSlug: plot.slug, page: 'PlotDetail' })}
              >
                <FaWhatsapp />
                <span>{t('plotDetail.askPrice')}</span>
              </a>
              <a
                href={`tel:+${advisorPhone}`}
                className="pd-cta-call"
                onClick={() => trackEvent('call_click', { plotTitle: plot.title, plotSlug: plot.slug, page: 'PlotDetail' })}
              >
                <FiPhone />
                <span>{t('plotDetail.callNow')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Full Details Grid */}
        <div className="pd-details-section">
          <h2 className="pd-section-title">{t('plotDetail.plotDetails')}</h2>
          <div className="pd-details-grid">
            {detailItems.map((item, index) => (
              <div className="pd-detail-item" key={index}>
                <span className="pd-detail-icon">{item.icon}</span>
                <div className="pd-detail-text">
                  <span className="pd-detail-label">{item.label}</span>
                  <span className="pd-detail-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        {plot.nearby && plot.nearby.length > 0 && (
          <div className="pd-nearby-section">
            <h2 className="pd-section-title">{t('plotDetail.nearbyPlaces')}</h2>
            <div className="pd-nearby-grid">
              {plot.nearby.map((place, index) => (
                <div className="pd-nearby-item" key={index}>
                  <span className="pd-nearby-icon">
                    {nearbyIcons[place.type] || <FiMapPin />}
                  </span>
                  <div className="pd-nearby-text">
                    <span className="pd-nearby-name">{place.name}</span>
                    <span className="pd-nearby-distance">{place.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Section */}
        {plot.video && (
          <div className="pd-video-section">
            <h2 className="pd-section-title">{t('plotDetail.watchVideo')}</h2>
            <div className={`pd-video-wrap ${plot.videoType === 'shorts' || (plot.video && plot.video.includes('/shorts/')) ? '' : 'pd-video-landscape'}`}>
              <iframe
                src={getEmbedUrl(plot.video)}
                title={`${plot.title} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Safety Disclaimer */}
        <div className="pd-disclaimer-box">
          <FiAlertTriangle className="pd-disclaimer-icon" />
          <div className="pd-disclaimer-text">
            <strong>{t('allPlots.disclaimerTitle')}</strong>
            <p>{t('allPlots.disclaimerText')}</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pd-bottom-cta">
          <a
            href={whatsappUrl}
            className="pd-cta-whatsapp pd-cta-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>{t('plotDetail.askPrice')}</span>
          </a>
        </div>

        {/* Recommended Plots */}
        {recommended.length > 0 && (
          <div className="pd-recommended">
            <h2 className="pd-section-title">{t('plotDetail.recommended')}</h2>
            <p className="pd-rec-subtitle">{t('plotDetail.recommendedSubtitle')}</p>
            <div className="pd-rec-grid">
              {recommended.map(rec => (
                <Link
                  to={`/plot/${rec.slug}`}
                  className="pd-rec-card"
                  key={rec.id || rec.slug}
                >
                  <div className="pd-rec-image">
                    <img src={rec.photos[0]} alt={rec.title} loading="lazy" />
                    <span className="pd-rec-type">{rec.type}</span>
                  </div>
                  <div className="pd-rec-content">
                    {rec._tags && rec._tags.length > 0 && (
                      <div className="pd-rec-tags">
                        {rec._tags.map(tag => (
                          <span key={tag} className={`pd-rec-tag pd-rec-tag-${tag}`}>
                            {tag === 'sameArea' && t('plotDetail.tagSameArea')}
                            {tag === 'similarPrice' && t('plotDetail.tagSimilarPrice')}
                            {tag === 'sameType' && t('plotDetail.tagSameType')}
                          </span>
                        ))}
                      </div>
                    )}
                    <h4>{rec.title}</h4>
                    <div className="pd-rec-location">
                      <FiMapPin />
                      <span>{rec.location}</span>
                    </div>
                    <div className="pd-rec-price">
                      {formatLakh(rec.pricePerDecimal.min)} - {formatLakh(rec.pricePerDecimal.max)} <span>/ Decimal</span>
                    </div>
                    <div className="pd-rec-stats">
                      <span>{rec.sqft.toLocaleString()} Sq.Ft</span>
                      <span>{rec.decimal} Decimal</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotDetail;
