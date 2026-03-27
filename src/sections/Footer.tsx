import { MapPin, Github, Phone, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-cream-200 py-12">
      <div className="section-container">
        <div className="section-inner">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            {/* Logo & Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-soft">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-semibold text-charcoal-900">1-Peta</p>
                <p className="text-xs text-charcoal-500">Diklat SIG DJP Angkatan III 2026</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/penilaikanwilsumut1/peta-utm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal-400 hover:text-charcoal-900 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <div className="text-sm text-charcoal-500 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Saran & Kendala: 0822-9411-6001 (Dedek)</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-cream-200 pt-8">
            <p className="text-center text-sm text-charcoal-500">
              &copy; {2026}. Dibuat dengan{' '}
              <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> untuk Kamu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
