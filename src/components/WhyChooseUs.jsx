import { FiCheckCircle, FiStar, FiMessageCircle, FiMapPin, FiFileText, FiKey } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './WhyChooseUs.css';

const WHATSAPP_NUMBER = '916370997812';
const WHATSAPP_MESSAGE = 'Hi! Mujhe Rourkela me plot chahiye. Available options batao please.';

const stats = [
  { number: '50+', label: 'Plots Listed' },
  { number: '6+', label: 'Rourkela Areas' },
  { number: 'FREE', label: 'Buyers Ke Liye' },
  { number: '30 min', label: 'WhatsApp Response' }
];

const howItWorks = [
  {
    step: '01',
    icon: <FiMessageCircle />,
    title: 'Browse Karo',
    description: 'Website pe available plots dekho — location, size, type sab dekho aur pasand ka plot choose karo.'
  },
  {
    step: '02',
    icon: <FiMapPin />,
    title: 'WhatsApp Karo',
    description: 'Plot pasand aaya? WhatsApp karo — hum turant price, details aur broker ki info share karenge.'
  },
  {
    step: '03',
    icon: <FiFileText />,
    title: 'Broker Se Milo',
    description: 'Hum aapko property owner/broker se seedha connect karte hain — baat karo, site visit karo, sab jaano.'
  },
  {
    step: '04',
    icon: <FiKey />,
    title: 'Deal Karo!',
    description: 'Sab kuch pasand aaya? Broker ke saath directly deal finalize karo — apna sapno ka plot book karo.'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sunil Mahato',
    location: 'Civil Township, Rourkela',
    text: 'GOACRES ne mujhe Civil Township me ek bahut accha plot dikhaya. Saare documents clear the aur registry bhi jaldi ho gayi. Bahut transparent dealing.',
    rating: 5
  },
  {
    id: 2,
    name: 'Neha Mishra',
    location: 'Koel Nagar, Rourkela',
    text: 'Pehle bahut darr lagta tha plot khareedne me — fraud ka risk. Par GOACRES ne saare legal papers verify karwaye aur poora process samjhaya. Recommend karungi.',
    rating: 5
  },
  {
    id: 3,
    name: 'Rakesh Agarwal',
    location: 'Sector 19, Rourkela',
    text: 'Commercial plot chahiye tha Sector 19 me. GOACRES ki team ne 3 options dikhaye, site visit karwaya, aur budget me best deal dilwaya. Professional service.',
    rating: 5
  }
];

const benefits = [
  'Rourkela ke multiple brokers ke plots ek jagah — easy comparison',
  'Trusted property owners aur brokers se direct connection',
  'WhatsApp pe instant response — 30 minute me jawab',
  'Platform bilkul FREE hai — buyers se koi charge nahi',
  'Koi pressure nahi — browse karo, pasand aaye toh baat karo'
];

const WhyChooseUs = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: howRef, isVisible: howVisible } = useScrollAnimation({ threshold: 0.1 });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <section className="why-choose section" id="about">
      <div className="container">
        {/* Stats Section */}
        <div ref={statsRef} className="stats-container">
          {stats.map((stat, index) => (
            <div
              className={`stat-item animate-scale-up stagger-${index + 1} ${statsVisible ? 'is-visible' : ''}`}
              key={index}
            >
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div ref={howRef} className={`how-it-works ${howVisible ? 'is-visible' : ''}`}>
          <div className="section-title" style={{ marginBottom: '40px' }}>
            <h2>Kaise Kaam Karta Hai?</h2>
            <p>4 simple steps me apna dream plot book karo</p>
          </div>
          <div className="how-steps">
            {howItWorks.map((item, index) => (
              <div className={`how-step animate-fade-up stagger-${index + 1} ${howVisible ? 'is-visible' : ''}`} key={index}>
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="how-cta">
            <a
              href={whatsappUrl}
              className="btn btn-whatsapp-consult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              Step 1 Se Shuru Karo — WhatsApp Karo
            </a>
          </div>
        </div>

        <div className="why-choose-content">
          <div
            ref={contentRef}
            className={`why-choose-text animate-fade-right ${contentVisible ? 'is-visible' : ''}`}
          >
            <div
              ref={titleRef}
              className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
              style={{ textAlign: 'left', marginBottom: '30px' }}
            >
              <h2>GOACRES Kyun?</h2>
              <p>Sab plots ek jagah — sahi broker se seedha connection</p>
            </div>

            <div className="mission-statement">
              <p>
                <strong>GOACRES</strong> Rourkela ka property listing platform hai.
                Hum multiple brokers ke plots ek jagah dikhate hain taaki aap easily compare kar sako —
                aur jo plot pasand aaye, hum aapko seedha broker se connect kara dete hain.
              </p>
            </div>

            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={`animate-fade-left stagger-${index + 1} ${contentVisible ? 'is-visible' : ''}`}
                >
                  <FiCheckCircle className="check-icon" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappUrl}
              className="btn btn-whatsapp-consult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              Available Plots Dekho — WhatsApp Karo
            </a>
          </div>

          <div
            ref={testimonialsRef}
            className={`testimonials-container animate-fade-left ${testimonialsVisible ? 'is-visible' : ''}`}
          >
            <h3>Hamare Clients Kya Kehte Hain</h3>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div
                  className={`testimonial-card animate-fade-up stagger-${index + 1} ${testimonialsVisible ? 'is-visible' : ''}`}
                  key={testimonial.id}
                >
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="star-filled" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="author-info">
                      <span className="author-name">{testimonial.name}</span>
                      <span className="author-location">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
