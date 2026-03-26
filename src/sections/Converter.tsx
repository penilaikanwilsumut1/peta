import { useState, useEffect } from 'react';
import { Calculator, Copy, Check, RotateCcw, Ruler } from 'lucide-react';
import type { ConverterTab, DMSCoordinate } from '@/types';
import {
  utmToDMS,
  utmToDecimal,
  decimalToUTM,
  decimalToDMS,
  dmsToUTM,
  dmsToDecimal,
  calculateDistanceUTM,
  calculateDistanceHaversine,
  formatDMS,
  provinceZones,
  detectZoneFromProvince,
} from '@/lib/converters';

export function Converter() {
  const [activeTab, setActiveTab] = useState<ConverterTab>('utm');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // UTM Tab State
  const [utmY, setUtmY] = useState('');
  const [utmX, setUtmX] = useState('');
  const [utmZone, setUtmZone] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [utmResult, setUtmResult] = useState<{
    lat: string;
    lng: string;
    dmsLat: string;
    dmsLng: string;
  } | null>(null);

  // DMS Tab State
  const [dmsLat, setDmsLat] = useState<DMSCoordinate>({
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: 'S',
  });
  const [dmsLng, setDmsLng] = useState<DMSCoordinate>({
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: 'E',
  });
  const [dmsResult, setDmsResult] = useState<{
    x: string;
    y: string;
    zone: string;
    decLat: string;
    decLng: string;
  } | null>(null);

  // Decimal Tab State
  const [decLat, setDecLat] = useState('');
  const [decLng, setDecLng] = useState('');
  const [decResult, setDecResult] = useState<{
    x: string;
    y: string;
    zone: string;
    dmsLat: string;
    dmsLng: string;
  } | null>(null);

  // Distance UTM State
  const [distUtmY1, setDistUtmY1] = useState('');
  const [distUtmX1, setDistUtmX1] = useState('');
  const [distUtmY2, setDistUtmY2] = useState('');
  const [distUtmX2, setDistUtmX2] = useState('');
  const [distUtmZone, setDistUtmZone] = useState('');
  const [distUtmResult, setDistUtmResult] = useState<{
    km: string;
    m: string;
    azimuth: string;
  } | null>(null);

  // Distance DMS State
  const [distDmsLat1, setDistDmsLat1] = useState<DMSCoordinate>({
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: 'S',
  });
  const [distDmsLng1, setDistDmsLng1] = useState<DMSCoordinate>({
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: 'E',
  });
  const [distDmsLat2, setDistDmsLat2] = useState<DMSCoordinate>({
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: 'S',
  });
  const [distDmsLng2, setDistDmsLng2] = useState<DMSCoordinate>({
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: 'E',
  });
  const [distDmsResult, setDistDmsResult] = useState<{
    km: string;
    m: string;
    azimuth: string;
  } | null>(null);

  // Distance Decimal State
  const [distDecLat1, setDistDecLat1] = useState('');
  const [distDecLng1, setDistDecLng1] = useState('');
  const [distDecLat2, setDistDecLat2] = useState('');
  const [distDecLng2, setDistDecLng2] = useState('');
  const [distDecResult, setDistDecResult] = useState<{
    km: string;
    m: string;
    azimuth: string;
  } | null>(null);

  // Copy to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // UTM Conversion
  useEffect(() => {
    if (utmY && utmX && utmZone) {
      try {
        const y = parseFloat(utmY);
        const x = parseFloat(utmX);
        if (!isNaN(y) && !isNaN(x)) {
          const dms = utmToDMS(x, y, utmZone);
          const decimal = utmToDecimal(x, y, utmZone);
          setUtmResult({
            lat: decimal.latitude.toFixed(6),
            lng: decimal.longitude.toFixed(6),
            dmsLat: dms.latString,
            dmsLng: dms.lngString,
          });
        }
      } catch {
        setUtmResult(null);
      }
    } else {
      setUtmResult(null);
    }
  }, [utmY, utmX, utmZone]);

  // Auto-detect zone from province
  useEffect(() => {
    if (selectedProvince && utmY && utmX) {
      try {
        const y = parseFloat(utmY);
        const x = parseFloat(utmX);
        if (!isNaN(y) && !isNaN(x)) {
          // First get approximate lat/lng to detect zone
          const tempDecimal = utmToDecimal(x, y, '48S'); // Use default zone temporarily
          const detectedZone = detectZoneFromProvince(selectedProvince, tempDecimal.latitude, tempDecimal.longitude);
          if (detectedZone) {
            setUtmZone(detectedZone);
          }
        }
      } catch {
        // Ignore errors
      }
    }
  }, [selectedProvince, utmY, utmX]);

  // DMS Conversion
  const convertDMStoUTM = () => {
    try {
      const result = dmsToUTM(dmsLat, dmsLng);
      const decLat = dmsToDecimal(dmsLat);
      const decLng = dmsToDecimal(dmsLng);
      setDmsResult({
        x: result.x.toFixed(2),
        y: result.y.toFixed(2),
        zone: result.zone,
        decLat: decLat.toFixed(6),
        decLng: decLng.toFixed(6),
      });
    } catch {
      setDmsResult(null);
    }
  };

  // Decimal Conversion
  const convertDecimalToUTM = () => {
    try {
      const lat = parseFloat(decLat);
      const lng = parseFloat(decLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        const result = decimalToUTM(lat, lng);
        const dmsLatResult = decimalToDMS(lat, true);
        const dmsLngResult = decimalToDMS(lng, false);
        setDecResult({
          x: result.x.toFixed(2),
          y: result.y.toFixed(2),
          zone: result.zone,
          dmsLat: formatDMS(dmsLatResult),
          dmsLng: formatDMS(dmsLngResult),
        });
      }
    } catch {
      setDecResult(null);
    }
  };

  // Distance UTM Calculation
  const calculateDistanceUTMHandler = () => {
    try {
      const y1 = parseFloat(distUtmY1);
      const x1 = parseFloat(distUtmX1);
      const y2 = parseFloat(distUtmY2);
      const x2 = parseFloat(distUtmX2);
      if (!isNaN(y1) && !isNaN(x1) && !isNaN(y2) && !isNaN(x2) && distUtmZone) {
        const result = calculateDistanceUTM(x1, y1, x2, y2, distUtmZone);
        setDistUtmResult({
          km: result.kilometers.toFixed(3),
          m: result.meters.toFixed(2),
          azimuth: result.azimuth.toFixed(2),
        });
      }
    } catch {
      setDistUtmResult(null);
    }
  };

  // Distance DMS Calculation
  const calculateDistanceDMSHandler = () => {
    try {
      const lat1 = dmsToDecimal(distDmsLat1);
      const lng1 = dmsToDecimal(distDmsLng1);
      const lat2 = dmsToDecimal(distDmsLat2);
      const lng2 = dmsToDecimal(distDmsLng2);
      const result = calculateDistanceHaversine(lat1, lng1, lat2, lng2);
      setDistDmsResult({
        km: result.kilometers.toFixed(3),
        m: result.meters.toFixed(2),
        azimuth: result.azimuth.toFixed(2),
      });
    } catch {
      setDistDmsResult(null);
    }
  };

  // Distance Decimal Calculation
  const calculateDistanceDecimalHandler = () => {
    try {
      const lat1 = parseFloat(distDecLat1);
      const lng1 = parseFloat(distDecLng1);
      const lat2 = parseFloat(distDecLat2);
      const lng2 = parseFloat(distDecLng2);
      if (!isNaN(lat1) && !isNaN(lng1) && !isNaN(lat2) && !isNaN(lng2)) {
        const result = calculateDistanceHaversine(lat1, lng1, lat2, lng2);
        setDistDecResult({
          km: result.kilometers.toFixed(3),
          m: result.meters.toFixed(2),
          azimuth: result.azimuth.toFixed(2),
        });
      }
    } catch {
      setDistDecResult(null);
    }
  };

  // Clear all inputs
  const clearAll = () => {
    setUtmY('');
    setUtmX('');
    setUtmZone('');
    setSelectedProvince('');
    setUtmResult(null);
    setDmsLat({ degrees: 0, minutes: 0, seconds: 0, direction: 'S' });
    setDmsLng({ degrees: 0, minutes: 0, seconds: 0, direction: 'E' });
    setDmsResult(null);
    setDecLat('');
    setDecLng('');
    setDecResult(null);
    setDistUtmY1('');
    setDistUtmX1('');
    setDistUtmY2('');
    setDistUtmX2('');
    setDistUtmZone('');
    setDistUtmResult(null);
    setDistDmsLat1({ degrees: 0, minutes: 0, seconds: 0, direction: 'S' });
    setDistDmsLng1({ degrees: 0, minutes: 0, seconds: 0, direction: 'E' });
    setDistDmsLat2({ degrees: 0, minutes: 0, seconds: 0, direction: 'S' });
    setDistDmsLng2({ degrees: 0, minutes: 0, seconds: 0, direction: 'E' });
    setDistDmsResult(null);
    setDistDecLat1('');
    setDistDecLng1('');
    setDistDecLat2('');
    setDistDecLng2('');
    setDistDecResult(null);
  };

  const tabs = [
    { id: 'utm', label: 'UTM ke DMS & Desimal', icon: Calculator },
    { id: 'dms', label: 'DMS ke UTM & Desimal', icon: Calculator },
    { id: 'decimal', label: 'Desimal ke DMS & UTM', icon: Calculator },
    { id: 'distance-utm', label: 'Jarak (UTM)', icon: Ruler },
    { id: 'distance-dms', label: 'Jarak (DMS)', icon: Ruler },
    { id: 'distance-decimal', label: 'Jarak (Desimal)', icon: Ruler },
  ] as const;

  return (
    <section id="konverter" className="py-20">
      <div className="section-container">
        <div className="section-inner">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-semibold text-charcoal-900">Konverter Koordinat</h2>
                <p className="text-sm text-charcoal-500">Konversi antar format koordinat dengan mudah</p>
              </div>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-charcoal-500 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Converter Card */}
          <div className="card-elevated overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-cream-200 overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={activeTab === tab.id ? 'tab-pastel-active' : 'tab-pastel'}
                  >
                    <tab.icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* UTM Tab */}
              {activeTab === 'utm' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Input Koordinat</h3>
                    
                    {/* Sumbu Y */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <input
                        type="number"
                        value={utmY}
                        onChange={(e) => setUtmY(e.target.value)}
                        placeholder="Contoh: 150000"
                        className="input-pastel"
                      />
                    </div>

                    {/* Sumbu X */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <input
                        type="number"
                        value={utmX}
                        onChange={(e) => setUtmX(e.target.value)}
                        placeholder="Contoh: 510000"
                        className="input-pastel"
                      />
                    </div>

                    {/* Provinsi */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Provinsi
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="input-pastel appearance-none cursor-pointer"
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {Object.keys(provinceZones).map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Zona UTM */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Zona UTM (Deteksi Otomatis)
                      </label>
                      <select
                        value={utmZone}
                        onChange={(e) => setUtmZone(e.target.value)}
                        className="input-pastel appearance-none cursor-pointer"
                      >
                        <option value="">-- Pilih Zona UTM --</option>
                        {Array.from({ length: 9 }, (_, i) => i + 46).flatMap((zone) =>
                          ['N', 'S'].map((hemi) => (
                            <option key={`${zone}${hemi}`} value={`${zone}${hemi}`}>
                              {zone}{hemi}
                            </option>
                          ))
                        )}
                      </select>
                      <p className="text-xs text-charcoal-500 mt-2">
                        Zona akan terdeteksi otomatis jika Sumbu X, Sumbu Y, dan Provinsi telah valid
                      </p>
                    </div>
                  </div>

                  {/* Output */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Hasil Konversi</h3>
                    
                    {/* Latitude */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="result-display">
                        <span className="result-value">{utmResult?.lat || '-'}</span>
                        {utmResult?.lat && (
                          <button
                            onClick={() => copyToClipboard(utmResult.lat, 'utm-lat')}
                            className="result-copy"
                          >
                            {copiedId === 'utm-lat' ? (
                              <Check className="w-4 h-4 text-teal-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Longitude */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="result-display">
                        <span className="result-value">{utmResult?.lng || '-'}</span>
                        {utmResult?.lng && (
                          <button
                            onClick={() => copyToClipboard(utmResult.lng, 'utm-lng')}
                            className="result-copy"
                          >
                            {copiedId === 'utm-lng' ? (
                              <Check className="w-4 h-4 text-teal-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* DMS Latitude */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="result-display bg-mint-50 border-mint-200">
                        <span className="result-value text-teal-700">{utmResult?.dmsLat || '-'}</span>
                        {utmResult?.dmsLat && (
                          <button
                            onClick={() => copyToClipboard(utmResult.dmsLat, 'utm-dmslat')}
                            className="result-copy border-mint-200 hover:bg-mint-100"
                          >
                            {copiedId === 'utm-dmslat' ? (
                              <Check className="w-4 h-4 text-teal-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* DMS Longitude */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="result-display bg-mint-50 border-mint-200">
                        <span className="result-value text-teal-700">{utmResult?.dmsLng || '-'}</span>
                        {utmResult?.dmsLng && (
                          <button
                            onClick={() => copyToClipboard(utmResult.dmsLng, 'utm-dmslng')}
                            className="result-copy border-mint-200 hover:bg-mint-100"
                          >
                            {copiedId === 'utm-dmslng' ? (
                              <Check className="w-4 h-4 text-teal-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DMS Tab */}
              {activeTab === 'dms' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Input DMS (Derajat, Menit, Detik)</h3>
                    
                    {/* Latitude DMS */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          value={dmsLat.degrees || ''}
                          onChange={(e) => setDmsLat({ ...dmsLat, degrees: parseInt(e.target.value) || 0 })}
                          placeholder="Derajat"
                          min="0"
                          max="90"
                          className="input-pastel text-center"
                        />
                        <input
                          type="number"
                          value={dmsLat.minutes || ''}
                          onChange={(e) => setDmsLat({ ...dmsLat, minutes: parseInt(e.target.value) || 0 })}
                          placeholder="Menit"
                          min="0"
                          max="59"
                          className="input-pastel text-center"
                        />
                        <input
                          type="number"
                          value={dmsLat.seconds || ''}
                          onChange={(e) => setDmsLat({ ...dmsLat, seconds: parseFloat(e.target.value) || 0 })}
                          placeholder="Detik"
                          step="0.01"
                          min="0"
                          max="59.99"
                          className="input-pastel text-center"
                        />
                        <select
                          value={dmsLat.direction}
                          onChange={(e) => setDmsLat({ ...dmsLat, direction: e.target.value as 'N' | 'S' })}
                          className="input-pastel text-center"
                        >
                          <option value="N">N (Utara)</option>
                          <option value="S">S (Selatan)</option>
                        </select>
                      </div>
                    </div>

                    {/* Longitude DMS */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          value={dmsLng.degrees || ''}
                          onChange={(e) => setDmsLng({ ...dmsLng, degrees: parseInt(e.target.value) || 0 })}
                          placeholder="Derajat"
                          min="0"
                          max="180"
                          className="input-pastel text-center"
                        />
                        <input
                          type="number"
                          value={dmsLng.minutes || ''}
                          onChange={(e) => setDmsLng({ ...dmsLng, minutes: parseInt(e.target.value) || 0 })}
                          placeholder="Menit"
                          min="0"
                          max="59"
                          className="input-pastel text-center"
                        />
                        <input
                          type="number"
                          value={dmsLng.seconds || ''}
                          onChange={(e) => setDmsLng({ ...dmsLng, seconds: parseFloat(e.target.value) || 0 })}
                          placeholder="Detik"
                          step="0.01"
                          min="0"
                          max="59.99"
                          className="input-pastel text-center"
                        />
                        <select
                          value={dmsLng.direction}
                          onChange={(e) => setDmsLng({ ...dmsLng, direction: e.target.value as 'E' | 'W' })}
                          className="input-pastel text-center"
                        >
                          <option value="E">E (Timur)</option>
                          <option value="W">W (Barat)</option>
                        </select>
                      </div>
                    </div>

                    <button onClick={convertDMStoUTM} className="btn-primary w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Konversi ke UTM
                    </button>
                  </div>

                  {/* Output */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Hasil UTM</h3>
                    
                    {/* Y */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="result-display">
                        <span className="result-value">{dmsResult?.y || '-'}</span>
                        {dmsResult?.y && (
                          <button
                            onClick={() => copyToClipboard(dmsResult.y, 'dms-y')}
                            className="result-copy"
                          >
                            {copiedId === 'dms-y' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* X */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="result-display">
                        <span className="result-value">{dmsResult?.x || '-'}</span>
                        {dmsResult?.x && (
                          <button
                            onClick={() => copyToClipboard(dmsResult.x, 'dms-x')}
                            className="result-copy"
                          >
                            {copiedId === 'dms-x' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Zone */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Zona UTM</label>
                      <div className="result-display">
                        <span className="result-value">{dmsResult?.zone || '-'}</span>
                        {dmsResult?.zone && (
                          <button
                            onClick={() => copyToClipboard(dmsResult.zone, 'dms-zone')}
                            className="result-copy"
                          >
                            {copiedId === 'dms-zone' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif font-semibold text-charcoal-900 pt-4">Hasil Desimal</h3>
                    
                    {/* Decimal Lat */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="result-display">
                        <span className="result-value">{dmsResult?.decLat || '-'}</span>
                        {dmsResult?.decLat && (
                          <button
                            onClick={() => copyToClipboard(dmsResult.decLat, 'dms-declat')}
                            className="result-copy"
                          >
                            {copiedId === 'dms-declat' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Decimal Lng */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="result-display">
                        <span className="result-value">{dmsResult?.decLng || '-'}</span>
                        {dmsResult?.decLng && (
                          <button
                            onClick={() => copyToClipboard(dmsResult.decLng, 'dms-declng')}
                            className="result-copy"
                          >
                            {copiedId === 'dms-declng' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Decimal Tab */}
              {activeTab === 'decimal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Input Koordinat Desimal</h3>
                    
                    {/* Latitude */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <input
                        type="number"
                        value={decLat}
                        onChange={(e) => setDecLat(e.target.value)}
                        placeholder="Contoh: -6.2088"
                        step="any"
                        className="input-pastel"
                      />
                    </div>

                    {/* Longitude */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <input
                        type="number"
                        value={decLng}
                        onChange={(e) => setDecLng(e.target.value)}
                        placeholder="Contoh: 106.8456"
                        step="any"
                        className="input-pastel"
                      />
                    </div>

                    <button onClick={convertDecimalToUTM} className="btn-primary w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Konversi ke UTM
                    </button>
                  </div>

                  {/* Output */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Hasil UTM</h3>
                    
                    {/* Y */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="result-display">
                        <span className="result-value">{decResult?.y || '-'}</span>
                        {decResult?.y && (
                          <button
                            onClick={() => copyToClipboard(decResult.y, 'dec-y')}
                            className="result-copy"
                          >
                            {copiedId === 'dec-y' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* X */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="result-display">
                        <span className="result-value">{decResult?.x || '-'}</span>
                        {decResult?.x && (
                          <button
                            onClick={() => copyToClipboard(decResult.x, 'dec-x')}
                            className="result-copy"
                          >
                            {copiedId === 'dec-x' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Zone */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Zona UTM</label>
                      <div className="result-display">
                        <span className="result-value">{decResult?.zone || '-'}</span>
                        {decResult?.zone && (
                          <button
                            onClick={() => copyToClipboard(decResult.zone, 'dec-zone')}
                            className="result-copy"
                          >
                            {copiedId === 'dec-zone' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif font-semibold text-charcoal-900 pt-4">Hasil DMS</h3>
                    
                    {/* DMS Lat */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu Y / North-South / Latitude DMS / Lintang
                      </label>
                      <div className="result-display bg-mint-50 border-mint-200">
                        <span className="result-value text-teal-700">{decResult?.dmsLat || '-'}</span>
                        {decResult?.dmsLat && (
                          <button
                            onClick={() => copyToClipboard(decResult.dmsLat, 'dec-dmslat')}
                            className="result-copy border-mint-200 hover:bg-mint-100"
                          >
                            {copiedId === 'dec-dmslat' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* DMS Lng */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sumbu X / East-West / Longitude DMS / Bujur
                      </label>
                      <div className="result-display bg-mint-50 border-mint-200">
                        <span className="result-value text-teal-700">{decResult?.dmsLng || '-'}</span>
                        {decResult?.dmsLng && (
                          <button
                            onClick={() => copyToClipboard(decResult.dmsLng, 'dec-dmslng')}
                            className="result-copy border-mint-200 hover:bg-mint-100"
                          >
                            {copiedId === 'dec-dmslng' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Distance UTM Tab */}
              {activeTab === 'distance-utm' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    {/* Titik 1 */}
                    <div className="card-soft p-6">
                      <h4 className="font-serif font-semibold text-charcoal-900 mb-4">Titik 1</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu Y / North-South / Latitude DMS / Lintang
                          </label>
                          <input
                            type="number"
                            value={distUtmY1}
                            onChange={(e) => setDistUtmY1(e.target.value)}
                            placeholder="Contoh: 150000"
                            className="input-pastel"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu X / East-West / Longitude DMS / Bujur
                          </label>
                          <input
                            type="number"
                            value={distUtmX1}
                            onChange={(e) => setDistUtmX1(e.target.value)}
                            placeholder="Contoh: 510000"
                            className="input-pastel"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Titik 2 */}
                    <div className="card-soft p-6">
                      <h4 className="font-serif font-semibold text-charcoal-900 mb-4">Titik 2</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu Y / North-South / Latitude DMS / Lintang
                          </label>
                          <input
                            type="number"
                            value={distUtmY2}
                            onChange={(e) => setDistUtmY2(e.target.value)}
                            placeholder="Contoh: 160000"
                            className="input-pastel"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu X / East-West / Longitude DMS / Bujur
                          </label>
                          <input
                            type="number"
                            value={distUtmX2}
                            onChange={(e) => setDistUtmX2(e.target.value)}
                            placeholder="Contoh: 520000"
                            className="input-pastel"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Zona */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Zona UTM</label>
                      <select
                        value={distUtmZone}
                        onChange={(e) => setDistUtmZone(e.target.value)}
                        className="input-pastel appearance-none cursor-pointer"
                      >
                        <option value="">-- Pilih Zona UTM --</option>
                        {Array.from({ length: 9 }, (_, i) => i + 46).flatMap((zone) =>
                          ['N', 'S'].map((hemi) => (
                            <option key={`${zone}${hemi}`} value={`${zone}${hemi}`}>
                              {zone}{hemi}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <button onClick={calculateDistanceUTMHandler} className="btn-primary w-full">
                      <Ruler className="w-4 h-4 mr-2" />
                      Hitung Jarak
                    </button>
                  </div>

                  {/* Output */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Hasil Perhitungan</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
                        <div className="text-sm text-teal-600 mb-2">Jarak (km)</div>
                        <div className="font-mono text-3xl font-semibold text-teal-700">
                          {distUtmResult?.km || '-'}
                        </div>
                      </div>
                      <div className="p-6 bg-mint-50 rounded-2xl border border-mint-200">
                        <div className="text-sm text-teal-600 mb-2">Jarak (meter)</div>
                        <div className="font-mono text-3xl font-semibold text-teal-700">
                          {distUtmResult?.m || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-cream-100 rounded-2xl border border-cream-200">
                      <div className="text-sm text-charcoal-500 mb-2">Azimuth (derajat dari Utara)</div>
                      <div className="font-mono text-2xl font-semibold text-charcoal-700">
                        {distUtmResult?.azimuth || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Distance DMS Tab */}
              {activeTab === 'distance-dms' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    {/* Titik 1 */}
                    <div className="card-soft p-6">
                      <h4 className="font-serif font-semibold text-charcoal-900 mb-4">Titik 1</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu Y / North-South / Latitude DMS / Lintang
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            <input
                              type="number"
                              value={distDmsLat1.degrees || ''}
                              onChange={(e) => setDistDmsLat1({ ...distDmsLat1, degrees: parseInt(e.target.value) || 0 })}
                              placeholder="Derajat"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLat1.minutes || ''}
                              onChange={(e) => setDistDmsLat1({ ...distDmsLat1, minutes: parseInt(e.target.value) || 0 })}
                              placeholder="Menit"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLat1.seconds || ''}
                              onChange={(e) => setDistDmsLat1({ ...distDmsLat1, seconds: parseFloat(e.target.value) || 0 })}
                              placeholder="Detik"
                              step="0.01"
                              className="input-pastel text-center"
                            />
                            <select
                              value={distDmsLat1.direction}
                              onChange={(e) => setDistDmsLat1({ ...distDmsLat1, direction: e.target.value as 'N' | 'S' })}
                              className="input-pastel text-center"
                            >
                              <option value="N">N</option>
                              <option value="S">S</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu X / East-West / Longitude DMS / Bujur
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            <input
                              type="number"
                              value={distDmsLng1.degrees || ''}
                              onChange={(e) => setDistDmsLng1({ ...distDmsLng1, degrees: parseInt(e.target.value) || 0 })}
                              placeholder="Derajat"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLng1.minutes || ''}
                              onChange={(e) => setDistDmsLng1({ ...distDmsLng1, minutes: parseInt(e.target.value) || 0 })}
                              placeholder="Menit"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLng1.seconds || ''}
                              onChange={(e) => setDistDmsLng1({ ...distDmsLng1, seconds: parseFloat(e.target.value) || 0 })}
                              placeholder="Detik"
                              step="0.01"
                              className="input-pastel text-center"
                            />
                            <select
                              value={distDmsLng1.direction}
                              onChange={(e) => setDistDmsLng1({ ...distDmsLng1, direction: e.target.value as 'E' | 'W' })}
                              className="input-pastel text-center"
                            >
                              <option value="E">E</option>
                              <option value="W">W</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Titik 2 */}
                    <div className="card-soft p-6">
                      <h4 className="font-serif font-semibold text-charcoal-900 mb-4">Titik 2</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu Y / North-South / Latitude DMS / Lintang
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            <input
                              type="number"
                              value={distDmsLat2.degrees || ''}
                              onChange={(e) => setDistDmsLat2({ ...distDmsLat2, degrees: parseInt(e.target.value) || 0 })}
                              placeholder="Derajat"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLat2.minutes || ''}
                              onChange={(e) => setDistDmsLat2({ ...distDmsLat2, minutes: parseInt(e.target.value) || 0 })}
                              placeholder="Menit"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLat2.seconds || ''}
                              onChange={(e) => setDistDmsLat2({ ...distDmsLat2, seconds: parseFloat(e.target.value) || 0 })}
                              placeholder="Detik"
                              step="0.01"
                              className="input-pastel text-center"
                            />
                            <select
                              value={distDmsLat2.direction}
                              onChange={(e) => setDistDmsLat2({ ...distDmsLat2, direction: e.target.value as 'N' | 'S' })}
                              className="input-pastel text-center"
                            >
                              <option value="N">N</option>
                              <option value="S">S</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu X / East-West / Longitude DMS / Bujur
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            <input
                              type="number"
                              value={distDmsLng2.degrees || ''}
                              onChange={(e) => setDistDmsLng2({ ...distDmsLng2, degrees: parseInt(e.target.value) || 0 })}
                              placeholder="Derajat"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLng2.minutes || ''}
                              onChange={(e) => setDistDmsLng2({ ...distDmsLng2, minutes: parseInt(e.target.value) || 0 })}
                              placeholder="Menit"
                              className="input-pastel text-center"
                            />
                            <input
                              type="number"
                              value={distDmsLng2.seconds || ''}
                              onChange={(e) => setDistDmsLng2({ ...distDmsLng2, seconds: parseFloat(e.target.value) || 0 })}
                              placeholder="Detik"
                              step="0.01"
                              className="input-pastel text-center"
                            />
                            <select
                              value={distDmsLng2.direction}
                              onChange={(e) => setDistDmsLng2({ ...distDmsLng2, direction: e.target.value as 'E' | 'W' })}
                              className="input-pastel text-center"
                            >
                              <option value="E">E</option>
                              <option value="W">W</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={calculateDistanceDMSHandler} className="btn-primary w-full">
                      <Ruler className="w-4 h-4 mr-2" />
                      Hitung Jarak
                    </button>
                  </div>

                  {/* Output */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Hasil Perhitungan</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
                        <div className="text-sm text-teal-600 mb-2">Jarak (km)</div>
                        <div className="font-mono text-3xl font-semibold text-teal-700">
                          {distDmsResult?.km || '-'}
                        </div>
                      </div>
                      <div className="p-6 bg-mint-50 rounded-2xl border border-mint-200">
                        <div className="text-sm text-teal-600 mb-2">Jarak (meter)</div>
                        <div className="font-mono text-3xl font-semibold text-teal-700">
                          {distDmsResult?.m || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-cream-100 rounded-2xl border border-cream-200">
                      <div className="text-sm text-charcoal-500 mb-2">Azimuth (derajat dari Utara)</div>
                      <div className="font-mono text-2xl font-semibold text-charcoal-700">
                        {distDmsResult?.azimuth || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Distance Decimal Tab */}
              {activeTab === 'distance-decimal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    {/* Titik 1 */}
                    <div className="card-soft p-6">
                      <h4 className="font-serif font-semibold text-charcoal-900 mb-4">Titik 1</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu Y / North-South / Latitude DMS / Lintang
                          </label>
                          <input
                            type="number"
                            value={distDecLat1}
                            onChange={(e) => setDistDecLat1(e.target.value)}
                            placeholder="Contoh: -6.2088"
                            step="any"
                            className="input-pastel"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu X / East-West / Longitude DMS / Bujur
                          </label>
                          <input
                            type="number"
                            value={distDecLng1}
                            onChange={(e) => setDistDecLng1(e.target.value)}
                            placeholder="Contoh: 106.8456"
                            step="any"
                            className="input-pastel"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Titik 2 */}
                    <div className="card-soft p-6">
                      <h4 className="font-serif font-semibold text-charcoal-900 mb-4">Titik 2</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu Y / North-South / Latitude DMS / Lintang
                          </label>
                          <input
                            type="number"
                            value={distDecLat2}
                            onChange={(e) => setDistDecLat2(e.target.value)}
                            placeholder="Contoh: -6.9147"
                            step="any"
                            className="input-pastel"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-2">
                            Sumbu X / East-West / Longitude DMS / Bujur
                          </label>
                          <input
                            type="number"
                            value={distDecLng2}
                            onChange={(e) => setDistDecLng2(e.target.value)}
                            placeholder="Contoh: 107.6098"
                            step="any"
                            className="input-pastel"
                          />
                        </div>
                      </div>
                    </div>

                    <button onClick={calculateDistanceDecimalHandler} className="btn-primary w-full">
                      <Ruler className="w-4 h-4 mr-2" />
                      Hitung Jarak
                    </button>
                  </div>

                  {/* Output */}
                  <div className="space-y-6">
                    <h3 className="font-serif font-semibold text-charcoal-900">Hasil Perhitungan</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
                        <div className="text-sm text-teal-600 mb-2">Jarak (km)</div>
                        <div className="font-mono text-3xl font-semibold text-teal-700">
                          {distDecResult?.km || '-'}
                        </div>
                      </div>
                      <div className="p-6 bg-mint-50 rounded-2xl border border-mint-200">
                        <div className="text-sm text-teal-600 mb-2">Jarak (meter)</div>
                        <div className="font-mono text-3xl font-semibold text-teal-700">
                          {distDecResult?.m || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-cream-100 rounded-2xl border border-cream-200">
                      <div className="text-sm text-charcoal-500 mb-2">Azimuth (derajat dari Utara)</div>
                      <div className="font-mono text-2xl font-semibold text-charcoal-700">
                        {distDecResult?.azimuth || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
