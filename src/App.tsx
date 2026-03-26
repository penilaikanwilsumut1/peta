import { Navigation } from '@/sections/Navigation';
import { Hero } from '@/sections/Hero';
import { Converter } from '@/sections/Converter';
import { MapSection } from '@/sections/MapSection';
import { Footer } from '@/sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navigation />
      <main>
        <Hero />
        <Converter />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
