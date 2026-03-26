import { Calculator, Map, Compass } from 'lucide-react';

export function Hero() {
  const scrollToConverter = () => {
    const element = document.getElementById('konverter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 - Top Right */}
        <div 
          className="gradient-blob blob-teal w-[600px] h-[600px] -top-40 -right-40 animate-float"
          style={{ animationDelay: '0s' }}
        />
        {/* Blob 2 - Bottom Left */}
        <div 
          className="gradient-blob blob-mint w-[500px] h-[500px] -bottom-32 -left-32 animate-float"
          style={{ animationDelay: '2s' }}
        />
        {/* Blob 3 - Center */}
        <div 
          className="gradient-blob blob-amber w-[400px] h-[400px] top-1/2 left-1/3 animate-float opacity-30"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container">
        <div className="section-inner text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-cream-200 shadow-soft mb-8">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-charcoal-600">
              Versi 3.0 - Redesain Total
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif font-semibold text-charcoal-900 mb-6 max-w-4xl mx-auto">
            Konversi Koordinat{' '}
            <span className="text-gradient-teal">UTM Profesional</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-charcoal-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Alat bantu lengkap untuk pengerjaan Peta UTM di QGIS dengan konversi koordinat, 
            deteksi zona otomatis, dan visualisasi peta interaktif.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={scrollToConverter}
              className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Calculator className="w-5 h-5" />
              Mulai Konversi
            </button>
            <a 
              href="#peta"
              className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Map className="w-5 h-5" />
              Lihat Peta
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-charcoal-900 mb-2">UTM ↔ DMS ↔ Desimal</h3>
              <p className="text-sm text-charcoal-500">Konversi multi-arah dengan akurasi tinggi</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-200">
              <div className="w-12 h-12 bg-mint-200 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-charcoal-900 mb-2">Peta Interaktif</h3>
              <p className="text-sm text-charcoal-500">Visualisasi lokasi dengan Leaflet.js</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-charcoal-900 mb-2">Hitung Jarak</h3>
              <p className="text-sm text-charcoal-500">Perhitungan jarak dan azimuth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
