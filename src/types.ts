export interface YearlyClimateData {
  year: number;
  temp: number; // Mean annual temperature in °C
  tempAnomaly: number; // vs 1940s baseline (10.15 °C)
  tempAnomalyWMO?: number; // vs 1961-1990 baseline (10.05 °C)
  movingAvg5y: number; // 5-year rolling average
  movingAvg10y: number; // 10-year rolling average
  
  // Seasonal temperatures (°C)
  winterTemp: number;
  springTemp: number;
  summerTemp: number;
  autumnTemp: number;
  
  // Precipitation & Drought
  precipitation: number; // mm
  precipitationAnomalyPct: number; // % anomaly vs 1940-1970 average (595 mm)
  droughtIndexPai: number; // Pálfai Drought Index (PAI): <4 mild/normal, 4-6 moderate, 6-8 severe, >8 extreme
  droughtCategory: 'Normál' | 'Mérsékelt' | 'Közepes' | 'Súlyos' | 'Extrém aszály' | 'Csapadékos év';
  
  // Extreme weather days
  heatWaveDays: number; // Hőségnapok: Tmax >= 30 °C
  tropicalNights: number; // Trópusi éjszakák: Tmin >= 20 °C
  frostDays: number; // Fagyos napok: Tmin < 0 °C
  extremeColdDays: number; // Zord napok: Tmin <= -10 °C
  
  // Context & impacts
  co2Ppm: number; // Atmospheric CO2 in ppm
  grapeHarvestDayOfYear: number; // DOY for Tokaj/Balaton harvest onset (e.g. 290 = mid Oct, 245 = early Sep)
  danubeAvgSummerLevelCm: number; // Danube water level indicator at Budapest (cm)
  extremeWeatherEventsCount: number; // Reported severe storm / flash flood / hail events
  
  isRecordWarmth?: boolean;
  isRecordDrought?: boolean;
  isRecordPrecipitation?: boolean;
  historicalNote?: string;
}

export interface MonthlyClimateData {
  year: number;
  month: number; // 1-12
  monthKey: string; // e.g. "2026-09"
  monthName: string; // e.g. "Szeptember" / "September"
  temp: number; // °C
  tempAnomaly: number; // vs 1940-1949 monthly baseline
  precipitation: number; // mm
  heatWaveDays: number;
  tropicalNights: number;
  frostDays: number;
  note?: string;
}

export interface DecadalClimateSummary {
  decade: string;
  startYear: number;
  endYear: number;
  avgTemp: number;
  avgTempAnomaly: number;
  avgPrecipitation: number;
  avgHeatWaveDays: number;
  avgTropicalNights: number;
  avgFrostDays: number;
  avgCo2: number;
  avgGrapeHarvestDoy: number;
}

export interface RegionalStationData {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  elevationM: number;
  avgTemp1940s: number;
  avgTemp2020s: number;
  tempChange: number;
  heatWaveDays2020s: number;
  tropicalNights2020s: number;
  annualPrecipitationAvg: number;
  description: string;
}

export type ActiveMetric = 
  | 'temperature'
  | 'tempAnomaly'
  | 'seasonal'
  | 'precipitation'
  | 'extremeDays'
  | 'decades'
  | 'co2'
  | 'impacts';

export type Language = 'hu' | 'en';
