import { useState } from 'react';
import { FiMapPin, FiHeart, FiShoppingBag, FiTruck, FiStar, FiChevronRight, FiX, FiArrowLeft, FiCheck, FiTrendingUp, FiShare2, FiNavigation } from 'react-icons/fi';
import { FaHospital, FaSchool, FaTree, FaRoad, FaWhatsapp } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './AreaGuide.css';

const AreaGuide = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  const areas = [
    {
      id: 1,
      name: 'Chhend Colony',
      tagline: 'The Family Paradise',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Best residential hub with top schools and parks for families.',
      fullDesc: 'Chhend Colony stands as Rourkela\'s most sought-after residential destination, offering the perfect blend of urban convenience and peaceful living. Known for its tree-lined streets and well-maintained infrastructure, this locality is ideal for families seeking quality education and green spaces.',
      rating: 4.8,
      priceRange: '₹2,000 - ₹2,500 /sq.ft',
      investmentGrade: 'A+',
      appreciation: '12-15%',
      amenities: [
        { icon: <FaSchool />, name: 'Schools', count: '8+ Schools', detail: 'DAV, DPS, St. Paul\'s nearby' },
        { icon: <FaHospital />, name: 'Hospitals', count: '3 Hospitals', detail: 'IGH, Apollo within 2km' },
        { icon: <FaTree />, name: 'Parks', count: '5+ Parks', detail: 'Chhend Park, Children\'s Garden' },
        { icon: <FiShoppingBag />, name: 'Markets', count: '2 Markets', detail: 'Main Market, Daily Bazaar' }
      ],
      highlights: ['Family-friendly environment', 'Well-connected roads', 'Low crime rate', '24/7 water supply'],
      connectivity: ['5 min to Main Road', '10 min to Railway Station', '15 min to Airport']
    },
    {
      id: 2,
      name: 'Civil Township',
      tagline: 'Premium Living Zone',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Premium locality with Steel Plant proximity and modern amenities.',
      fullDesc: 'Civil Township represents the pinnacle of residential living in Rourkela. Developed primarily for Steel Plant employees, this area boasts excellent infrastructure, wide roads, and a strong community feel. Property values here have shown consistent appreciation over the years.',
      rating: 4.9,
      priceRange: '₹4,000 - ₹5,000 /sq.ft',
      investmentGrade: 'A++',
      appreciation: '15-18%',
      amenities: [
        { icon: <FaSchool />, name: 'Schools', count: '10+ Schools', detail: 'RSP Schools, Kendriya Vidyalaya' },
        { icon: <FaHospital />, name: 'Hospitals', count: '4 Hospitals', detail: 'ISP Hospital, SAIL Hospital' },
        { icon: <FaTree />, name: 'Parks', count: '8+ Parks', detail: 'Ispat Stadium, Sector Parks' },
        { icon: <FaRoad />, name: 'Connectivity', count: 'Excellent', detail: 'Direct NH connection' }
      ],
      highlights: ['Premium infrastructure', 'Steel Plant proximity', 'High appreciation rate', 'Elite neighborhood'],
      connectivity: ['2 min to Steel Plant', '8 min to City Center', '20 min to Airport']
    },
    {
      id: 3,
      name: 'Koel Nagar',
      tagline: 'Commercial Hub',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Emerging commercial zone with excellent business potential.',
      fullDesc: 'Koel Nagar is rapidly transforming into Rourkela\'s commercial powerhouse. With new shopping complexes, office spaces, and residential apartments, this area offers excellent investment opportunities. Its strategic location makes it perfect for businesses and working professionals.',
      rating: 4.5,
      priceRange: '₹2,500 - ₹3,200 /sq.ft',
      investmentGrade: 'A',
      appreciation: '10-14%',
      amenities: [
        { icon: <FiShoppingBag />, name: 'Shopping', count: '5+ Malls', detail: 'City Centre, Pantaloons' },
        { icon: <FaHospital />, name: 'Hospitals', count: '2 Hospitals', detail: 'Private clinics, nursing homes' },
        { icon: <FiTruck />, name: 'Transport', count: 'Bus Stand', detail: 'Auto, Bus connectivity' },
        { icon: <FaSchool />, name: 'Colleges', count: '3 Colleges', detail: 'NIT Rourkela nearby' }
      ],
      highlights: ['Business opportunities', 'Growing infrastructure', 'Investment hotspot', 'Youth-friendly area'],
      connectivity: ['3 min to Bus Stand', '10 min to NIT', '12 min to Railway Station']
    },
    {
      id: 4,
      name: 'Vedvyas',
      tagline: 'Spiritual & Peaceful',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Religious significance with nature and peaceful surroundings.',
      fullDesc: 'Vedvyas offers a unique blend of spiritual significance and natural beauty. Home to the famous Vedvyas Temple, this area attracts both devotees and nature lovers. With the Brahmani and Koel rivers meeting here, it\'s perfect for those seeking a peaceful lifestyle away from city hustle.',
      rating: 4.3,
      priceRange: '₹700 - ₹1,000 /sq.ft',
      investmentGrade: 'B+',
      appreciation: '8-12%',
      amenities: [
        { icon: <FaTree />, name: 'Nature', count: 'River Front', detail: 'Brahmani-Koel Sangam' },
        { icon: <FiHeart />, name: 'Temples', count: '5+ Temples', detail: 'Vedvyas Mandir, Hanuman Temple' },
        { icon: <FaSchool />, name: 'Schools', count: '3 Schools', detail: 'Local schools available' },
        { icon: <FaRoad />, name: 'Connectivity', count: 'Good', detail: 'NH-143 accessible' }
      ],
      highlights: ['Spiritual environment', 'Natural beauty', 'Budget-friendly plots', 'Future development planned'],
      connectivity: ['On NH-143', '15 min to City Center', '25 min to Railway Station']
    },
    {
      id: 5,
      name: 'Lathikata',
      tagline: 'Investment Goldmine',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      shortDesc: 'High growth potential area with lowest entry prices.',
      fullDesc: 'Lathikata is the emerging star of Rourkela\'s real estate market. With planned industrial development and upcoming infrastructure projects, this area offers the lowest entry point with the highest growth potential. Smart investors are already acquiring land here for future gains.',
      rating: 4.0,
      priceRange: '₹450 - ₹650 /sq.ft',
      investmentGrade: 'A',
      appreciation: '18-25%',
      amenities: [
        { icon: <FiTruck />, name: 'Industry', count: 'Upcoming', detail: 'Industrial corridor planned' },
        { icon: <FaRoad />, name: 'Roads', count: 'Developing', detail: 'NH expansion underway' },
        { icon: <FaSchool />, name: 'Schools', count: '2 Schools', detail: 'Govt. schools available' },
        { icon: <FaTree />, name: 'Land', count: 'Agricultural', detail: 'Large plots available' }
      ],
      highlights: ['Lowest prices', 'Highest ROI potential', 'Large plot availability', 'Industrial development'],
      connectivity: ['Near Industrial Area', '20 min to City Center', '30 min to Airport']
    },
    {
      id: 6,
      name: 'Sector 19',
      tagline: 'Planned Living',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Well-planned residential sector with modern infrastructure.',
      fullDesc: 'Sector 19 exemplifies planned urban development in Rourkela. With organized plots, wide roads, and proper drainage systems, this sector offers hassle-free living. The area is well-connected to main city areas while maintaining a calm residential atmosphere.',
      rating: 4.6,
      priceRange: '₹3,000 - ₹3,500 /sq.ft',
      investmentGrade: 'A',
      appreciation: '12-15%',
      amenities: [
        { icon: <FaSchool />, name: 'Schools', count: '6+ Schools', detail: 'CBSE & ICSE schools' },
        { icon: <FaHospital />, name: 'Hospitals', count: '2 Hospitals', detail: 'Multi-specialty nearby' },
        { icon: <FaTree />, name: 'Parks', count: '4 Parks', detail: 'Sector parks, playgrounds' },
        { icon: <FaRoad />, name: 'Roads', count: 'Wide Roads', detail: '40-60 ft main roads' }
      ],
      highlights: ['Planned layout', 'Modern infrastructure', 'Good resale value', 'Family-oriented'],
      connectivity: ['5 min to Main Market', '10 min to Steel Plant', '18 min to Railway Station']
    }
  ];

  const openAreaDetail = (area) => {
    setSelectedArea(area);
    document.body.style.overflow = 'hidden';
  };

  const closeAreaDetail = () => {
    setSelectedArea(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="area-guide section" id="area-guide">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
        >
          <h2>Rourkela Area Guide</h2>
          <p>Explore neighborhoods and find your perfect location for investment</p>
        </div>

        <div ref={gridRef} className="areas-grid">
          {areas.map((area, index) => (
            <div
              className={`area-card animate-fade-up stagger-${index + 1} ${gridVisible ? 'is-visible' : ''}`}
              key={area.id}
              onClick={() => openAreaDetail(area)}
            >
              <div className="area-image">
                <img src={area.image} alt={area.name} loading="lazy" />
                <div className="area-overlay">
                  <span className="explore-text">
                    Explore <FiChevronRight />
                  </span>
                </div>
              </div>
              <div className="area-content">
                <div className="area-header">
                  <h3>{area.name}</h3>
                  <span className="area-rating">
                    <FiStar /> {area.rating}
                  </span>
                </div>
                <p className="area-tagline">{area.tagline}</p>
                <p className="area-short-desc">{area.shortDesc}</p>
                <div className="area-price-tag">
                  <FiMapPin />
                  <span>{area.priceRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Area Detail Full Page */}
      {selectedArea && (
        <div className="area-detail-fullpage">
          {/* Background Effects */}
          <div className="area-detail-bg"></div>
          <div className="area-detail-pattern"></div>

          {/* Fixed Header */}
          <header className="area-detail-header">
            <button className="area-back-btn" onClick={closeAreaDetail}>
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <div className="header-title">
              <FiMapPin />
              <span>Area Guide</span>
            </div>
            <button className="area-share-btn">
              <FiShare2 />
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="area-detail-scroll">
            {/* Hero Section */}
            <div className="area-hero-section">
              <div className="area-hero-image">
                <img src={selectedArea.image} alt={selectedArea.name} loading="lazy" />
                <div className="area-hero-gradient"></div>

                {/* Floating Badges */}
                <div className="area-hero-badges">
                  <span className="badge-rating">
                    <FiStar /> {selectedArea.rating} Rating
                  </span>
                  <span className="badge-grade">
                    Grade {selectedArea.investmentGrade}
                  </span>
                </div>
              </div>

              {/* Hero Content */}
              <div className="area-hero-content">
                <span className="area-location-badge">
                  <FiMapPin /> Rourkela, Odisha
                </span>
                <h1 className="area-detail-name">{selectedArea.name}</h1>
                <p className="area-detail-tagline">{selectedArea.tagline}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="area-detail-main">
              {/* Investment Stats Cards */}
              <div className="area-investment-stats">
                <div className="investment-stat-card">
                  <div className="stat-icon price-icon">
                    <FiMapPin />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Price Range</span>
                    <span className="stat-value">{selectedArea.priceRange}</span>
                  </div>
                </div>
                <div className="investment-stat-card">
                  <div className="stat-icon trend-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Annual Growth</span>
                    <span className="stat-value green">{selectedArea.appreciation}</span>
                  </div>
                </div>
                <div className="investment-stat-card">
                  <div className="stat-icon grade-icon">
                    <FiStar />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Investment Grade</span>
                    <span className="stat-value gold">{selectedArea.investmentGrade}</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="area-section about-section">
                <div className="section-header-icon">
                  <FiMapPin />
                </div>
                <h2>About {selectedArea.name}</h2>
                <p className="about-description">{selectedArea.fullDesc}</p>
              </div>

              {/* Amenities Section */}
              <div className="area-section amenities-section-new">
                <div className="section-header-icon">
                  <FiCheck />
                </div>
                <h2>Nearby Amenities</h2>
                <div className="amenities-premium-grid">
                  {selectedArea.amenities.map((amenity, index) => (
                    <div className="amenity-premium-card" key={index}>
                      <div className="amenity-premium-icon">
                        {amenity.icon}
                      </div>
                      <div className="amenity-premium-content">
                        <span className="amenity-premium-name">{amenity.name}</span>
                        <span className="amenity-premium-count">{amenity.count}</span>
                        <span className="amenity-premium-detail">{amenity.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connectivity Section */}
              <div className="area-section connectivity-section">
                <div className="section-header-icon">
                  <FiNavigation />
                </div>
                <h2>Connectivity</h2>
                <div className="connectivity-list">
                  {selectedArea.connectivity.map((item, index) => (
                    <div className="connectivity-item" key={index}>
                      <div className="connectivity-dot"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights Section */}
              <div className="area-section highlights-section-new">
                <div className="section-header-icon gold">
                  <FiStar />
                </div>
                <h2>Key Highlights</h2>
                <div className="highlights-premium-grid">
                  {selectedArea.highlights.map((highlight, index) => (
                    <div className="highlight-premium-item" key={index}>
                      <FiCheck className="highlight-check" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Invest Section */}
              <div className="area-section why-invest-section">
                <div className="section-header-icon green">
                  <FiTrendingUp />
                </div>
                <h2>Why Invest in {selectedArea.name}?</h2>
                <div className="why-invest-cards">
                  <div className="why-invest-card">
                    <div className="invest-card-icon">
                      <FiTrendingUp />
                    </div>
                    <h4>High ROI</h4>
                    <p>Expected {selectedArea.appreciation} annual appreciation</p>
                  </div>
                  <div className="why-invest-card">
                    <div className="invest-card-icon">
                      <FiCheck />
                    </div>
                    <h4>Verified Plots</h4>
                    <p>100% legal & documented properties</p>
                  </div>
                  <div className="why-invest-card">
                    <div className="invest-card-icon">
                      <FiMapPin />
                    </div>
                    <h4>Prime Location</h4>
                    <p>Excellent connectivity & infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom CTA */}
          <div className="area-detail-cta">
            <div className="cta-info">
              <span className="cta-label">Starting from</span>
              <span className="cta-price">{selectedArea.priceRange.split(' - ')[0]}</span>
            </div>
            <div className="cta-actions">
              <a
                href={`https://wa.me/919876543210?text=Hi! I'm interested in plots in ${selectedArea.name}, Rourkela. Please share available options.`}
                className="cta-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
                <span>View Plots</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AreaGuide;
