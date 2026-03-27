import { useState, useEffect } from 'react';
import { MapPin, Menu, X } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="section-inner">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-soft group-hover:shadow-card transition-shadow">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-lg text-charcoal-900 leading-tight">
                  1-Peta
                </span>
                <span className="text-xs text-charcoal-500 hidden sm:block">
                  Alat Bantu Pemetaan
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('konverter')}
                className="text-sm font-medium text-charcoal-600 hover:text-teal-600 transition-colors"
              >
                Konverter
              </button>
              <button
                onClick={() => scrollToSection('peta')}
                className="text-sm font-medium text-charcoal-600 hover:text-teal-600 transition-colors"
              >
                Peta
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-cream-100 text-charcoal-600 hover:bg-cream-200 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-cream-200 shadow-card">
          <div className="section-container py-4">
            <div className="section-inner flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('konverter')}
                className="w-full px-4 py-3 text-left text-sm font-medium text-charcoal-600 hover:bg-cream-100 rounded-xl transition-colors"
              >
                Konverter
              </button>
              <button
                onClick={() => scrollToSection('peta')}
                className="w-full px-4 py-3 text-left text-sm font-medium text-charcoal-600 hover:bg-cream-100 rounded-xl transition-colors"
              >
                Peta
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
