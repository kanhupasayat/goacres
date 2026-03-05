import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import LegalModal from './LegalModal';
import { useTranslation } from '../hooks/useTranslation';
import './Footer.css';

const WHATSAPP_NUMBER = '919187428518';

const TermsContent = () => (
  <>
    <p className="legal-date">Last updated: February 2026</p>

    <h3>1. About GOACRES</h3>
    <p>
      GOACRES ("we", "us", "our", "platform") is an <strong>online property listing and referral platform</strong> based in Rourkela, Odisha, India. We act solely as an intermediary that connects potential property buyers with third-party property owners, brokers, and dealers. <strong>GOACRES is NOT the owner, seller, developer, or promoter of any property listed on this website.</strong>
    </p>

    <h3>2. Nature of Services</h3>
    <p>
      GOACRES provides the following services:
    </p>
    <ul>
      <li>Listing properties on behalf of third-party property owners and brokers on our website</li>
      <li>Connecting interested buyers with property owners/brokers via WhatsApp or phone</li>
      <li>Forwarding buyer inquiries (leads) to the relevant property owners/brokers</li>
    </ul>
    <p>
      <strong>GOACRES does NOT provide legal services, property valuation, title verification, documentation assistance, site visit services, or any form of legal certification.</strong> All property-related services including site visits, documentation, title verification, and registration are handled directly by the respective property owners/brokers. GOACRES merely connects buyers with these third parties.
    </p>

    <h3>3. No Guarantee or Warranty</h3>
    <p>
      All property information displayed on this platform — including but not limited to location, size, price, availability, images, descriptions, and legal status — is provided by third-party property owners and brokers. <strong>GOACRES does NOT independently verify, validate, or guarantee the accuracy, completeness, or authenticity of any property information.</strong>
    </p>
    <p>
      We make <strong>NO warranty or guarantee</strong> regarding:
    </p>
    <ul>
      <li>The legal title or ownership status of any property</li>
      <li>The accuracy of property sizes, boundaries, or measurements</li>
      <li>The accuracy of prices or availability of any listing</li>
      <li>The condition, quality, or suitability of any property</li>
      <li>The authenticity or validity of any property documents</li>
      <li>The identity, credibility, or reliability of property owners/brokers</li>
      <li>The completion or outcome of any property transaction</li>
    </ul>

    <h3>4. Buyer's Responsibility</h3>
    <p>
      Any person using this platform to find or purchase property is <strong>solely responsible</strong> for:
    </p>
    <ul>
      <li>Independently verifying all property information, documents, title, and legal status</li>
      <li>Engaging a qualified and independent legal professional (advocate/lawyer) before making any purchase decision</li>
      <li>Conducting physical verification and due diligence of the property</li>
      <li>Verifying the identity and authority of the seller/owner</li>
      <li>Understanding and complying with all applicable laws including RERA, Transfer of Property Act, Registration Act, and local land laws</li>
      <li>All financial decisions and transactions made with property owners/brokers</li>
    </ul>
    <p>
      <strong>GOACRES strongly advises all buyers to engage their own legal counsel before entering into any property transaction. Do NOT rely solely on information provided on this website or by our team.</strong>
    </p>

    <h3>5. No Party to Transactions</h3>
    <p>
      GOACRES is <strong>NOT a party to any transaction</strong> between buyers and property owners/brokers. Any agreement, payment, or transaction is solely between the buyer and the property owner/broker. GOACRES shall not be responsible for any disputes, losses, damages, fraud, or claims arising from such transactions.
    </p>

    <h3>6. Limitation of Liability</h3>
    <p>
      To the maximum extent permitted by law, GOACRES, its owners, employees, and agents shall <strong>NOT be liable</strong> for:
    </p>
    <ul>
      <li>Any loss, damage, or claim arising from the use of this website or reliance on any information provided herein</li>
      <li>Any fraud, misrepresentation, or default by property owners, brokers, or any third party</li>
      <li>Any defect in title, legal dispute, encumbrance, or litigation related to any property</li>
      <li>Any financial loss arising from property transactions facilitated through this platform</li>
      <li>Any indirect, consequential, or incidental damages of any kind</li>
    </ul>

    <h3>7. Images and Representations</h3>
    <p>
      All images displayed on this website are <strong>for illustration purposes only</strong> and may not represent the actual property, its current condition, or surroundings. Buyers must physically inspect the property before making any decision. Stock images may be used where actual property images are not available.
    </p>

    <h3>8. Prices and Availability</h3>
    <p>
      All prices, sizes, and availability information are <strong>subject to change without prior notice</strong> and are determined by the respective property owners/brokers. GOACRES does not control or guarantee any pricing. The final terms of any transaction are solely between the buyer and the seller.
    </p>

    <h3>9. RERA Compliance</h3>
    <p>
      GOACRES is a property listing/referral platform and not a real estate agent or developer as defined under the Real Estate (Regulation and Development) Act, 2016 (RERA). Buyers are advised to verify the RERA registration status of any project or agent independently. GOACRES does not guarantee RERA compliance of any listed property.
    </p>

    <h3>10. Intellectual Property</h3>
    <p>
      The GOACRES name, logo, and website design are the property of GOACRES. Unauthorized use, reproduction, or distribution of any content from this website is prohibited.
    </p>

    <h3>11. Changes to Terms</h3>
    <p>
      We reserve the right to modify these Terms & Conditions at any time without prior notice. Continued use of this website after any changes constitutes acceptance of the modified terms.
    </p>

    <h3>12. Governing Law & Jurisdiction</h3>
    <p>
      These Terms & Conditions are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the <strong>exclusive jurisdiction of the courts in Rourkela, Odisha, India.</strong>
    </p>

    <h3>13. Contact</h3>
    <p>
      For any questions regarding these Terms & Conditions, contact us at:<br />
      Email: goacres.in@gmail.com<br />
      Phone: +91 91874 28518<br />
      Location: Rourkela, Odisha, India
    </p>
  </>
);

const PrivacyContent = () => (
  <>
    <p className="legal-date">Last updated: February 2026</p>

    <h3>1. Information We Collect</h3>
    <p>When you use our website or contact us via WhatsApp/phone, we may collect:</p>
    <ul>
      <li>Your name</li>
      <li>Phone number / WhatsApp number</li>
      <li>Property preferences (budget, location, type)</li>
      <li>Messages sent via WhatsApp</li>
      <li>Website usage data (pages visited, device info)</li>
    </ul>

    <h3>2. How We Use Your Information</h3>
    <p>We use the collected information to:</p>
    <ul>
      <li>Connect you with relevant property owners and brokers</li>
      <li>Share property options matching your requirements</li>
      <li>Arrange site visits</li>
      <li>Send follow-up messages regarding your property inquiry</li>
      <li>Improve our website and services</li>
    </ul>

    <h3>3. Sharing of Information</h3>
    <p>
      We may share your contact information and property preferences with <strong>third-party property owners and brokers</strong> for the purpose of connecting you with relevant property listings. By using this platform and contacting us, you consent to such sharing.
    </p>
    <p>
      We do NOT sell your personal information to any third party for marketing purposes unrelated to property services.
    </p>

    <h3>4. Data Retention</h3>
    <p>
      We retain your information for as long as necessary to provide our services or as required by law. You may request deletion of your data by contacting us.
    </p>

    <h3>5. Security</h3>
    <p>
      We take reasonable measures to protect your information. However, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security of your data.
    </p>

    <h3>6. Third-Party Services</h3>
    <p>
      Our website may contain links to third-party services (WhatsApp, social media). These services have their own privacy policies and we are not responsible for their practices.
    </p>

    <h3>7. Cookies</h3>
    <p>
      Our website may use cookies and similar technologies to improve user experience and track website usage. You can control cookies through your browser settings.
    </p>

    <h3>8. Your Rights</h3>
    <p>Under applicable Indian laws, you have the right to:</p>
    <ul>
      <li>Request access to your personal data</li>
      <li>Request correction of inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Withdraw consent for data processing</li>
    </ul>
    <p>To exercise these rights, contact us at goacres.in@gmail.com.</p>

    <h3>9. Children's Privacy</h3>
    <p>
      Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from minors.
    </p>

    <h3>10. Changes to This Policy</h3>
    <p>
      We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
    </p>

    <h3>11. Contact</h3>
    <p>
      For privacy-related concerns, contact us at:<br />
      Email: goacres.in@gmail.com<br />
      Phone: +91 91874 28518<br />
      Location: Rourkela, Odisha, India
    </p>
  </>
);

const Footer = () => {
  const [legalOpen, setLegalOpen] = useState(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const { t, tArray } = useTranslation();

  const quickLinksHrefs = ['#home', '#listings', '#about', '#contact'];
  const quickLinkNames = tArray('footer.quickLinks.items');
  const propertyTypeNames = tArray('footer.propertyTypes.items');

  const socialLinks = [
    { icon: <FaWhatsapp />, href: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp' },
    { icon: <FaInstagram />, href: 'https://www.instagram.com/goacres.in/', label: 'Instagram' },
    { icon: <FaFacebookF />, href: 'https://www.facebook.com/profile.php?id=61587903158067', label: 'Facebook' }
  ];

  return (
    <footer className="footer" id="contact">
      <div className="container">
        {/* Main Footer */}
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <img src="/logo.png?v=2" alt="GOACRES" className="footer-logo-img" />
            </a>
            <p className="footer-tagline">{t('footer.tagline')}</p>
            <p className="footer-description">
              {t('footer.description')}
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="social-link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <h4>{t('footer.quickLinks.title')}</h4>
            <ul>
              {quickLinkNames.map((name, index) => (
                <li key={index}>
                  <a href={quickLinksHrefs[index]}>{name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>{t('footer.propertyTypes.title')}</h4>
            <ul>
              {propertyTypeNames.map((name, index) => (
                <li key={index}>
                  <a href="#listings">{name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4>{t('footer.contactUs.title')}</h4>
            <ul>
              <li>
                <FiMapPin className="contact-icon" />
                <span>Rourkela, Odisha, India</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <a href="tel:+919187428518">+91 91874 28518</a>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <a href="mailto:goacres.in@gmail.com">goacres.in@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GOACRES. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setLegalOpen('terms'); }}>{t('footer.termsLink')}</a>
            <span className="footer-dot"></span>
            <a href="#" onClick={(e) => { e.preventDefault(); setLegalOpen('privacy'); }}>{t('footer.privacyLink')}</a>
          </div>
        </div>

        {/* Legal Disclaimer — collapsible */}
        <div className={`footer-disclaimer ${disclaimerOpen ? 'disclaimer-open' : ''}`}>
          <p className="disclaimer-text">
            <strong>{t('footer.disclaimer').split(':')[0]}:</strong>{t('footer.disclaimer').split(':').slice(1).join(':')}
            <span className="disclaimer-more"> All property information (including prices, sizes, images, and availability) is provided by third-party property owners and brokers — GOACRES does not independently verify this information. All property-related services including site visits, documentation, and registration are provided by the respective property owners/brokers, not by GOACRES. Images shown are for illustration purposes only. Buyers are advised to independently verify all property details through their own legal counsel before making any purchase decision. GOACRES is not a party to any transaction. Prices and availability are subject to change without notice. By using this website, you agree to our <a href="#" onClick={(e) => { e.preventDefault(); setLegalOpen('terms'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="#" onClick={(e) => { e.preventDefault(); setLegalOpen('privacy'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</a>.</span>
          </p>
          <button
            className="disclaimer-toggle"
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
          >
            {disclaimerOpen ? t('footer.showLess') : t('footer.readMore')}
          </button>
        </div>
      </div>

      {/* Legal Modals */}
      {legalOpen === 'terms' && (
        <LegalModal title="Terms & Conditions" onClose={() => setLegalOpen(null)}>
          <TermsContent />
        </LegalModal>
      )}
      {legalOpen === 'privacy' && (
        <LegalModal title="Privacy Policy" onClose={() => setLegalOpen(null)}>
          <PrivacyContent />
        </LegalModal>
      )}
    </footer>
  );
};

export default Footer;
