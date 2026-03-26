import { useEffect, useRef, useState } from 'react';
import { Map, MapPin, Eraser, Satellite, Map as MapIcon } from 'lucide-react';
import * as L from 'leaflet';

export function MapSection() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapType, setMapType] = useState<'default' | 'satellite'>('default');

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize Leaflet map centered on Indonesia
      const map = L.map(mapContainerRef.current).setView([-2.5, 118], 5);

      // Add default tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      // Add click handler to place markers
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        addMarker(lat, lng);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Switch map type
  useEffect(() => {
    if (mapRef.current) {
      // Remove existing tile layers
      mapRef.current.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current?.removeLayer(layer);
        }
      });

      // Add new tile layer based on type
      if (mapType === 'satellite') {
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: '&copy; Esri',
            maxZoom: 19,
          }
        ).addTo(mapRef.current);
      } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);
      }
    }
  }, [mapType]);

  // Add marker to map
  const addMarker = (lat: number, lng: number) => {
    if (mapRef.current) {
      const marker = L.marker([lat, lng])
        .addTo(mapRef.current)
        .bindPopup(
          `<div style="font-family: monospace;">
            <strong>Lokasi</strong><br/>
            Lat: ${lat.toFixed(6)}<br/>
            Lng: ${lng.toFixed(6)}
          </div>`
        );
      markersRef.current.push(marker);
      marker.openPopup();
    }
  };

  // Clear all markers
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      if (mapRef.current) {
        mapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  };

  // Get user location
  const locateUser = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.setView([latitude, longitude], 13);
          addMarker(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
        }
      );
    }
  };

  return (
    <section id="peta" className="py-20">
      <div className="section-container">
        <div className="section-inner">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-mint-200 rounded-xl flex items-center justify-center text-teal-600">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-semibold text-charcoal-900">Peta Interaktif</h2>
                <p className="text-sm text-charcoal-500">Klik pada peta untuk menandai lokasi</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Map Type Toggle */}
              <div className="flex items-center bg-white rounded-xl p-1 border border-cream-200 shadow-soft">
                <button
                  onClick={() => setMapType('default')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    mapType === 'default'
                      ? 'bg-teal-500 text-white'
                      : 'text-charcoal-600 hover:bg-cream-100'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Default</span>
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    mapType === 'satellite'
                      ? 'bg-teal-500 text-white'
                      : 'text-charcoal-600 hover:bg-cream-100'
                  }`}
                >
                  <Satellite className="w-4 h-4" />
                  <span className="hidden sm:inline">Satelit</span>
                </button>
              </div>

              <button
                onClick={locateUser}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors shadow-soft"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Lokasi Saya</span>
              </button>

              <button
                onClick={clearMarkers}
                className="flex items-center gap-2 px-4 py-2 bg-white text-charcoal-600 border border-cream-200 rounded-xl font-medium hover:bg-cream-100 transition-colors shadow-soft"
              >
                <Eraser className="w-4 h-4" />
                <span className="hidden sm:inline">Bersihkan</span>
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="card-elevated overflow-hidden">
            <div
              ref={mapContainerRef}
              className="w-full h-[500px] md:h-[600px]"
              style={{ zIndex: 1 }}
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-cream-100 rounded-xl border border-cream-200">
            <p className="text-sm text-charcoal-600">
              <strong className="text-charcoal-900">Petunjuk:</strong> Klik di mana saja pada peta untuk menambahkan penanda. 
              Gunakan tombol "Lokasi Saya" untuk menemukan posisi Anda saat ini. 
              Pilih mode "Satelit" untuk melihat citra satelit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
