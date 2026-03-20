import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import PriceIndex from './components/PriceIndex'
import Listings from './components/Listings'
import EMICalculator from './components/EMICalculator'
import AreaGuide from './components/AreaGuide'
import WhyChooseUs from './components/WhyChooseUs'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'

// Route-level lazy loading
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'))
const Admin = lazy(() => import('./admin/Admin'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const AllPlots = lazy(() => import('./components/AllPlots'))
const PlotDetail = lazy(() => import('./components/PlotDetail'))
const BrokerLogin = lazy(() => import('./broker/BrokerLogin'))
const BrokerSubmit = lazy(() => import('./broker/BrokerSubmit'))
const BrokerSubmissions = lazy(() => import('./broker/BrokerSubmissions'))


// Home Page Component
const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <PriceIndex />
        <Listings />
        <EMICalculator />
        <AreaGuide />
        <WhyChooseUs />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  )
}

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plots" element={<AllPlots />} />
          <Route path="/plot/:slug" element={<PlotDetail />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/broker/login" element={<BrokerLogin />} />
          <Route path="/broker/submit" element={<BrokerSubmit />} />
          <Route path="/broker/submissions" element={<BrokerSubmissions />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
