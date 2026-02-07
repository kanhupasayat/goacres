import { useState, useEffect } from 'react';
import {
  FiHome, FiGrid, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX,
  FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown, FiMinus,
  FiMapPin, FiStar, FiCheck, FiSearch, FiDollarSign, FiMap, FiImage,
  FiPhone, FiMail, FiClock, FiEye, FiChevronDown, FiRefreshCw,
  FiLayers, FiBarChart2, FiUsers, FiAward, FiShield
} from 'react-icons/fi';
import { propertiesAPI, priceIndexAPI, areaGuideAPI, enquiriesAPI, dashboardAPI, siteSettingsAPI, featuresAPI, statsAPI, testimonialsAPI, benefitsAPI } from './api';
import './Admin.css';

const AdminPanel = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [priceIndex, setPriceIndex] = useState([]);
  const [areas, setAreas] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [features, setFeatures] = useState([]);
  const [siteStats, setSiteStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsData, propsData, priceData, areasData, enqData, settingsData, featuresData, siteStatsData, testimonialsData, benefitsData] = await Promise.all([
        dashboardAPI.getStats(),
        propertiesAPI.getAll({ limit: 100 }),
        priceIndexAPI.getAll().catch(() => []),
        areaGuideAPI.getAll().catch(() => []),
        enquiriesAPI.getAll({ limit: 100 }).catch(() => ({ enquiries: [] })),
        siteSettingsAPI.get().catch(() => null),
        featuresAPI.getAll().catch(() => []),
        statsAPI.getAll().catch(() => []),
        testimonialsAPI.getAll().catch(() => []),
        benefitsAPI.getAll().catch(() => [])
      ]);
      setStats(statsData);
      setProperties(propsData.properties || []);
      setPriceIndex(priceData || []);
      setAreas(areasData || []);
      setEnquiries(enqData.enquiries || []);
      setSiteSettings(settingsData);
      setFeatures(featuresData || []);
      setSiteStats(siteStatsData || []);
      setTestimonials(testimonialsData || []);
      setBenefits(benefitsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertiesAPI.delete(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeletePrice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this price entry?')) return;
    try {
      await priceIndexAPI.delete(id);
      setPriceIndex(priceIndex.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm('Are you sure you want to delete this area?')) return;
    try {
      await areaGuideAPI.delete(id);
      setAreas(areas.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await enquiriesAPI.delete(id);
      setEnquiries(enquiries.filter(e => e.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeleteFeature = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;
    try {
      await featuresAPI.delete(id);
      setFeatures(features.filter(f => f.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeleteStat = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return;
    try {
      await statsAPI.delete(id);
      setSiteStats(siteStats.filter(s => s.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleDeleteBenefit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this benefit?')) return;
    try {
      await benefitsAPI.delete(id);
      setBenefits(benefits.filter(b => b.id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard' },
    { id: 'site-settings', icon: <FiLayers />, label: 'Hero Section' },
    { id: 'features', icon: <FiShield />, label: 'Features' },
    { id: 'stats', icon: <FiBarChart2 />, label: 'Stats' },
    { id: 'testimonials', icon: <FiUsers />, label: 'Testimonials' },
    { id: 'benefits', icon: <FiAward />, label: 'Benefits' },
    { id: 'properties', icon: <FiGrid />, label: 'Properties' },
    { id: 'price-index', icon: <FiDollarSign />, label: 'Price Index' },
    { id: 'area-guide', icon: <FiMap />, label: 'Area Guide' },
    { id: 'enquiries', icon: <FiMessageSquare />, label: 'Enquiries' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' }
  ];

  const getAddButton = () => {
    switch (activeTab) {
      case 'properties':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowPropertyModal(true); }}>
            <FiPlus /> Add Property
          </button>
        );
      case 'price-index':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowPriceModal(true); }}>
            <FiPlus /> Add Price
          </button>
        );
      case 'area-guide':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowAreaModal(true); }}>
            <FiPlus /> Add Area
          </button>
        );
      case 'features':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowFeatureModal(true); }}>
            <FiPlus /> Add Feature
          </button>
        );
      case 'stats':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowStatModal(true); }}>
            <FiPlus /> Add Stat
          </button>
        );
      case 'testimonials':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowTestimonialModal(true); }}>
            <FiPlus /> Add Testimonial
          </button>
        );
      case 'benefits':
        return (
          <button className="add-btn" onClick={() => { setEditingItem(null); setShowBenefitModal(true); }}>
            <FiPlus /> Add Benefit
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-panel light-theme">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">G</span>
            <div className="logo-text">
              <h1>GOACRES</h1>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Admin'}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2>{menuItems.find(m => m.id === activeTab)?.label}</h2>
          </div>
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchAllData} disabled={loading}>
              <FiRefreshCw className={loading ? 'spinning' : ''} />
            </button>
            {getAddButton()}
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <DashboardView stats={stats} properties={properties} priceIndex={priceIndex} areas={areas} loading={loading} />
          )}
          {activeTab === 'site-settings' && (
            <SiteSettingsView settings={siteSettings} onRefresh={fetchAllData} />
          )}
          {activeTab === 'features' && (
            <FeaturesView
              features={features}
              onEdit={(f) => { setEditingItem(f); setShowFeatureModal(true); }}
              onDelete={handleDeleteFeature}
            />
          )}
          {activeTab === 'stats' && (
            <StatsView
              stats={siteStats}
              onEdit={(s) => { setEditingItem(s); setShowStatModal(true); }}
              onDelete={handleDeleteStat}
            />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsView
              testimonials={testimonials}
              onEdit={(t) => { setEditingItem(t); setShowTestimonialModal(true); }}
              onDelete={handleDeleteTestimonial}
            />
          )}
          {activeTab === 'benefits' && (
            <BenefitsView
              benefits={benefits}
              onEdit={(b) => { setEditingItem(b); setShowBenefitModal(true); }}
              onDelete={handleDeleteBenefit}
            />
          )}
          {activeTab === 'properties' && (
            <PropertiesView
              properties={properties}
              onEdit={(p) => { setEditingItem(p); setShowPropertyModal(true); }}
              onDelete={handleDeleteProperty}
            />
          )}
          {activeTab === 'price-index' && (
            <PriceIndexView
              priceIndex={priceIndex}
              onEdit={(p) => { setEditingItem(p); setShowPriceModal(true); }}
              onDelete={handleDeletePrice}
            />
          )}
          {activeTab === 'area-guide' && (
            <AreaGuideView
              areas={areas}
              onEdit={(a) => { setEditingItem(a); setShowAreaModal(true); }}
              onDelete={handleDeleteArea}
            />
          )}
          {activeTab === 'enquiries' && (
            <EnquiriesView enquiries={enquiries} onDelete={handleDeleteEnquiry} />
          )}
          {activeTab === 'settings' && (
            <SettingsView user={user} />
          )}
        </div>
      </main>

      {/* Modals */}
      {showPropertyModal && (
        <PropertyModal
          property={editingItem}
          onClose={() => setShowPropertyModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await propertiesAPI.update(editingItem.id, data);
              } else {
                await propertiesAPI.create(data);
              }
              fetchAllData();
              setShowPropertyModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}

      {showPriceModal && (
        <PriceModal
          price={editingItem}
          onClose={() => setShowPriceModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await priceIndexAPI.update(editingItem.id, data);
              } else {
                await priceIndexAPI.create(data);
              }
              fetchAllData();
              setShowPriceModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}

      {showAreaModal && (
        <AreaModal
          area={editingItem}
          onClose={() => setShowAreaModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await areaGuideAPI.update(editingItem.id, data);
              } else {
                await areaGuideAPI.create(data);
              }
              fetchAllData();
              setShowAreaModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}

      {showFeatureModal && (
        <FeatureModal
          feature={editingItem}
          onClose={() => setShowFeatureModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await featuresAPI.update(editingItem.id, data);
              } else {
                await featuresAPI.create(data);
              }
              fetchAllData();
              setShowFeatureModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}

      {showStatModal && (
        <StatModal
          stat={editingItem}
          onClose={() => setShowStatModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await statsAPI.update(editingItem.id, data);
              } else {
                await statsAPI.create(data);
              }
              fetchAllData();
              setShowStatModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}

      {showTestimonialModal && (
        <TestimonialModal
          testimonial={editingItem}
          onClose={() => setShowTestimonialModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await testimonialsAPI.update(editingItem.id, data);
              } else {
                await testimonialsAPI.create(data);
              }
              fetchAllData();
              setShowTestimonialModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}

      {showBenefitModal && (
        <BenefitModal
          benefit={editingItem}
          onClose={() => setShowBenefitModal(false)}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await benefitsAPI.update(editingItem.id, data);
              } else {
                await benefitsAPI.create(data);
              }
              fetchAllData();
              setShowBenefitModal(false);
            } catch (error) {
              alert('Failed to save: ' + error.message);
            }
          }}
        />
      )}
    </div>
  );
};

// ========== Dashboard View ==========
const DashboardView = ({ stats, properties, priceIndex, areas, loading }) => {
  const statCards = [
    { icon: <FiGrid />, label: 'Properties', value: stats?.totalProperties || 0, color: 'blue' },
    { icon: <FiDollarSign />, label: 'Price Index', value: stats?.totalPriceIndex || 0, color: 'green' },
    { icon: <FiMap />, label: 'Areas', value: stats?.totalAreas || 0, color: 'purple' },
    { icon: <FiMessageSquare />, label: 'Enquiries', value: stats?.totalEnquiries || 0, color: 'orange' }
  ];

  return (
    <div className="dashboard-view">
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><FiGrid /> Recent Properties</h3>
          <div className="card-list">
            {properties.slice(0, 5).map(property => (
              <div key={property.id} className="list-item">
                <img src={property.thumbnail || property.images?.[0] || 'https://via.placeholder.com/60'} alt="" />
                <div className="item-info">
                  <h4>{property.title}</h4>
                  <p><FiMapPin /> {property.location}</p>
                </div>
                <span className="item-badge">{property.price}</span>
              </div>
            ))}
            {properties.length === 0 && <p className="empty-text">No properties yet</p>}
          </div>
        </div>

        <div className="dashboard-card">
          <h3><FiDollarSign /> Price Index</h3>
          <div className="card-list">
            {priceIndex.slice(0, 5).map(price => (
              <div key={price.id} className="list-item">
                <div className={`trend-icon ${price.trend}`}>
                  {price.trend === 'up' ? <FiTrendingUp /> : price.trend === 'down' ? <FiTrendingDown /> : <FiMinus />}
                </div>
                <div className="item-info">
                  <h4>{price.area_name}</h4>
                  <p>{price.description}</p>
                </div>
                <span className="item-badge green">Rs. {price.rate}/sqft</span>
              </div>
            ))}
            {priceIndex.length === 0 && <p className="empty-text">No price data yet</p>}
          </div>
        </div>

        <div className="dashboard-card">
          <h3><FiMap /> Area Guides</h3>
          <div className="card-list">
            {areas.slice(0, 5).map(area => (
              <div key={area.id} className="list-item">
                <img src={area.image || 'https://via.placeholder.com/60'} alt="" />
                <div className="item-info">
                  <h4>{area.name}</h4>
                  <p>{area.tagline}</p>
                </div>
                <span className="item-badge purple">{area.rating} <FiStar /></span>
              </div>
            ))}
            {areas.length === 0 && <p className="empty-text">No areas yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Properties View ==========
const PropertiesView = ({ properties, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.property_type?.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="data-view">
      <div className="view-filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="farm house">Farm House</option>
        </select>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Location</th>
              <th>Price</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map(property => (
              <tr key={property.id}>
                <td className="cell-with-image">
                  <img src={property.thumbnail || property.images?.[0] || 'https://via.placeholder.com/50'} alt="" />
                  <div>
                    <span className="primary-text">{property.title}</span>
                    <span className="secondary-text">{property.size} Sq.Ft</span>
                  </div>
                </td>
                <td>{property.location}</td>
                <td className="price-cell">{property.price}</td>
                <td><span className={`badge ${property.property_type?.toLowerCase().replace(' ', '-')}`}>{property.property_type}</span></td>
                <td><span className={`badge ${property.status?.toLowerCase()}`}>{property.status}</span></td>
                <td className="actions-cell">
                  <button className="action-btn edit" onClick={() => onEdit(property)}><FiEdit2 /></button>
                  <button className="action-btn delete" onClick={() => onDelete(property.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProperties.length === 0 && (
          <div className="empty-state">
            <FiGrid />
            <p>No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Price Index View ==========
const PriceIndexView = ({ priceIndex, onEdit, onDelete }) => {
  return (
    <div className="data-view">
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Area Name</th>
              <th>Description</th>
              <th>Rate (per sqft)</th>
              <th>Trend</th>
              <th>Change</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {priceIndex.map(price => (
              <tr key={price.id} className={price.is_highlighted ? 'highlighted-row' : ''}>
                <td className="primary-text">{price.area_name}</td>
                <td>{price.description}</td>
                <td className="price-cell">Rs. {price.rate}</td>
                <td>
                  <span className={`trend-badge ${price.trend}`}>
                    {price.trend === 'up' ? <FiTrendingUp /> : price.trend === 'down' ? <FiTrendingDown /> : <FiMinus />}
                    {price.trend}
                  </span>
                </td>
                <td>{price.change_percent}</td>
                <td>{price.display_order}</td>
                <td className="actions-cell">
                  <button className="action-btn edit" onClick={() => onEdit(price)}><FiEdit2 /></button>
                  <button className="action-btn delete" onClick={() => onDelete(price.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {priceIndex.length === 0 && (
          <div className="empty-state">
            <FiDollarSign />
            <p>No price data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Area Guide View ==========
const AreaGuideView = ({ areas, onEdit, onDelete }) => {
  return (
    <div className="data-view">
      <div className="cards-grid">
        {areas.map(area => (
          <div key={area.id} className="area-card">
            <div className="area-image">
              <img src={area.image || 'https://via.placeholder.com/300x200'} alt={area.name} />
              <span className="area-rating"><FiStar /> {area.rating}</span>
            </div>
            <div className="area-content">
              <h3>{area.name}</h3>
              <p className="tagline">{area.tagline}</p>
              <p className="description">{area.short_description}</p>
              <div className="area-meta">
                <span className="price-range">{area.price_range}</span>
                <span className="order">Order: {area.display_order}</span>
              </div>
              <div className="area-actions">
                <button className="action-btn edit" onClick={() => onEdit(area)}><FiEdit2 /> Edit</button>
                <button className="action-btn delete" onClick={() => onDelete(area.id)}><FiTrash2 /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {areas.length === 0 && (
          <div className="empty-state full-width">
            <FiMap />
            <p>No areas found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Enquiries View ==========
const EnquiriesView = ({ enquiries, onDelete }) => {
  return (
    <div className="data-view">
      {enquiries.length === 0 ? (
        <div className="empty-state">
          <FiMessageSquare />
          <h3>No Enquiries Yet</h3>
          <p>Customer enquiries will appear here</p>
        </div>
      ) : (
        <div className="enquiries-grid">
          {enquiries.map(enquiry => (
            <div key={enquiry.id} className="enquiry-card">
              <div className="enquiry-header">
                <h4>{enquiry.name}</h4>
                <span className={`status-badge ${enquiry.status}`}>{enquiry.status}</span>
              </div>
              <p className="enquiry-message">{enquiry.message}</p>
              <div className="enquiry-contact">
                <span><FiMail /> {enquiry.email}</span>
                <span><FiPhone /> {enquiry.phone}</span>
              </div>
              <div className="enquiry-footer">
                <span className="enquiry-date"><FiClock /> {new Date(enquiry.created_at).toLocaleDateString()}</span>
                <button className="action-btn delete" onClick={() => onDelete(enquiry.id)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== Settings View ==========
const SettingsView = ({ user }) => {
  return (
    <div className="settings-view">
      <div className="settings-card">
        <h3>Account Information</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={user?.name || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user?.is_admin ? 'Administrator' : 'User'} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Property Modal ==========
const PropertyModal = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    location: property?.location || '',
    area: property?.area || '',
    price: property?.price || '',
    price_per_sqft: property?.price_per_sqft || '',
    size: property?.size || '',
    property_type: property?.property_type || 'Residential',
    status: property?.status || 'Available',
    is_new: property?.is_new || false,
    is_featured: property?.is_featured || false,
    thumbnail: property?.thumbnail || '',
    images: property?.images || [],
    features: property?.features || []
  });

  const [featuresInput, setFeaturesInput] = useState(formData.features.join(', '));
  const [imagesInput, setImagesInput] = useState(formData.images.join('\n'));

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      features: featuresInput.split(',').map(f => f.trim()).filter(f => f),
      images: imagesInput.split('\n').map(i => i.trim()).filter(i => i)
    };
    onSave(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{property ? 'Edit Property' : 'Add New Property'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Premium Corner Plot"
                required
              />
            </div>
            <div className="form-group">
              <label>Property Type *</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Farm House">Farm House</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the property..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Civil Township, Rourkela"
                required
              />
            </div>
            <div className="form-group">
              <label>Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Civil Township"
              />
            </div>
          </div>

          <div className="form-row three">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 1.25 Crore"
                required
              />
            </div>
            <div className="form-group">
              <label>Price/Sq.Ft</label>
              <input
                type="text"
                value={formData.price_per_sqft}
                onChange={(e) => setFormData({ ...formData, price_per_sqft: e.target.value })}
                placeholder="e.g., 2,500"
              />
            </div>
            <div className="form-group">
              <label>Size (Sq.Ft) *</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 5,000"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                />
                <span>New Launch</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span>Featured</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Image URLs (one per line)</label>
            <textarea
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              placeholder="https://example.com/image1.jpg"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Features (comma separated)</label>
            <input
              type="text"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Corner Plot, Park Facing, 40ft Wide Road"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{property ? 'Update' : 'Add'} Property</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== Price Modal ==========
const PriceModal = ({ price, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    area_name: price?.area_name || '',
    description: price?.description || '',
    rate: price?.rate || '',
    trend: price?.trend || 'stable',
    change_percent: price?.change_percent || '0%',
    is_highlighted: price?.is_highlighted || false,
    display_order: price?.display_order || 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      rate: parseInt(formData.rate) || 0,
      display_order: parseInt(formData.display_order) || 1
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{price ? 'Edit Price' : 'Add Price Entry'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Area Name *</label>
            <input
              type="text"
              value={formData.area_name}
              onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
              placeholder="e.g., Civil Township"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Premium locality near Steel Plant"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rate (per sqft) *</label>
              <input
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                placeholder="e.g., 4500"
                required
              />
            </div>
            <div className="form-group">
              <label>Trend</label>
              <select
                value={formData.trend}
                onChange={(e) => setFormData({ ...formData, trend: e.target.value })}
              >
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="stable">Stable</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Change Percent</label>
              <input
                type="text"
                value={formData.change_percent}
                onChange={(e) => setFormData({ ...formData, change_percent: e.target.value })}
                placeholder="e.g., +8%"
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_highlighted}
                onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
              />
              <span>Highlight this entry</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{price ? 'Update' : 'Add'} Price</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== Site Settings View ==========
const SiteSettingsView = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState({
    hero_title: settings?.hero_title || 'Land Deals, Made Easy.',
    hero_subtitle: settings?.hero_subtitle || 'GOACRES: Your Trust, Our Land.',
    hero_image: settings?.hero_image || '',
    hero_cta_text: settings?.hero_cta_text || 'Explore Plots',
    locations: settings?.locations || [],
    budgets: settings?.budgets || [],
    contact_phone: settings?.contact_phone || '',
    contact_email: settings?.contact_email || '',
    contact_address: settings?.contact_address || '',
    facebook_url: settings?.facebook_url || '',
    instagram_url: settings?.instagram_url || '',
    youtube_url: settings?.youtube_url || '',
    whatsapp_number: settings?.whatsapp_number || ''
  });
  const [locationsInput, setLocationsInput] = useState((settings?.locations || []).join(', '));
  const [budgetsInput, setBudgetsInput] = useState((settings?.budgets || []).join(', '));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_image: settings.hero_image || '',
        hero_cta_text: settings.hero_cta_text || '',
        locations: settings.locations || [],
        budgets: settings.budgets || [],
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        contact_address: settings.contact_address || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        youtube_url: settings.youtube_url || '',
        whatsapp_number: settings.whatsapp_number || ''
      });
      setLocationsInput((settings.locations || []).join(', '));
      setBudgetsInput((settings.budgets || []).join(', '));
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await siteSettingsAPI.update({
        ...formData,
        locations: locationsInput.split(',').map(l => l.trim()).filter(l => l),
        budgets: budgetsInput.split(',').map(b => b.trim()).filter(b => b)
      });
      alert('Settings saved successfully!');
      onRefresh();
    } catch (error) {
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-view">
      <div className="settings-card">
        <h3><FiLayers /> Hero Section Settings</h3>
        <div className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>Hero Title</label>
              <input
                type="text"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                placeholder="Land Deals, Made Easy."
              />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <input
                type="text"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                placeholder="GOACRES: Your Trust, Our Land."
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hero Image URL</label>
              <input
                type="url"
                value={formData.hero_image}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>CTA Button Text</label>
              <input
                type="text"
                value={formData.hero_cta_text}
                onChange={(e) => setFormData({ ...formData, hero_cta_text: e.target.value })}
                placeholder="Explore Plots"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h3><FiSearch /> Search Options</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>Locations (comma separated)</label>
            <input
              type="text"
              value={locationsInput}
              onChange={(e) => setLocationsInput(e.target.value)}
              placeholder="Civil Township, Chhend Colony, Koel Nagar"
            />
          </div>
          <div className="form-group">
            <label>Budgets (comma separated)</label>
            <input
              type="text"
              value={budgetsInput}
              onChange={(e) => setBudgetsInput(e.target.value)}
              placeholder="Under 25 Lac, 25-50 Lac, 50 Lac - 1 Cr"
            />
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h3><FiPhone /> Contact Information</h3>
        <div className="settings-form">
          <div className="form-row three">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="info@goacres.com"
              />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="+919876543210"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={formData.contact_address}
              onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
              placeholder="Rourkela, Odisha, India"
            />
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h3><FiUsers /> Social Media Links</h3>
        <div className="settings-form">
          <div className="form-row three">
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="form-group">
              <label>YouTube URL</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

// ========== Features View ==========
const FeaturesView = ({ features, onEdit, onDelete }) => {
  return (
    <div className="data-view">
      <div className="info-banner">
        <FiShield /> Manage the "5 Pillars of Trust" features shown on your homepage
      </div>
      <div className="cards-grid features-grid">
        {features.map(feature => (
          <div key={feature.id} className={`feature-card ${!feature.is_active ? 'inactive' : ''}`}>
            <div className="feature-icon">
              <FiShield />
            </div>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-meta">
                <span className="icon-label">Icon: {feature.icon}</span>
                <span className="order-label">Order: {feature.display_order}</span>
                {!feature.is_active && <span className="status-inactive">Inactive</span>}
              </div>
            </div>
            <div className="card-actions">
              <button className="action-btn edit" onClick={() => onEdit(feature)}><FiEdit2 /></button>
              <button className="action-btn delete" onClick={() => onDelete(feature.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {features.length === 0 && (
          <div className="empty-state full-width">
            <FiShield />
            <p>No features found. Add your first feature!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Stats View ==========
const StatsView = ({ stats, onEdit, onDelete }) => {
  return (
    <div className="data-view">
      <div className="info-banner">
        <FiBarChart2 /> Manage statistics like "500+ Happy Families" shown in Why Choose Us section
      </div>
      <div className="cards-grid stats-grid">
        {stats.map(stat => (
          <div key={stat.id} className={`stat-card-item ${!stat.is_active ? 'inactive' : ''}`}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-meta">
              <span>Order: {stat.display_order}</span>
              {!stat.is_active && <span className="status-inactive">Inactive</span>}
            </div>
            <div className="card-actions">
              <button className="action-btn edit" onClick={() => onEdit(stat)}><FiEdit2 /></button>
              <button className="action-btn delete" onClick={() => onDelete(stat.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {stats.length === 0 && (
          <div className="empty-state full-width">
            <FiBarChart2 />
            <p>No stats found. Add your first stat!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Testimonials View ==========
const TestimonialsView = ({ testimonials, onEdit, onDelete }) => {
  return (
    <div className="data-view">
      <div className="info-banner">
        <FiUsers /> Manage customer testimonials shown in Why Choose Us section
      </div>
      <div className="cards-grid testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className={`testimonial-card ${!testimonial.is_active ? 'inactive' : ''}`}>
            <div className="testimonial-header">
              <div className="testimonial-avatar">{testimonial.name.charAt(0)}</div>
              <div className="testimonial-info">
                <h4>{testimonial.name}</h4>
                <span><FiMapPin /> {testimonial.location}</span>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < testimonial.rating ? 'filled' : ''} />
                ))}
              </div>
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-meta">
              <span>Order: {testimonial.display_order}</span>
              {!testimonial.is_active && <span className="status-inactive">Inactive</span>}
            </div>
            <div className="card-actions">
              <button className="action-btn edit" onClick={() => onEdit(testimonial)}><FiEdit2 /></button>
              <button className="action-btn delete" onClick={() => onDelete(testimonial.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="empty-state full-width">
            <FiUsers />
            <p>No testimonials found. Add your first testimonial!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Benefits View ==========
const BenefitsView = ({ benefits, onEdit, onDelete }) => {
  return (
    <div className="data-view">
      <div className="info-banner">
        <FiAward /> Manage the benefits list shown in Why Choose Us section
      </div>
      <div className="benefits-list">
        {benefits.map(benefit => (
          <div key={benefit.id} className={`benefit-item ${!benefit.is_active ? 'inactive' : ''}`}>
            <div className="benefit-check"><FiCheck /></div>
            <div className="benefit-text">{benefit.text}</div>
            <div className="benefit-meta">
              <span>Order: {benefit.display_order}</span>
              {!benefit.is_active && <span className="status-inactive">Inactive</span>}
            </div>
            <div className="benefit-actions">
              <button className="action-btn edit" onClick={() => onEdit(benefit)}><FiEdit2 /></button>
              <button className="action-btn delete" onClick={() => onDelete(benefit.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {benefits.length === 0 && (
          <div className="empty-state">
            <FiAward />
            <p>No benefits found. Add your first benefit!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Area Modal ==========
const AreaModal = ({ area, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: area?.name || '',
    tagline: area?.tagline || '',
    short_description: area?.short_description || '',
    full_description: area?.full_description || '',
    image: area?.image || '',
    rating: area?.rating || 4.0,
    price_range: area?.price_range || '',
    amenities: area?.amenities || [],
    highlights: area?.highlights || [],
    display_order: area?.display_order || 1
  });

  const [highlightsInput, setHighlightsInput] = useState(formData.highlights.join(', '));
  const [amenitiesInput, setAmenitiesInput] = useState(
    formData.amenities.map(a => `${a.icon}:${a.name}:${a.count}:${a.detail}`).join('\n')
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse amenities
    const amenities = amenitiesInput.split('\n').filter(line => line.trim()).map(line => {
      const [icon, name, count, detail] = line.split(':').map(s => s.trim());
      return { icon: icon || 'star', name: name || '', count: count || '', detail: detail || '' };
    });

    onSave({
      ...formData,
      rating: parseFloat(formData.rating) || 4.0,
      display_order: parseInt(formData.display_order) || 1,
      highlights: highlightsInput.split(',').map(h => h.trim()).filter(h => h),
      amenities
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{area ? 'Edit Area' : 'Add New Area'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Area Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chhend Colony"
                required
              />
            </div>
            <div className="form-group">
              <label>Tagline *</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g., The Family Paradise"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Short Description *</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief description for cards"
              required
            />
          </div>

          <div className="form-group">
            <label>Full Description</label>
            <textarea
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="Detailed description..."
              rows={4}
            />
          </div>

          <div className="form-row three">
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Price Range</label>
            <input
              type="text"
              value={formData.price_range}
              onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
              placeholder="e.g., Rs. 2,000 - Rs. 2,500 /sq.ft"
            />
          </div>

          <div className="form-group">
            <label>Highlights (comma separated)</label>
            <input
              type="text"
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder="Family-friendly, Well-connected, Low crime rate"
            />
          </div>

          <div className="form-group">
            <label>Amenities (format: icon:name:count:detail, one per line)</label>
            <textarea
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              placeholder="school:Schools:8+ Schools:DAV, DPS nearby&#10;hospital:Hospitals:3 Hospitals:IGH within 2km"
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{area ? 'Update' : 'Add'} Area</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== Feature Modal ==========
const FeatureModal = ({ feature, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    icon: feature?.icon || 'shield',
    title: feature?.title || '',
    description: feature?.description || '',
    display_order: feature?.display_order || 1,
    is_active: feature?.is_active !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      display_order: parseInt(formData.display_order) || 1
    });
  };

  const iconOptions = ['shield', 'map', 'file-text', 'users', 'trending-up', 'check', 'star', 'award', 'home', 'heart'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{feature ? 'Edit Feature' : 'Add New Feature'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Verified Listings"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this feature..."
              rows={3}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{feature ? 'Update' : 'Add'} Feature</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== Stat Modal ==========
const StatModal = ({ stat, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    number: stat?.number || '',
    label: stat?.label || '',
    display_order: stat?.display_order || 1,
    is_active: stat?.is_active !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      display_order: parseInt(formData.display_order) || 1
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{stat ? 'Edit Stat' : 'Add New Stat'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Number *</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="e.g., 500+"
                required
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Happy Families"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{stat ? 'Update' : 'Add'} Stat</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== Testimonial Modal ==========
const TestimonialModal = ({ testimonial, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    location: testimonial?.location || '',
    text: testimonial?.text || '',
    rating: testimonial?.rating || 5,
    display_order: testimonial?.display_order || 1,
    is_active: testimonial?.is_active !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      rating: parseInt(formData.rating) || 5,
      display_order: parseInt(formData.display_order) || 1
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rajesh Kumar"
                required
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Civil Township"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Testimonial Text *</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="What did the customer say..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating (1-5)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{testimonial ? 'Update' : 'Add'} Testimonial</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== Benefit Modal ==========
const BenefitModal = ({ benefit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    text: benefit?.text || '',
    display_order: benefit?.display_order || 1,
    is_active: benefit?.is_active !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      display_order: parseInt(formData.display_order) || 1
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{benefit ? 'Edit Benefit' : 'Add New Benefit'}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Benefit Text *</label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="e.g., 100% Legal & Verified Properties"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{benefit ? 'Update' : 'Add'} Benefit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
