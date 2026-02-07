// API Configuration and Services
const API_BASE_URL = 'http://localhost:8000/api';

// Get stored token
const getToken = () => localStorage.getItem('admin_token');

// API Headers with auth
const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login-json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Login failed');
    return data;
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get user');
    return data;
  }
};

// Properties API
export const propertiesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/properties?${queryString}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch properties');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Property not found');
    return data;
  },

  create: async (propertyData) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(propertyData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create property');
    return data;
  },

  update: async (id, propertyData) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(propertyData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update property');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete property');
    return data;
  }
};

// Price Index API
export const priceIndexAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/price-index`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch price index');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/price-index/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Price not found');
    return data;
  },

  create: async (priceData) => {
    const response = await fetch(`${API_BASE_URL}/price-index`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(priceData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create price');
    return data;
  },

  update: async (id, priceData) => {
    const response = await fetch(`${API_BASE_URL}/price-index/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(priceData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update price');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/price-index/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete price');
    return data;
  }
};

// Area Guide API
export const areaGuideAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch areas');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Area not found');
    return data;
  },

  create: async (areaData) => {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(areaData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create area');
    return data;
  },

  update: async (id, areaData) => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(areaData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update area');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete area');
    return data;
  }
};

// Enquiries API
export const enquiriesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/enquiries?${queryString}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch enquiries');
    return data;
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update status');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete enquiry');
    return data;
  }
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [properties, priceIndex, areas, enquiries] = await Promise.all([
        propertiesAPI.getAll({ limit: 100 }),
        priceIndexAPI.getAll().catch(() => []),
        areaGuideAPI.getAll().catch(() => []),
        enquiriesAPI.getAll({ limit: 100 }).catch(() => ({ total: 0, enquiries: [] }))
      ]);

      return {
        totalProperties: properties.total || properties.properties?.length || 0,
        featuredProperties: properties.properties?.filter(p => p.is_featured).length || 0,
        availableProperties: properties.properties?.filter(p => p.status === 'Available').length || 0,
        totalPriceIndex: priceIndex.length || 0,
        totalAreas: areas.length || 0,
        totalEnquiries: enquiries.total || enquiries.enquiries?.length || 0,
        pendingEnquiries: enquiries.enquiries?.filter(e => e.status === 'pending').length || 0
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        totalProperties: 0,
        featuredProperties: 0,
        availableProperties: 0,
        totalPriceIndex: 0,
        totalAreas: 0,
        totalEnquiries: 0,
        pendingEnquiries: 0
      };
    }
  }
};

// Site Settings API
export const siteSettingsAPI = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/site-settings`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch settings');
    return data;
  },

  update: async (settingsData) => {
    const response = await fetch(`${API_BASE_URL}/site-settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update settings');
    return data;
  }
};

// Features API
export const featuresAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/features/all`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch features');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/features/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Feature not found');
    return data;
  },

  create: async (featureData) => {
    const response = await fetch(`${API_BASE_URL}/features`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(featureData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create feature');
    return data;
  },

  update: async (id, featureData) => {
    const response = await fetch(`${API_BASE_URL}/features/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(featureData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update feature');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/features/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete feature');
    return data;
  }
};

// Stats API
export const statsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/all`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch stats');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Stat not found');
    return data;
  },

  create: async (statData) => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(statData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create stat');
    return data;
  },

  update: async (id, statData) => {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update stat');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete stat');
    return data;
  }
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/testimonials/all`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch testimonials');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Testimonial not found');
    return data;
  },

  create: async (testimonialData) => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testimonialData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create testimonial');
    return data;
  },

  update: async (id, testimonialData) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(testimonialData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update testimonial');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete testimonial');
    return data;
  }
};

// Benefits API
export const benefitsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/benefits/all`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch benefits');
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Benefit not found');
    return data;
  },

  create: async (benefitData) => {
    const response = await fetch(`${API_BASE_URL}/benefits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(benefitData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create benefit');
    return data;
  },

  update: async (id, benefitData) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(benefitData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update benefit');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete benefit');
    return data;
  }
};

export default { authAPI, propertiesAPI, priceIndexAPI, areaGuideAPI, enquiriesAPI, dashboardAPI, siteSettingsAPI, featuresAPI, statsAPI, testimonialsAPI, benefitsAPI };
