import { lazy, Suspense } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Header'
import Hero from './components/Hero'
import BottomNav from './components/BottomNav'
import LanguageSelector from './components/LanguageSelector'

const Features = lazy(() => import('./components/Features'))
const Listings = lazy(() => import('./components/Listings'))
const SiteVisit = lazy(() => import('./components/SiteVisit'))
const RecentlySold = lazy(() => import('./components/RecentlySold'))
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'))
const Footer = lazy(() => import('./components/Footer'))
const WhatsAppWidget = lazy(() => import('./components/WhatsAppWidget'))
const ExitPopup = lazy(() => import('./components/ExitPopup'))

const SectionLoader = () => (
  <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="section-spinner" />
  </div>
)

function App() {
  return (
    <LanguageProvider>
      <LanguageSelector />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Listings />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SiteVisit />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <RecentlySold />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <WhyChooseUs />
        </Suspense>
      </main>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppWidget />
      </Suspense>
      <Suspense fallback={null}>
        <ExitPopup />
      </Suspense>
      <BottomNav />
    </LanguageProvider>
  )
}

export default App
