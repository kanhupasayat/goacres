import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiMaximize2, FiArrowLeft, FiCheck, FiPhone, FiShare2, FiChevronLeft, FiChevronRight, FiHome, FiGrid, FiStar, FiAward, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState(null);
  const autoSlideRef = useRef(null);

  // Property data (same as Listings)
  const properties = [
    {
      id: 1,
      title: 'Premium Corner Plot',
      location: 'Civil Township, Rourkela',
      price: '45 Lac',
      size: '2,400',
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: true,
      isFeatured: true,
      isPremium: true,
      description: 'Prime corner plot in the heart of Civil Township. Perfect for building your dream home with excellent surroundings and peaceful environment.',
      features: ['Corner Plot', 'Park Facing', '40ft Wide Road', 'All Utilities Available', 'Developed Area'],
      pricePerSqFt: '1,875',
      type: 'Residential',
      status: 'Available',
      rating: 4.9
    },
    {
      id: 2,
      title: 'Commercial Plot',
      location: 'Sector 19, Rourkela',
      price: '85 Lac',
      size: '3,200',
      images: [
        'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: true,
      isFeatured: false,
      isPremium: false,
      description: 'Excellent commercial plot on main road. Ideal for showroom, office building, or retail space.',
      features: ['Main Road', 'Commercial Zone', 'High Foot Traffic', 'Easy Access', 'Near Market'],
      pricePerSqFt: '2,656',
      type: 'Commercial',
      status: 'Available',
      rating: 4.7
    },
    {
      id: 3,
      title: 'Residential Plot',
      location: 'Koel Nagar, Rourkela',
      price: '28 Lac',
      size: '1,600',
      images: [
        'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: false,
      isFeatured: true,
      isPremium: false,
      description: 'Beautiful residential plot in prime Koel Nagar location. Walking distance to markets, schools, and hospitals.',
      features: ['Prime Location', 'Near Market', 'Schools Nearby', 'Hospital Access', 'Peaceful Area'],
      pricePerSqFt: '1,750',
      type: 'Residential',
      status: 'Available',
      rating: 4.8
    },
    {
      id: 4,
      title: 'Farm House Land',
      location: 'Vedvyas, Rourkela',
      price: '18 Lac',
      size: '5,000',
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: true,
      isFeatured: false,
      isPremium: true,
      description: 'Spacious farm house land with scenic views. Perfect for weekend retreat or agriculture investment.',
      features: ['Scenic Views', 'Water Available', 'Boundary Wall', 'Green Belt', 'Investment Opportunity'],
      pricePerSqFt: '360',
      type: 'Farm House',
      status: 'Available',
      rating: 4.6
    },
    {
      id: 5,
      title: 'Budget Residential Plot',
      location: 'Chhend Colony, Rourkela',
      price: '15 Lac',
      size: '1,200',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: false,
      isFeatured: false,
      isPremium: false,
      description: 'Affordable residential plot in Chhend Colony. Great for first-time buyers looking for budget-friendly options.',
      features: ['Budget Friendly', 'Residential Area', 'Near School', 'Water Supply', 'Electricity Available'],
      pricePerSqFt: '1,250',
      type: 'Residential',
      status: 'Available',
      rating: 4.5
    },
    {
      id: 6,
      title: 'Prime Commercial Space',
      location: 'Main Road, Rourkela',
      price: '1.2 Cr',
      size: '4,500',
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: true,
      isFeatured: true,
      isPremium: true,
      description: 'Prime commercial plot on main road with high visibility. Perfect for showroom, mall, or corporate office.',
      features: ['Main Road Facing', 'High Visibility', 'Commercial Zone', 'Parking Space', 'All Approvals'],
      pricePerSqFt: '2,667',
      type: 'Commercial',
      status: 'Available',
      rating: 4.9
    },
    {
      id: 7,
      title: 'Luxury Villa Plot',
      location: 'Sector 6, Rourkela',
      price: '65 Lac',
      size: '3,000',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: false,
      isFeatured: true,
      isPremium: true,
      description: 'Exclusive villa plot in gated community. Premium locality with all modern amenities and 24/7 security.',
      features: ['Gated Community', '24/7 Security', 'Club House', 'Garden Area', 'Premium Location'],
      pricePerSqFt: '2,167',
      type: 'Residential',
      status: 'Available',
      rating: 4.8
    },
    {
      id: 8,
      title: 'Agricultural Land',
      location: 'Lathikata, Rourkela',
      price: '12 Lac',
      size: '10,000',
      images: [
        'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      isNew: true,
      isFeatured: false,
      isPremium: false,
      description: 'Large agricultural land with irrigation facility. Ideal for farming, organic cultivation, or future development.',
      features: ['Irrigation Available', 'Fertile Soil', 'Road Access', 'Electricity Nearby', 'Clear Title'],
      pricePerSqFt: '120',
      type: 'Farm House',
      status: 'Available',
      rating: 4.4
    }
  ];

  useEffect(() => {
    // Find property by ID
    const foundProperty = properties.find(p => p.id === parseInt(id));
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      navigate('/');
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // Auto slide images
  useEffect(() => {
    if (property) {
      autoSlideRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === property.images.length - 1 ? 0 : prev + 1
        );
      }, 4000);
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [property]);

  const nextImage = () => {
    if (property) {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
      autoSlideRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === property.images.length - 1 ? 0 : prev + 1
        );
      }, 4000);
    }
  };

  const prevImage = () => {
    if (property) {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
      autoSlideRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === property.images.length - 1 ? 0 : prev + 1
        );
      }, 4000);
    }
  };

  const goToImage = (index) => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    setCurrentImageIndex(index);
    autoSlideRef.current = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
  };

  const goBack = () => {
    navigate('/');
  };

  if (!property) {
    return (
      <div className="property-loading">
        <div className="loading-spinner"></div>
        <p>Loading property...</p>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      {/* Background Effects */}
      <div className="detail-bg-gradient"></div>
      <div className="detail-bg-pattern"></div>

      {/* Fixed Header */}
      <header className="property-detail-header">
        <button className="back-btn" onClick={goBack}>
          <FiArrowLeft />
          <span>Back</span>
        </button>
        <div className="header-center">
          <FiAward className="header-icon" />
          <span>Premium Property</span>
        </div>
        <button className="share-btn">
          <FiShare2 />
        </button>
      </header>

      {/* Main Content */}
      <div className="property-detail-content">
        {/* Hero Section with Image */}
        <div className="property-hero-section">
          <div className="property-image-gallery">
            <div className="main-image-container">
              {property.images.map((img, index) => (
                <div
                  key={index}
                  className={`gallery-slide ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`${property.title} - ${index + 1}`} />
                  <div className="image-gradient-overlay"></div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button className="gallery-nav-btn prev" onClick={prevImage}>
                <FiChevronLeft />
              </button>
              <button className="gallery-nav-btn next" onClick={nextImage}>
                <FiChevronRight />
              </button>

              {/* Badges */}
              <div className="property-detail-badges">
                {property.isPremium && (
                  <span className="detail-badge premium">
                    <FiAward /> Premium
                  </span>
                )}
                {property.isNew && (
                  <span className="detail-badge new">New Launch</span>
                )}
                {property.isFeatured && (
                  <span className="detail-badge featured">
                    <FiStar /> Featured
                  </span>
                )}
              </div>

              {/* Rating Badge */}
              <div className="detail-rating-badge">
                <FiStar className="star-filled" />
                <span>{property.rating}</span>
                <span className="rating-text">Rating</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="thumbnail-strip">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                  {index === currentImageIndex && <div className="thumb-active-border"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Info Overlay */}
          <div className="hero-info-overlay">
            <div className="hero-info-content">
              <div className="property-type-badge">
                <FiHome />
                <span>{property.type}</span>
              </div>
              <h1 className="property-detail-title">{property.title}</h1>
              <div className="property-detail-location">
                <FiMapPin />
                <span>{property.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Info Section */}
        <div className="property-info-section">
          <div className="container">
            {/* Price Card */}
            <div className="property-price-card">
              <div className="price-card-inner">
                <div className="price-main">
                  <span className="price-label">Investment Value</span>
                  <div className="price-amount">
                    <span className="currency">₹</span>
                    <span className="value">{property.price}</span>
                  </div>
                  <span className="price-per-unit">
                    ₹{property.pricePerSqFt} per Sq. Ft.
                  </span>
                </div>
                <div className="price-divider"></div>
                <div className="price-stats">
                  <div className="price-stat">
                    <FiTrendingUp className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-value">15%</span>
                      <span className="stat-label">Expected ROI</span>
                    </div>
                  </div>
                  <div className="price-stat">
                    <FiMaximize2 className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-value">{property.size}</span>
                      <span className="stat-label">Sq. Ft. Area</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="property-stats-grid">
              <div className="property-stat-card">
                <div className="stat-card-icon">
                  <FiMapPin />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-label">Location</span>
                  <span className="stat-card-value">{property.location}</span>
                </div>
              </div>
              <div className="property-stat-card">
                <div className="stat-card-icon">
                  <FiMaximize2 />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-label">Plot Size</span>
                  <span className="stat-card-value">{property.size} Sq. Ft.</span>
                </div>
              </div>
              <div className="property-stat-card">
                <div className="stat-card-icon">
                  <FiHome />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-label">Property Type</span>
                  <span className="stat-card-value">{property.type}</span>
                </div>
              </div>
              <div className="property-stat-card">
                <div className="stat-card-icon green">
                  <FiCheck />
                </div>
                <div className="stat-card-content">
                  <span className="stat-card-label">Status</span>
                  <span className="stat-card-value available">{property.status}</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="property-description-card">
              <div className="section-header">
                <div className="section-icon">
                  <FiGrid />
                </div>
                <h2>About This Property</h2>
              </div>
              <p className="description-text">{property.description}</p>
            </div>

            {/* Features Section */}
            <div className="property-features-card">
              <div className="section-header">
                <div className="section-icon">
                  <FiStar />
                </div>
                <h2>Key Features & Amenities</h2>
              </div>
              <div className="property-features-grid">
                {property.features.map((feature, index) => (
                  <div key={index} className="property-feature-item">
                    <div className="feature-check-icon">
                      <FiCheck />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Highlights */}
            <div className="investment-highlights-card">
              <div className="section-header">
                <div className="section-icon gold">
                  <FiAward />
                </div>
                <h2>Why Invest Here?</h2>
              </div>
              <div className="highlights-grid">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FiTrendingUp />
                  </div>
                  <h4>High Appreciation</h4>
                  <p>Properties in this area have shown consistent value growth</p>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FiCheck />
                  </div>
                  <h4>Verified Title</h4>
                  <p>100% legal documentation with clear ownership</p>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FiMapPin />
                  </div>
                  <h4>Prime Location</h4>
                  <p>Excellent connectivity and nearby amenities</p>
                </div>
              </div>
            </div>

            {/* Smart Buyer Tip */}
            <div className="smart-buyer-tip">
              <div className="tip-header">
                <FiAlertCircle className="tip-icon" />
                <h3>Smart Buyer Tip</h3>
              </div>
              <ul className="tip-list">
                <li>Before purchasing land, verify the owner's name on the official Bhulekh portal.</li>
                <li>Request the original RERA Certificate and Encumbrance Certificate (EC) from the broker.</li>
                <li>Our portal is not responsible for any fraudulent transactions or disputes.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="property-detail-cta">
        <div className="cta-price-info">
          <span className="cta-label">Total Price</span>
          <span className="cta-price">₹{property.price}</span>
        </div>
        <div className="cta-buttons">
          <a
            href={`https://wa.me/916370997812?text=Hi! I'm interested in ${property.title} at ${property.location} (₹${property.price}). Please share more details.`}
            className="cta-btn whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>
          <a href="tel:+916370997812" className="cta-btn call">
            <FiPhone />
            <span>Call Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
