import { useState, useEffect } from 'react';
import { FiHome, FiPercent, FiCalendar, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './EMICalculator.css';

const EMICalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState(50); // in Lakhs
  const [downPayment, setDownPayment] = useState(20); // percentage
  const [interestRate, setInterestRate] = useState(8.5); // percentage
  const [loanTenure, setLoanTenure] = useState(15); // years

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: calcRef, isVisible: calcVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    calculateEMI();
  }, [propertyPrice, downPayment, interestRate, loanTenure]);

  const calculateEMI = () => {
    const principal = propertyPrice * 100000 * (1 - downPayment / 100);
    setLoanAmount(principal);

    const monthlyRate = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;

    if (monthlyRate === 0) {
      const monthlyEmi = principal / numberOfMonths;
      setEmi(monthlyEmi);
      setTotalInterest(0);
      setTotalPayable(principal);
    } else {
      const monthlyEmi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
        (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

      const totalAmount = monthlyEmi * numberOfMonths;
      const interestPayable = totalAmount - principal;

      setEmi(monthlyEmi);
      setTotalInterest(interestPayable);
      setTotalPayable(totalAmount);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} Lac`;
    } else {
      return `${Math.round(amount).toLocaleString('en-IN')}`;
    }
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="emi-calculator section" id="emi-calculator">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-title section-title-animated ${titleVisible ? 'is-visible' : ''}`}
        >
          <h2>EMI & Loan Calculator</h2>
          <p>Plan your dream property investment with our easy EMI calculator</p>
        </div>

        <div
          ref={calcRef}
          className={`calculator-wrapper animate-fade-up ${calcVisible ? 'is-visible' : ''}`}
        >
          <div className="calculator-inputs">
            {/* Property Price */}
            <div className="input-group">
              <div className="input-header">
                <label>
                  <FiHome className="input-icon" />
                  Property Price
                </label>
                <span className="input-value">₹ {propertyPrice} Lac</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>₹10 Lac</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="input-group">
              <div className="input-header">
                <label>
                  <FiPercent className="input-icon" />
                  Down Payment
                </label>
                <span className="input-value">{downPayment}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="input-group">
              <div className="input-header">
                <label>
                  <FiPercent className="input-icon" />
                  Interest Rate
                </label>
                <span className="input-value">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="6"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="input-group">
              <div className="input-header">
                <label>
                  <FiCalendar className="input-icon" />
                  Loan Tenure
                </label>
                <span className="input-value">{loanTenure} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          <div className="calculator-results">
            <div className="result-card main-result">
              <span className="result-label">Monthly EMI</span>
              <span className="result-value emi-value">
                ₹ {Math.round(emi).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="result-breakdown">
              <div className="result-card">
                <span className="result-label">Loan Amount</span>
                <span className="result-value">₹ {formatCurrency(loanAmount)}</span>
              </div>

              <div className="result-card">
                <span className="result-label">Total Interest</span>
                <span className="result-value interest">₹ {formatCurrency(totalInterest)}</span>
              </div>

              <div className="result-card">
                <span className="result-label">Total Payable</span>
                <span className="result-value">₹ {formatCurrency(totalPayable)}</span>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="emi-visual">
              <div className="visual-bar">
                <div
                  className="principal-bar"
                  style={{ width: `${(loanAmount / totalPayable) * 100}%` }}
                >
                  <span>Principal</span>
                </div>
                <div
                  className="interest-bar"
                  style={{ width: `${(totalInterest / totalPayable) * 100}%` }}
                >
                  <span>Interest</span>
                </div>
              </div>
              <div className="visual-legend">
                <span><i className="legend-dot principal"></i> Principal ({Math.round((loanAmount / totalPayable) * 100)}%)</span>
                <span><i className="legend-dot interest"></i> Interest ({Math.round((totalInterest / totalPayable) * 100)}%)</span>
              </div>
            </div>

            <button className="btn btn-primary eligibility-btn" onClick={scrollToContact}>
              Check Eligibility
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EMICalculator;
