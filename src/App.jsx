import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import { BrokerAuthProvider } from './contexts/BrokerAuthContext'

// Below-fold: lazy loaded for faster initial paint
const Features = lazy(() => import('./components/Features'))
const PriceIndex = lazy(() => import('./components/PriceIndex'))
const Listings = lazy(() => import('./components/Listings'))
const EMICalculator = lazy(() => import('./components/EMICalculator'))
const AreaGuide = lazy(() => import('./components/AreaGuide'))
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'))
const Footer = lazy(() => import('./components/Footer'))
const WhatsAppWidget = lazy(() => import('./components/WhatsAppWidget'))

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
        <Suspense fallback={null}>
          <Features />
          <PriceIndex />
          <Listings />
          <EMICalculator />
          <AreaGuide />
          <WhyChooseUs />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <WhatsAppWidget />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <Router>
      <BrokerAuthProvider>
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
      </BrokerAuthProvider>
    </Router>
  )
}

export default App
