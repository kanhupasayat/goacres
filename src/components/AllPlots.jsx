import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin, FiMaximize2, FiHome, FiChevronLeft, FiChevronRight, FiX, FiNavigation, FiAlertTriangle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import SEO from './SEO';
import ComingSoon from './ComingSoon';
import { awaitPlots, getCachedPlots, prefetchPlots } from '../utils/plotsCache';
import { trackEvent } from '../utils/analytics';
import './AllPlots.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const WHATSAPP_NUMBER = '919187428518';
const PLOTS_PER_PAGE = 12;

const PRICE_RANGES = [
  { id: 'any', min: null, max: null },
  { id: 'under2L', min: null, max: 200000 },
  { id: '2to3L', min: 200000, max: 300000 },
  { id: '3to5L', min: 300000, max: 500000 },
  { id: 'above5L', min: 500000, max: null },
];

const AllPlots = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [comingSoon, setComingSoon] = useState(null);

  useEffect(() => {
    if (API_URL) {
      fetch(`${API_URL}/api/settings`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setComingSoon(data); })
        .catch(() => setComingSoon(null));
    }
  }, []);

  // Read state from URL
  const currentType = searchParams.get('type') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentPrice = searchParams.get('price') || 'any';

  const [plots, setPlots] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [masterPlots, setMasterPlots] = useState([]);

  // Update URL params
  const updateParams = useCallback((updates) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change (unless page itself is being updated)
      if (!('page' in updates)) {
        params.delete('page');
      }
      return params;
    });
  }, [setSearchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // On mount, get data from prefetch cache or trigger API call
  useEffect(() => {
    const cached = getCachedPlots();
    if (cached && cached.length > 0) {
      setMasterPlots(cached);
      setLoading(false);
    } else {
      setLoading(true);
      prefetchPlots();
      awaitPlots().then(apiPlots => {
        if (apiPlots && apiPlots.length > 0) setMasterPlots(apiPlots);
        setLoading(false);
      });
    }
  }, []);

  // Filter, sort, paginate from masterPlots (client-side)
  useEffect(() => {
    let filtered = [...masterPlots];

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      );
    }

    if (currentType) {
      filtered = filtered.filter(p => p.type === currentType);
    }

    const priceRange = PRICE_RANGES.find(r => r.id === currentPrice);
    if (priceRange && priceRange.min !== null) {
      filtered = filtered.filter(p => p.pricePerDecimal.max >= priceRange.min);
    }
    if (priceRange && priceRange.max !== null) {
      filtered = filtered.filter(p => p.pricePerDecimal.min <= priceRange.max);
    }

    if (currentSort === 'price_low') {
      filtered.sort((a, b) => a.pricePerDecimal.min - b.pricePerDecimal.min);
    } else if (currentSort === 'price_high') {
      filtered.sort((a, b) => b.pricePerDecimal.max - a.pricePerDecimal.max);
    }

    setTotal(filtered.length);
    setTotalPages(Math.ceil(filtered.length / PLOTS_PER_PAGE) || 1);
    const start = (currentPage - 1) * PLOTS_PER_PAGE;
    setPlots(filtered.slice(start, start + PLOTS_PER_PAGE));
  }, [masterPlots, currentType, currentSearch, currentSort, currentPage, currentPrice]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput || null });
  };

  const clearSearch = () => {
    setSearchInput('');
    updateParams({ search: null });
  };

  const types = [
    { id: '', label: t('allPlots.filterAll') },
    { id: 'Residential', label: t('allPlots.filterResidential') },
    { id: 'Commercial', label: t('allPlots.filterCommercial') },
    { id: 'Farm House', label: t('allPlots.filterFarmHouse') },
  ];

  const priceOptions = [
    { id: 'any', label: t('allPlots.anyPrice') },
    { id: 'under2L', label: t('allPlots.under2L') },
    { id: '2to3L', label: t('allPlots.twoTo3L') },
    { id: '3to5L', label: t('allPlots.threeToFiveL') },
    { id: 'above5L', label: t('allPlots.aboveFiveL') },
  ];

  const sortOptions = [
    { id: 'newest', label: t('allPlots.sortNewest') },
    { id: 'price_low', label: t('allPlots.sortPriceLow') },
    { id: 'price_high', label: t('allPlots.sortPriceHigh') },
  ];

  const formatLakh = (amount) => {
    const lakh = amount / 100000;
    return lakh % 1 === 0 ? `₹${lakh}L` : `₹${lakh.toFixed(1)}L`;
  };

  const getWhatsAppUrl = (property) => {
    const phone = property.advisorPhone || WHATSAPP_NUMBER;
    const message = `Hi! I need details about "${property.title}" — ${property.location}. Please share price and full details.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const startItem = (currentPage - 1) * PLOTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PLOTS_PER_PAGE, total);

  if (comingSoon?.comingSoon) {
    return (
      <div className="all-plots-page">
        <SEO title="Coming Soon — GOACRES" description="200+ plots launching soon on GOACRES!" path="/plots" />
        <ComingSoon launchDate={comingSoon.launchDate} message={comingSoon.launchMessage} />
      </div>
    );
  }

  return (
    <div className="all-plots-page">
      <SEO
        title={currentType ? `${currentType} Plots in Rourkela` : 'All Plots & Land in Rourkela'}
        description={currentType
          ? `Browse ${currentType} plots for sale in Rourkela, Odisha. Best prices, verified listings. Connect with Real Estate Advisor on GOACRES.`
          : 'Browse all plots for sale in Rourkela - residential, commercial & farm house. Best prices, verified listings on GOACRES.'}
        path={`/plots${currentType ? `?type=${encodeURIComponent(currentType)}` : ''}`}
      />
      <div className="all-plots-bg-pattern"></div>

      <div className="container">
        {/* Header */}
        <div className="ap-header">
          <Link to="/" className="ap-back-link">← Home</Link>
          <h1 className="ap-title">{t('allPlots.pageTitle')}</h1>
          <p className="ap-subtitle">{t('allPlots.pageSubtitle')}</p>
        </div>

        {/* Search + Filters Bar */}
        <div className="ap-filters-bar">
          <form className="ap-search-form" onSubmit={handleSearch}>
            <FiSearch className="ap-search-icon" />
            <input
              type="text"
              className="ap-search-input"
              placeholder={t('allPlots.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="ap-search-clear" onClick={clearSearch}>
                <FiX />
              </button>
            )}
          </form>

          {/* Type Filter Chips */}
          <div className="ap-filter-chips">
            {types.map(type => (
              <button
                key={type.id}
                className={`ap-chip ${currentType === type.id ? 'active' : ''}`}
                onClick={() => updateParams({ type: type.id || null })}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Price + Sort Row */}
          <div className="ap-selects-row">
            <select
              className="ap-select"
              value={currentPrice}
              onChange={(e) => updateParams({ price: e.target.value === 'any' ? null : e.target.value })}
            >
              {priceOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            <select
              className="ap-select"
              value={currentSort}
              onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? null : e.target.value })}
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && total > 0 && (
          <div className="ap-results-count">
            {t('allPlots.showing')} {startItem}-{endItem} {t('allPlots.of')} {total} {t('allPlots.plots')}
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && (
          <div className="ap-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="ap-skeleton-card" key={i}>
                <div className="ap-skeleton-image ap-shimmer" />
                <div className="ap-skeleton-content">
                  <div className="ap-skeleton-tag ap-shimmer" />
                  <div className="ap-skeleton-title ap-shimmer" />
                  <div className="ap-skeleton-location ap-shimmer" />
                  <div className="ap-skeleton-stats ap-shimmer" />
                  <div className="ap-skeleton-price ap-shimmer" />
                  <div className="ap-skeleton-btn ap-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && plots.length === 0 && (
          <div className="ap-no-results">
            <h3>{t('allPlots.noResults')}</h3>
            <p>{t('allPlots.noResultsSub')}</p>
            <button className="ap-reset-btn" onClick={resetFilters}>
              {t('allPlots.resetFilters')}
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && plots.length > 0 && (
          <div className="ap-grid">
            {plots.map((property) => (
              <div className="ap-card" key={property.id || property.slug}>
                <Link to={`/plot/${property.slug}`} className="ap-card-link">
                  <div className="ap-card-image">
                    <img src={property.photos[0]} alt={property.title} loading="lazy" />
                    <span className="ap-card-type">{property.type}</span>
                    {property.status === 'Sold' && (
                      <span className="ap-card-status ap-status-sold">SOLD</span>
                    )}
                    {property.status && property.status !== 'Sold' && (
                      <span className={`ap-card-status ${property.status === 'Ready for Construction' ? 'ap-status-ready' : 'ap-status-dev'}`}>
                        {property.status}
                      </span>
                    )}
                  </div>

                  <div className="ap-card-content">
                    <div className="ap-card-highlight">
                      <FiHome />
                      <span>{property.highlight}</span>
                    </div>

                    <h3 className="ap-card-title">{property.title}</h3>

                    <div className="ap-card-location">
                      <FiMapPin />
                      <span>{property.location}</span>
                    </div>

                    <div className="ap-card-stats">
                      <span><FiMaximize2 /> {property.sizeRange} Sq.Ft</span>
                      <span>{property.decimal} Decimal</span>
                      {property.distanceMainRoad && (
                        <span><FiNavigation /> {property.distanceMainRoad}</span>
                      )}
                    </div>

                    <div className="ap-card-price">
                      <span className="ap-price-amount">
                        {formatLakh(property.pricePerDecimal.min)} - {formatLakh(property.pricePerDecimal.max)}
                      </span>
                      <span className="ap-price-unit">{t('allPlots.perDecimal')}</span>
                    </div>

                    {property.advisorName && (
                      <div className="ap-card-advisor">
                        {property.advisorPhoto ? (
                          <img className="ap-advisor-img" src={property.advisorPhoto} alt={property.advisorName} />
                        ) : (
                          <div className="ap-advisor-dot"></div>
                        )}
                        <span>{property.advisorName}</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="ap-card-footer">
                  <Link
                    to={`/plot/${property.slug}`}
                    className="ap-details-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{t('allPlots.viewDetails')}</span>
                  </Link>
                  <a
                    href={getWhatsAppUrl(property)}
                    className="ap-whatsapp-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { e.stopPropagation(); trackEvent('whatsapp_click', { plotTitle: property.title, plotSlug: property.slug, page: 'AllPlots' }); }}
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safety Disclaimer */}
        {!loading && plots.length > 0 && (
          <div className="ap-disclaimer-box">
            <FiAlertTriangle className="ap-disclaimer-icon" />
            <div className="ap-disclaimer-text">
              <strong>{t('allPlots.disclaimerTitle')}</strong>
              <p>{t('allPlots.disclaimerText')}</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="ap-pagination">
            <button
              className="ap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => updateParams({ page: currentPage - 1 })}
            >
              <FiChevronLeft />
              {t('allPlots.prev')}
            </button>

            <div className="ap-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`dot-${idx}`} className="ap-page-dots">...</span>
                  ) : (
                    <button
                      key={item}
                      className={`ap-page-num ${currentPage === item ? 'active' : ''}`}
                      onClick={() => updateParams({ page: item })}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              className="ap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => updateParams({ page: currentPage + 1 })}
            >
              {t('allPlots.next')}
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlots;
