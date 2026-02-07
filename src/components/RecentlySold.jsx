import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './RecentlySold.css';

const WHATSAPP_NUMBER = '916370997812';

const soldProperties = [
  {
    id: 1,
    title: 'Residential Plot',
    location: 'Koel Nagar, Rourkela',
    size: '1,600 Sq.Ft',
    soldAgo: '2 hafte pehle',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Commercial Plot',
    location: 'Sector 19, Rourkela',
    size: '3,200 Sq.Ft',
    soldAgo: '5 din pehle',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Corner Plot - Premium',
    location: 'Civil Township, Rourkela',
    size: '2,400 Sq.Ft',
    soldAgo: '1 hafte pehle',
    image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

const RecentlySold = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! Mujhe available plots ki list chahiye Rourkela me. Please share karo.')}`;

  return (
    <section className="recently-sold section" ref={sectionRef}>
      <div className="container">
        <div className={`sold-header ${isVisible ? 'is-visible' : ''}`}>
          <h2>Ye Plots <span className="sold-highlight">Bik Chuke Hain</span></h2>
          <p>Rourkela me plots ki demand tez hai — jaldi decision lo warna miss ho jayega</p>
        </div>

        <div className="sold-grid">
          {soldProperties.map((property, index) => (
            <div
              className={`sold-card ${isVisible ? 'is-visible' : ''}`}
              key={property.id}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="sold-card-image">
                <img src={property.image} alt={property.title} loading="lazy" />
                <div className="sold-overlay"></div>
                <div className="sold-stamp">SOLD</div>
                <div className="sold-time">{property.soldAgo}</div>
              </div>
              <div className="sold-card-content">
                <h4>{property.title}</h4>
                <div className="sold-location">
                  <FiMapPin />
                  <span>{property.location}</span>
                </div>
                <span className="sold-size">{property.size}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`sold-cta ${isVisible ? 'is-visible' : ''}`}>
          <p className="sold-cta-text">Isse pehle ki aur plots bik jaayein —</p>
          <a
            href={whatsappUrl}
            className="sold-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>Available Plots Dekho — WhatsApp Karo</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentlySold;
