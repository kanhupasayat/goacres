import { FiSearch, FiMapPin, FiMessageCircle, FiUsers, FiZap, FiThumbsUp } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Features.css';

const features = [
  {
    icon: <FiSearch />,
    title: 'Sab Plots Ek Jagah',
    description: 'Rourkela ke alag alag areas ke plots ek platform pe — ghar baithe browse karo, compare karo, best choose karo.'
  },
  {
    icon: <FiMapPin />,
    title: 'Prime Rourkela Locations',
    description: 'Civil Township, Koel Nagar, Sector 19, Chhend Colony — sabse high-demand areas me plots available.'
  },
  {
    icon: <FiUsers />,
    title: 'Trusted Brokers Se Connect',
    description: 'Hum aapko Rourkela ke trusted property owners aur brokers se seedha connect karte hain — beech me koi confusion nahi.'
  },
  {
    icon: <FiMessageCircle />,
    title: 'WhatsApp Pe Instant Response',
    description: 'Plot pasand aaya? WhatsApp karo — 30 minute me details, price aur broker se baat ho jayegi.'
  },
  {
    icon: <FiThumbsUp />,
    title: 'Buyers Ke Liye FREE',
    description: 'Hamare platform pe plot dhundhna aur enquiry karna bilkul free hai — buyers se koi charge nahi.'
  },
  {
    icon: <FiZap />,
    title: 'Koi Pressure Nahi',
    description: 'Browse karo, dekho, compare karo — jab tak satisfy na ho tab tak koi pressure nahi. Apna time lo, apna decision lo.'
  }
];

const Features = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="features section" id="features">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
        >
          <h2>GOACRES Kyun?</h2>
          <p>Rourkela me plot dhundhna ab easy hai — sab kuch ek platform pe</p>
        </div>

        <div ref={gridRef} className="features-grid">
          {features.map((feature, index) => (
            <div
              className={`feature-card animate-fade-up stagger-${index + 1} ${gridVisible ? 'is-visible' : ''}`}
              key={index}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
