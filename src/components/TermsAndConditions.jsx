import { useEffect } from 'react';
import { FiArrowLeft, FiShield, FiAlertTriangle, FiFileText, FiUsers, FiCheckCircle, FiDollarSign, FiUserCheck, FiAlertCircle, FiFlag, FiMapPin, FiEdit3 } from 'react-icons/fi';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="terms-page">
      {/* Header */}
      <header className="terms-header">
        <div className="container">
          <button className="back-btn" onClick={goBack}>
            <FiArrowLeft />
            <span>Back</span>
          </button>
          <a href="/" className="terms-logo">
            <span className="logo-brand">GOACRES</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="terms-hero">
        <div className="container">
          <div className="terms-hero-content">
            <FiFileText className="hero-icon" />
            <h1>Terms and Conditions</h1>
            <p>Please read these terms carefully before using our platform</p>
            <span className="last-updated">Last Updated: January 2026</span>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="terms-content">
        <div className="container">

          {/* 1. Agreement to Terms */}
          <div className="terms-section">
            <div className="section-number">1</div>
            <h2>
              <FiCheckCircle className="section-icon" />
              Agreement to Terms
            </h2>
            <p>
              By accessing this website, you agree to be bound by these Terms and Conditions, all applicable laws,
              and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
              this site. <strong>This is a legally binding agreement</strong> between you (User/Broker) and GOACRES.
            </p>
          </div>

          {/* 2. Intermediary Status */}
          <div className="terms-section highlight-section">
            <div className="section-number">2</div>
            <h2>
              <FiShield className="section-icon" />
              Intermediary Status (IT Act Section 79)
            </h2>
            <p>
              GOACRES is an <strong>"Intermediary"</strong> as defined under Section 2(1)(w) of the Information Technology Act, 2000.
              We are merely a platform that provides a medium for advertisement. We do not:
            </p>
            <ul className="terms-list">
              <li>Initiate the transmission of any property listing.</li>
              <li>Select the receiver of the transmission.</li>
              <li>Select or modify the information contained in the transmission.</li>
            </ul>
            <div className="important-note">
              <FiAlertTriangle />
              <p>Therefore, any liability for the content, photos, or data lies solely with the uploader (Broker/Seller).</p>
            </div>
          </div>

          {/* 3. No Warranty */}
          <div className="terms-section">
            <div className="section-number">3</div>
            <h2>
              <FiAlertCircle className="section-icon warning" />
              No Warranty of Accuracy (The "As-Is" Clause)
            </h2>
            <p>
              The materials on this website are provided on an <strong>'as is'</strong> basis. GOACRES makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
            </p>
            <div className="terms-card-grid">
              <div className="terms-mini-card">
                <FiMapPin />
                <span>Accuracy of property location, size, price, or legal status</span>
              </div>
              <div className="terms-mini-card">
                <FiFileText />
                <span>Ownership or title of the land/property</span>
              </div>
              <div className="terms-mini-card">
                <FiUserCheck />
                <span>Reliability of the Broker or Seller</span>
              </div>
              <div className="terms-mini-card">
                <FiShield />
                <span>Site being error-free or virus-free</span>
              </div>
            </div>
          </div>

          {/* 4. Mandatory Due Diligence */}
          <div className="terms-section due-diligence-section">
            <div className="section-number">4</div>
            <h2>
              <FiCheckCircle className="section-icon green" />
              Mandatory Due Diligence (For Buyers)
            </h2>
            <p>Users are <strong>strictly advised</strong> that:</p>

            <div className="guidelines-list">
              <div className="guideline-item">
                <span className="guideline-number">A</span>
                <div className="guideline-content">
                  <h4>Paper Verification</h4>
                  <p>You must verify the original 'Sale Deed', 'Patta', and 'Encumbrance Certificate (EC)' from the Sub-Registrar office.</p>
                </div>
              </div>

              <div className="guideline-item">
                <span className="guideline-number">B</span>
                <div className="guideline-content">
                  <h4>RERA Check</h4>
                  <p>You must cross-verify the RERA registration on the Odisha RERA (ORERA) portal.</p>
                </div>
              </div>

              <div className="guideline-item">
                <span className="guideline-number">C</span>
                <div className="guideline-content">
                  <h4>Physical Visit</h4>
                  <p>Do not make any payment without a physical visit to the land/property.</p>
                </div>
              </div>

              <div className="guideline-item">
                <span className="guideline-number">D</span>
                <div className="guideline-content">
                  <h4>Legal Counsel</h4>
                  <p>Hire a professional lawyer to check for litigation or bank loans on the property.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Financial Transactions */}
          <div className="terms-section highlight-section warning-highlight">
            <div className="section-number">5</div>
            <h2>
              <FiDollarSign className="section-icon warning" />
              Financial Transactions & Frauds
            </h2>
            <div className="warning-box">
              <h3>GOACRES is NOT a party to any transaction.</h3>
            </div>
            <ul className="terms-list">
              <li>We do not collect booking amounts, token money, or deposits.</li>
              <li>We are not responsible for any financial fraud, loss of money, or failed deals between the Buyer and the Broker.</li>
              <li><strong>Any payment made to a Broker is at the User's own risk.</strong></li>
            </ul>
          </div>

          {/* 6. Broker Responsibility */}
          <div className="terms-section">
            <div className="section-number">6</div>
            <h2>
              <FiUserCheck className="section-icon" />
              Broker Responsibility & Compliance
            </h2>
            <p>Any user listing a property (Broker/Owner) represents and warrants that:</p>
            <ul className="terms-list check-list">
              <li>They have the legal right to list and sell the property.</li>
              <li>The property is not under government dispute or litigation.</li>
              <li>They comply with the Real Estate (Regulation and Development) Act, 2016 (RERA).</li>
              <li>They will not post offensive, fake, or misleading content.</li>
            </ul>
          </div>

          {/* 7. Limitation of Liability */}
          <div className="terms-section highlight-section">
            <div className="section-number">7</div>
            <h2>
              <FiShield className="section-icon" />
              Limitation of Liability
            </h2>
            <p>
              In no event shall GOACRES or its owner be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on the portal, <strong>even if we have been notified of the possibility
              of such damage.</strong>
            </p>
          </div>

          {/* 8. Indemnification */}
          <div className="terms-section highlight-section warning-highlight">
            <div className="section-number">8</div>
            <h2>
              <FiAlertTriangle className="section-icon warning" />
              Indemnification
            </h2>
            <p>
              You agree to <strong>indemnify, defend, and hold harmless</strong> GOACRES and its owner from any and all
              third-party claims, liability, damages, and/or costs (including, but not limited to, legal fees) arising from:
            </p>
            <ul className="terms-list">
              <li>Your use of the site</li>
              <li>Your violation of these terms</li>
              <li>The infringement of any intellectual property or other right of any person or entity</li>
            </ul>
          </div>

          {/* 9. Report Abuse */}
          <div className="terms-section">
            <div className="section-number">9</div>
            <h2>
              <FiFlag className="section-icon" />
              Report Abuse & Takedown Policy
            </h2>
            <p>
              If you find any listing that is fraudulent or infringing on your rights, you must report it to{' '}
              <a href="mailto:goacres.in@gmail.com" className="email-link">goacres.in@gmail.com</a>
            </p>
            <div className="info-box">
              <p>
                Our only obligation is to review and remove the reported listing within a reasonable timeframe
                <strong> (48-72 hours)</strong> if found violating our policies.
              </p>
            </div>
          </div>

          {/* 10. Governing Law */}
          <div className="terms-section highlight-section">
            <div className="section-number">10</div>
            <h2>
              <FiMapPin className="section-icon" />
              Governing Law & Jurisdiction
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the <strong>laws of India</strong>.
            </p>
            <div className="jurisdiction-box">
              <p>
                Any legal dispute or claim arising from the use of this website shall be subject to the
                <strong> exclusive jurisdiction of the courts in Rourkela (Sundargarh), Odisha only.</strong>
              </p>
            </div>
          </div>

          {/* 11. Modification */}
          <div className="terms-section">
            <div className="section-number">11</div>
            <h2>
              <FiEdit3 className="section-icon" />
              Modification of Terms
            </h2>
            <p>
              GOACRES may revise these terms of service at any time without notice. By using this website,
              you are agreeing to be bound by the then-current version of these terms and conditions.
            </p>
          </div>

          {/* Smart Buyer Tip */}
          <div className="terms-section smart-buyer-section">
            <h2>
              <FiAlertCircle className="section-icon tip" />
              Smart Buyer Tip
            </h2>
            <div className="smart-tip-box">
              <ul>
                <li>Before purchasing land, verify the owner's name on the official Bhulekh portal.</li>
                <li>Request the original RERA Certificate and Encumbrance Certificate (EC) from the broker.</li>
                <li>Our portal is not responsible for any fraudulent transactions or disputes.</li>
              </ul>
            </div>
          </div>

          {/* Final Disclaimer */}
          <div className="terms-section disclaimer-section">
            <h2>
              <FiAlertTriangle className="section-icon warning" />
              Important Disclaimer
            </h2>
            <div className="disclaimer-box">
              <p>
                GOACRES is a digital platform for property listing. We are <strong>not a real estate agent</strong> or
                a <strong>legal advisor</strong>. While we encourage verified listings, we do not guarantee the authenticity
                of property documents or titles. Users are strongly advised to conduct their own due diligence before
                making any payments. GOACRES is not responsible for any fraud, misrepresentation, or disputes between
                buyers and sellers.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="terms-section contact-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> goacres.in@gmail.com</p>
              <p><strong>Phone:</strong> +91 91874 28518</p>
              <p><strong>Location:</strong> Rourkela, Odisha</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="terms-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} GOACRES. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
