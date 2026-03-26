// Coordinate Types
export interface UTMCoordinate {
  x: number;
  y: number;
  zone: string;
}

export interface DMSCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface DecimalCoordinate {
  latitude: number;
  longitude: number;
}

export interface DMSResult {
  lat: DMSCoordinate;
  lng: DMSCoordinate;
  latString: string;
  lngString: string;
}

export interface UTMResult {
  x: number;
  y: number;
  zone: string;
}

export interface DistanceResult {
  kilometers: number;
  meters: number;
  azimuth: number;
}

export type ConverterTab = 'utm' | 'dms' | 'decimal' | 'distance-utm' | 'distance-dms' | 'distance-decimal';

export interface ProvinceZone {
  name: string;
  zones: string[];
}
