import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Header'
import Hero from './components/Hero'
import BottomNav from './components/BottomNav'
import LanguageSelector from './components/LanguageSelector'
import SEO from './components/SEO'
import { prefetchPlots } from './utils/plotsCache'

const API_URL = import.meta.env.VITE_API_URL || ''

const Features = lazy(() => import('./components/Features'))
const Listings = lazy(() => import('./components/Listings'))
const SiteVisit = lazy(() => import('./components/SiteVisit'))
const PropertyGuide = lazy(() => import('./components/PropertyGuide'))
const RecentlySold = lazy(() => import('./components/RecentlySold'))
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'))
const ListProperty = lazy(() => import('./components/ListProperty'))
const FounderSection = lazy(() => import('./components/FounderSection'))
const Footer = lazy(() => import('./components/Footer'))
const WhatsAppWidget = lazy(() => import('./components/WhatsAppWidget'))
const PlotDetail = lazy(() => import('./components/PlotDetail'))
const AllPlots = lazy(() => import('./components/AllPlots'))
const ComingSoon = lazy(() => import('./components/ComingSoon'))

/* ─── Skeleton Fallbacks (available before lazy chunks load) ─── */

const PlotDetailSkeleton = () => (
  <div className="pds-page">
    <div className="container">
      <div className="pds-bar">
        <div className="sk" style={{ width: 100, height: 40 }} />
        <div className="sk" style={{ width: 90, height: 40 }} />
      </div>
      <div className="pds-hero">
        <div>
          <div className="sk" style={{ width: '100%', aspectRatio: '16/10', borderRadius: 16 }} />
          <div className="pds-thumbs">
            {[1,2,3,4].map(i => <div key={i} className="sk" style={{ flex: 1, aspectRatio: '16/10', borderRadius: 10 }} />)}
          </div>
        </div>
        <div className="pds-info">
          <div className="sk" style={{ width: 100, height: 30, borderRadius: 20 }} />
          <div className="sk" style={{ width: '80%', height: 28 }} />
          <div className="sk" style={{ width: '50%', height: 28 }} />
          <div className="sk" style={{ width: '60%', height: 18 }} />
          <div className="sk" style={{ width: '55%', height: 28 }} />
          <div className="pds-stats">
            {[1,2,3,4].map(i => <div key={i} className="sk" style={{ height: 60, borderRadius: 12 }} />)}
          </div>
          <div className="pds-cta">
            <div className="sk" style={{ flex: 1, height: 48, borderRadius: 12 }} />
            <div className="sk" style={{ width: 120, height: 48, borderRadius: 12 }} />
          </div>
        </div>
      </div>
      <div className="sk" style={{ width: 180, height: 24, marginTop: 48, marginBottom: 20 }} />
      <div className="pds-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="sk" style={{ height: 70, borderRadius: 14 }} />)}
      </div>
    </div>
  </div>
)

const AllPlotsSkeleton = () => (
  <div className="aps-page">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="sk" style={{ width: 200, height: 14, margin: '0 auto 12px' }} />
        <div className="sk" style={{ width: 300, height: 32, margin: '0 auto 8px' }} />
        <div className="sk" style={{ width: 240, height: 16, margin: '0 auto' }} />
      </div>
      <div className="sk" style={{ width: '100%', height: 52, borderRadius: 14, marginBottom: 16 }} />
      <div className="aps-chips">
        {[1,2,3,4].map(i => <div key={i} className="sk" style={{ width: 90, height: 36, borderRadius: 20 }} />)}
      </div>
      <div className="aps-grid">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="aps-card">
            <div className="sk" style={{ width: '100%', height: 200, borderRadius: 0 }} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="sk" style={{ width: '70%', height: 18 }} />
              <div className="sk" style={{ width: '50%', height: 14 }} />
              <div className="sk" style={{ width: '60%', height: 20 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ListingsSkeleton = () => (
  <div className="ls-page">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="sk-dark" style={{ width: 160, height: 36, borderRadius: 50, margin: '0 auto 20px' }} />
        <div className="sk-dark" style={{ width: 340, height: 36, margin: '0 auto 8px' }} />
        <div className="sk-dark" style={{ width: 280, height: 36, margin: '0 auto 20px' }} />
        <div className="sk-dark" style={{ width: 400, height: 18, margin: '0 auto' }} />
      </div>
      <div className="ls-grid">
        {[1,2,3].map(i => (
          <div key={i} className="ls-card">
            <div className="sk-dark" style={{ width: '100%', height: 240, borderRadius: 0 }} />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="sk-dark" style={{ width: '60%', height: 22 }} />
              <div className="sk-dark" style={{ width: '90%', height: 16 }} />
              <div className="sk-dark" style={{ width: '100%', height: 1, marginTop: 8 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="sk-dark" style={{ width: '40%', height: 16 }} />
                <div className="sk-dark" style={{ width: '30%', height: 16 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const SectionSkeleton = () => (
  <div className="section-sk">
    <div className="container" style={{ textAlign: 'center' }}>
      <div className="sk" style={{ width: 200, height: 14, margin: '0 auto 16px' }} />
      <div className="sk" style={{ width: 300, height: 28, margin: '0 auto 12px' }} />
      <div className="sk" style={{ width: 400, height: 16, margin: '0 auto' }} />
    </div>
  </div>
)

const COMING_SOON_DEFAULT = {
  comingSoon: true,
  launchDate: '2026-03-22',
  launchMessage: '100+ Premium Plots Are Coming to Rourkela!',
};

const HomePage = () => {
  const [comingSoon, setComingSoon] = useState(COMING_SOON_DEFAULT);

  useEffect(() => {
    prefetchPlots();
    if (API_URL) {
      fetch(`${API_URL}/api/settings`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setComingSoon(data); })
        .catch(() => {});
    }
  }, []);

  return (
  <>
    <SEO
      path="/"
      description="GOACRES - Rourkela ka sabse trusted land listing platform. Premium residential, commercial aur farm house plots browse karo. Real Estate Advisor se connect karo. WhatsApp karo abhi!"
    />
    <main>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <Features />
      </Suspense>

      {comingSoon?.comingSoon ? (
        <Suspense fallback={<SectionSkeleton />}>
          <ComingSoon launchDate={comingSoon.launchDate} message={comingSoon.launchMessage} />
        </Suspense>
      ) : (
        <Suspense fallback={<ListingsSkeleton />}>
          <Listings />
        </Suspense>
      )}

      <Suspense fallback={<SectionSkeleton />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <SiteVisit />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <PropertyGuide />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <RecentlySold />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ListProperty />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FounderSection />
      </Suspense>
    </main>
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <LanguageSelector />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plots" element={
            <Suspense fallback={<AllPlotsSkeleton />}>
              <AllPlots />
            </Suspense>
          } />
          <Route path="/plot/:slug" element={
            <Suspense fallback={<PlotDetailSkeleton />}>
              <PlotDetail />
            </Suspense>
          } />
        </Routes>
        <Suspense fallback={null}>
          <WhatsAppWidget />
        </Suspense>
        <BottomNav />
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
