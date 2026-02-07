import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Listings from './components/Listings'
import SiteVisit from './components/SiteVisit'
import RecentlySold from './components/RecentlySold'
import WhyChooseUs from './components/WhyChooseUs'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import ExitPopup from './components/ExitPopup'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Listings />
        <SiteVisit />
        <RecentlySold />
        <WhyChooseUs />
      </main>
      <Footer />
      <WhatsAppWidget />
      <ExitPopup />
      <BottomNav />
    </>
  )
}

export default App
