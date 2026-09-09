import { YearlyClimateData } from '../types';

/**
 * Returns a hex color corresponding to temperature anomaly
 * Following Ed Hawkins' climate stripes chromatic scale:
 * Cold (-1.5°C or lower) -> deep navy/blue
 * Neutral (0.0°C) -> white/soft cream
 * Warm (+2.8°C or higher) -> dark crimson/red
 */
export function getAnomalyColor(anomaly: number): string {
  // Range: -1.5°C to +2.8°C
  if (anomaly <= -1.2) return '#08306b'; // Deep navy
  if (anomaly <= -0.9) return '#08519c';
  if (anomaly <= -0.6) return '#2171b5';
  if (anomaly <= -0.3) return '#4292c6';
  if (anomaly <= -0.1) return '#6baed6';
  if (anomaly < 0.1) return '#9ecae1'; // Light blue / neutral
  if (anomaly < 0.3) return '#c6dbef';
  if (anomaly < 0.6) return '#fee0d2'; // Light peach
  if (anomaly < 0.9) return '#fcbba1';
  if (anomaly < 1.2) return '#fc9272';
  if (anomaly < 1.5) return '#fb6a4a';
  if (anomaly < 1.8) return '#ef3b2c';
  if (anomaly < 2.2) return '#cb181d';
  if (anomaly < 2.6) return '#a50f15';
  return '#67000d'; // Deep crimson
}

/**
 * Parse a CSV text into YearlyClimateData array
 */
export function parseClimateCsv(csvText: string): Partial<YearlyClimateData>[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const yearIdx = headers.findIndex(h => h.includes('year') || h.includes('év'));
  const tempIdx = headers.findIndex(h => h === 'temp' || h.includes('hőmérséklet') || h.includes('temperature'));
  const precipIdx = headers.findIndex(h => h.includes('precip') || h.includes('csapadék'));
  const heatIdx = headers.findIndex(h => h.includes('heat') || h.includes('hőség'));
  const frostIdx = headers.findIndex(h => h.includes('frost') || h.includes('fagy'));

  const results: Partial<YearlyClimateData>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());
    if (row.length <= 1 || !row[yearIdx]) continue;

    const year = parseInt(row[yearIdx], 10);
    if (isNaN(year)) continue;

    const item: Partial<YearlyClimateData> = { year };
    if (tempIdx !== -1 && !isNaN(parseFloat(row[tempIdx]))) {
      item.temp = parseFloat(row[tempIdx]);
    }
    if (precipIdx !== -1 && !isNaN(parseFloat(row[precipIdx]))) {
      item.precipitation = parseFloat(row[precipIdx]);
    }
    if (heatIdx !== -1 && !isNaN(parseFloat(row[heatIdx]))) {
      item.heatWaveDays = parseFloat(row[heatIdx]);
    }
    if (frostIdx !== -1 && !isNaN(parseFloat(row[frostIdx]))) {
      item.frostDays = parseFloat(row[frostIdx]);
    }
    results.push(item);
  }

  return results;
}

/**
 * Helper to download current dataset as CSV file
 */
export function downloadDatasetAsCsv(data: YearlyClimateData[], filename = 'magyarorszag_klimaadatsor_1940_2025.csv') {
  const headers = [
    'Év (Year)',
    'Éves középhőmérséklet (°C)',
    'Anomália 1940-es évekhez képest (°C)',
    '5 éves mozgóátlag (°C)',
    'Téli középhőmérséklet (°C)',
    'Tavaszi középhőmérséklet (°C)',
    'Nyári középhőmérséklet (°C)',
    'Őszi középhőmérséklet (°C)',
    'Éves csapadék (mm)',
    'Csapadék anomália (%)',
    'Pálfai aszályindex (PAI)',
    'Hőségnapok (Tmax >= 30°C)',
    'Trópusi éjszakák (Tmin >= 20°C)',
    'Fagyos napok (Tmin < 0°C)',
    'Légköri CO2 (ppm)',
    'Tokaji szüret kezdete (Év napja)',
    'Történelmi megjegyzés'
  ];

  const rows = data.map(d => [
    d.year,
    d.temp.toFixed(2),
    d.tempAnomaly.toFixed(2),
    d.movingAvg5y.toFixed(2),
    d.winterTemp.toFixed(1),
    d.springTemp.toFixed(1),
    d.summerTemp.toFixed(1),
    d.autumnTemp.toFixed(1),
    d.precipitation,
    d.precipitationAnomalyPct.toFixed(1),
    d.droughtIndexPai.toFixed(1),
    d.heatWaveDays,
    d.tropicalNights,
    d.frostDays,
    d.co2Ppm.toFixed(1),
    d.grapeHarvestDayOfYear,
    `"${(d.historicalNote || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
