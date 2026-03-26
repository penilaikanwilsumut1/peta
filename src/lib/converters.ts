import type { DMSCoordinate, DecimalCoordinate, UTMResult, DMSResult, DistanceResult } from '@/types';

// WGS84 Ellipsoid Parameters
const EQUATORIAL_RADIUS = 6378137.0;
const FLATTENING = 1 / 298.257223563;
const ECCENTRICITY_SQUARED = 2 * FLATTENING - FLATTENING * FLATTENING;

// Scale factor for UTM
const K0 = 0.9996;

// Convert Decimal to DMS
export function decimalToDMS(decimal: number, isLatitude: boolean): DMSCoordinate {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  let direction: 'N' | 'S' | 'E' | 'W';
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }
  
  return {
    degrees,
    minutes,
    seconds: Math.round(seconds * 100) / 100,
    direction
  };
}

// Convert DMS to Decimal
export function dmsToDecimal(dms: DMSCoordinate): number {
  const decimal = dms.degrees + dms.minutes / 60 + dms.seconds / 3600;
  const sign = dms.direction === 'S' || dms.direction === 'W' ? -1 : 1;
  return sign * decimal;
}

// Format DMS to string
export function formatDMS(dms: DMSCoordinate): string {
  return `${dms.degrees}° ${dms.minutes}' ${dms.seconds.toFixed(2)}" ${dms.direction}`;
}

// Get UTM zone from longitude
export function getUTMZone(longitude: number): number {
  return Math.floor((longitude + 180) / 6) + 1;
}

// Get hemisphere from latitude
export function getHemisphere(latitude: number): 'N' | 'S' {
  return latitude >= 0 ? 'N' : 'S';
}

// Decimal to UTM conversion
export function decimalToUTM(lat: number, lng: number): UTMResult {
  const zone = getUTMZone(lng);
  const hemisphere = getHemisphere(lat);
  const zoneNumber = zone;
  
  // Convert to radians
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;
  
  // Central meridian for the zone
  const lng0 = ((zoneNumber - 1) * 6 - 180 + 3) * Math.PI / 180;
  
  const N = EQUATORIAL_RADIUS / Math.sqrt(1 - ECCENTRICITY_SQUARED * Math.sin(latRad) ** 2);
  const T = Math.tan(latRad) ** 2;
  const C = ECCENTRICITY_SQUARED * Math.cos(latRad) ** 2 / (1 - ECCENTRICITY_SQUARED);
  const A = Math.cos(latRad) * (lngRad - lng0);
  const M = EQUATORIAL_RADIUS * ((1 - ECCENTRICITY_SQUARED / 4 - 3 * ECCENTRICITY_SQUARED ** 2 / 64 - 5 * ECCENTRICITY_SQUARED ** 3 / 256) * latRad
    - (3 * ECCENTRICITY_SQUARED / 8 + 3 * ECCENTRICITY_SQUARED ** 2 / 32 + 45 * ECCENTRICITY_SQUARED ** 3 / 1024) * Math.sin(2 * latRad)
    + (15 * ECCENTRICITY_SQUARED ** 2 / 256 + 45 * ECCENTRICITY_SQUARED ** 3 / 1024) * Math.sin(4 * latRad)
    - (35 * ECCENTRICITY_SQUARED ** 3 / 3072) * Math.sin(6 * latRad));
  
  const x = K0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T ** 2 + 72 * C - 58 * ECCENTRICITY_SQUARED) * A ** 5 / 120) + 500000;
  
  let y = K0 * (M + N * Math.tan(latRad) * (A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 + (61 - 58 * T + T ** 2 + 600 * C - 330 * ECCENTRICITY_SQUARED) * A ** 6 / 720));
  
  if (hemisphere === 'S') {
    y += 10000000;
  }
  
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    zone: `${zone}${hemisphere}`
  };
}

// UTM to Decimal conversion
export function utmToDecimal(x: number, y: number, zone: string): DecimalCoordinate {
  const zoneNumber = parseInt(zone.slice(0, -1));
  const hemisphere = zone.slice(-1) as 'N' | 'S';
  
  let yAdjusted = y;
  if (hemisphere === 'S') {
    yAdjusted -= 10000000;
  }
  
  const lng0 = ((zoneNumber - 1) * 6 - 180 + 3) * Math.PI / 180;
  const M = yAdjusted / K0;
  const mu = M / (EQUATORIAL_RADIUS * (1 - ECCENTRICITY_SQUARED / 4 - 3 * ECCENTRICITY_SQUARED ** 2 / 64 - 5 * ECCENTRICITY_SQUARED ** 3 / 256));
  
  const e1 = (1 - Math.sqrt(1 - ECCENTRICITY_SQUARED)) / (1 + Math.sqrt(1 - ECCENTRICITY_SQUARED));
  const J1 = 3 * e1 / 2 - 27 * e1 ** 3 / 32;
  const J2 = 21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32;
  const J3 = 151 * e1 ** 3 / 96;
  const J4 = 1097 * e1 ** 4 / 512;
  
  const fp = mu + J1 * Math.sin(2 * mu) + J2 * Math.sin(4 * mu) + J3 * Math.sin(6 * mu) + J4 * Math.sin(8 * mu);
  
  const e2 = ECCENTRICITY_SQUARED / (1 - ECCENTRICITY_SQUARED);
  const C1 = e2 * Math.cos(fp) ** 2;
  const T1 = Math.tan(fp) ** 2;
  const R1 = EQUATORIAL_RADIUS * (1 - ECCENTRICITY_SQUARED) / (1 - ECCENTRICITY_SQUARED * Math.sin(fp) ** 2) ** 1.5;
  const N1 = EQUATORIAL_RADIUS / Math.sqrt(1 - ECCENTRICITY_SQUARED * Math.sin(fp) ** 2);
  const D = (x - 500000) / (N1 * K0);
  
  const lat = fp - N1 * Math.tan(fp) / R1 * (D ** 2 / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * e2) * D ** 4 / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 ** 2 - 252 * e2 - 3 * C1 ** 2) * D ** 6 / 720);
  
  const lng = lng0 + (D - (1 + 2 * T1 + C1) * D ** 3 / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * e2 + 24 * T1 ** 2) * D ** 5 / 120) / Math.cos(fp);
  
  return {
    latitude: lat * 180 / Math.PI,
    longitude: lng * 180 / Math.PI
  };
}

// Convert UTM to DMS
export function utmToDMS(x: number, y: number, zone: string): DMSResult {
  const decimal = utmToDecimal(x, y, zone);
  const latDMS = decimalToDMS(decimal.latitude, true);
  const lngDMS = decimalToDMS(decimal.longitude, false);
  
  return {
    lat: latDMS,
    lng: lngDMS,
    latString: formatDMS(latDMS),
    lngString: formatDMS(lngDMS)
  };
}

// Convert DMS to UTM
export function dmsToUTM(latDMS: DMSCoordinate, lngDMS: DMSCoordinate): UTMResult {
  const lat = dmsToDecimal(latDMS);
  const lng = dmsToDecimal(lngDMS);
  return decimalToUTM(lat, lng);
}

// Calculate distance using Haversine formula
export function calculateDistanceHaversine(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): DistanceResult {
  const R = 6371000; // Earth's radius in meters
  
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const deltaLat = (lat2 - lat1) * Math.PI / 180;
  const deltaLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(deltaLat / 2) ** 2 + 
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const meters = R * c;
  
  // Calculate azimuth
  const y = Math.sin(deltaLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLng);
  let azimuth = Math.atan2(y, x) * 180 / Math.PI;
  azimuth = (azimuth + 360) % 360;
  
  return {
    kilometers: Math.round(meters / 1000 * 100) / 100,
    meters: Math.round(meters * 100) / 100,
    azimuth: Math.round(azimuth * 100) / 100
  };
}

// Calculate distance from UTM coordinates
export function calculateDistanceUTM(
  x1: number, y1: number, 
  x2: number, y2: number, 
  zone: string
): DistanceResult {
  const point1 = utmToDecimal(x1, y1, zone);
  const point2 = utmToDecimal(x2, y2, zone);
  return calculateDistanceHaversine(
    point1.latitude, point1.longitude,
    point2.latitude, point2.longitude
  );
}

// Province to Zone mapping for Indonesia
export const provinceZones: Record<string, string[]> = {
  'Aceh': ['46N', '46S', '47N', '47S'],
  'Sumatera Utara': ['47N', '47S'],
  'Sumatera Barat': ['47S', '48S'],
  'Riau': ['47N', '47S', '48N', '48S'],
  'Jambi': ['48S'],
  'Sumatera Selatan': ['48S'],
  'Bengkulu': ['48S'],
  'Lampung': ['48S'],
  'Banten': ['48S'],
  'DKI Jakarta': ['48S'],
  'Jawa Barat': ['48S'],
  'Jawa Tengah': ['49S'],
  'DI Yogyakarta': ['49S'],
  'Jawa Timur': ['49S'],
  'Bali': ['50S'],
  'Kalimantan Barat': ['49N', '49S'],
  'Kalimantan Tengah': ['49N', '49S', '50N', '50S'],
  'Kalimantan Selatan': ['50S'],
  'Kalimantan Timur': ['50N', '50S'],
  'Kalimantan Utara': ['50N', '50S'],
  'Nusa Tenggara Barat': ['50S'],
  'Nusa Tenggara Timur': ['51S'],
  'Sulawesi Selatan': ['50S'],
  'Sulawesi Barat': ['50S'],
  'Sulawesi Tenggara': ['51S'],
  'Sulawesi Tengah': ['50S', '51S'],
  'Sulawesi Utara': ['51S'],
  'Gorontalo': ['51S'],
  'Maluku': ['51S', '52S'],
  'Maluku Utara': ['52S'],
  'Papua Barat': ['53S', '54S'],
  'Papua': ['53S', '54S']
};

// Detect zone from province and coordinates
export function detectZoneFromProvince(province: string, lat: number, lng: number): string | null {
  const zones = provinceZones[province];
  if (!zones) return null;
  
  const hemisphere = lat >= 0 ? 'N' : 'S';
  const matchingZones = zones.filter(z => z.endsWith(hemisphere));
  
  if (matchingZones.length === 1) {
    return matchingZones[0];
  }
  
  // If multiple zones match, use longitude to determine
  const zoneNumber = getUTMZone(lng);
  const exactZone = `${zoneNumber}${hemisphere}`;
  
  if (zones.includes(exactZone)) {
    return exactZone;
  }
  
  return matchingZones[0] || null;
}
