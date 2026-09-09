import fs from 'fs';
import path from 'path';
import { HUNGARY_CLIMATE_DATA, DECADAL_SUMMARIES, REGIONAL_STATIONS } from '../src/data/climateData';
import { HUNGARY_MONTHLY_DATA } from '../src/data/monthlyData';

const dataDir = path.resolve(process.cwd(), 'data');
const publicDataDir = path.resolve(process.cwd(), 'public', 'data');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });

// 1. Annual temperatures
const annualCsvHeader = 'year,temp,temp_anomaly_1940s_baseline,moving_avg_5y,moving_avg_10y,is_record_warmth\n';
const annualCsvRows = HUNGARY_CLIMATE_DATA.map(d => 
  `${d.year},${d.temp.toFixed(2)},${d.tempAnomaly > 0 ? '+' : ''}${d.tempAnomaly.toFixed(2)},${d.movingAvg5y.toFixed(2)},${d.movingAvg10y.toFixed(2)},${!!d.isRecordWarmth}`
).join('\n');

fs.writeFileSync(path.join(dataDir, 'annual_temperatures.csv'), annualCsvHeader + annualCsvRows);
fs.writeFileSync(path.join(publicDataDir, 'annual_temperatures.csv'), annualCsvHeader + annualCsvRows);
fs.writeFileSync(path.join(dataDir, 'annual_temperatures.json'), JSON.stringify(HUNGARY_CLIMATE_DATA.map(d => ({
  year: d.year,
  temp: d.temp,
  tempAnomaly: d.tempAnomaly,
  movingAvg5y: d.movingAvg5y,
  isRecordWarmth: d.isRecordWarmth
})), null, 2));

// 2. Seasonal temperatures
const seasonalCsvHeader = 'year,winter_temp,spring_temp,summer_temp,autumn_temp\n';
const seasonalCsvRows = HUNGARY_CLIMATE_DATA.map(d => 
  `${d.year},${d.winterTemp.toFixed(1)},${d.springTemp.toFixed(1)},${d.summerTemp.toFixed(1)},${d.autumnTemp.toFixed(1)}`
).join('\n');

fs.writeFileSync(path.join(dataDir, 'seasonal_temperatures.csv'), seasonalCsvHeader + seasonalCsvRows);
fs.writeFileSync(path.join(publicDataDir, 'seasonal_temperatures.csv'), seasonalCsvHeader + seasonalCsvRows);
fs.writeFileSync(path.join(dataDir, 'seasonal_temperatures.json'), JSON.stringify(HUNGARY_CLIMATE_DATA.map(d => ({
  year: d.year,
  winterTemp: d.winterTemp,
  springTemp: d.springTemp,
  summerTemp: d.summerTemp,
  autumnTemp: d.autumnTemp
})), null, 2));

// 3. Precipitation and drought
const precipCsvHeader = 'year,precipitation_mm,precipitation_anomaly_pct,drought_index_pai,drought_category\n';
const precipCsvRows = HUNGARY_CLIMATE_DATA.map(d => 
  `${d.year},${d.precipitation},${d.precipitationAnomalyPct > 0 ? '+' : ''}${d.precipitationAnomalyPct.toFixed(1)},${d.droughtIndexPai.toFixed(1)},${d.droughtCategory}`
).join('\n');

fs.writeFileSync(path.join(dataDir, 'precipitation_drought.csv'), precipCsvHeader + precipCsvRows);
fs.writeFileSync(path.join(publicDataDir, 'precipitation_drought.csv'), precipCsvHeader + precipCsvRows);
fs.writeFileSync(path.join(dataDir, 'precipitation_drought.json'), JSON.stringify(HUNGARY_CLIMATE_DATA.map(d => ({
  year: d.year,
  precipitation: d.precipitation,
  precipitationAnomalyPct: d.precipitationAnomalyPct,
  droughtIndexPai: d.droughtIndexPai,
  droughtCategory: d.droughtCategory
})), null, 2));

// 4. Extreme days
const extremeCsvHeader = 'year,heat_wave_days_tmax_ge_30,tropical_nights_tmin_ge_20,frost_days_tmin_lt_0,extreme_cold_days_tmin_le_minus_10\n';
const extremeCsvRows = HUNGARY_CLIMATE_DATA.map(d => 
  `${d.year},${d.heatWaveDays},${d.tropicalNights},${d.frostDays},${d.extremeColdDays}`
).join('\n');

fs.writeFileSync(path.join(dataDir, 'extreme_days.csv'), extremeCsvHeader + extremeCsvRows);
fs.writeFileSync(path.join(publicDataDir, 'extreme_days.csv'), extremeCsvHeader + extremeCsvRows);
fs.writeFileSync(path.join(dataDir, 'extreme_days.json'), JSON.stringify(HUNGARY_CLIMATE_DATA.map(d => ({
  year: d.year,
  heatWaveDays: d.heatWaveDays,
  tropicalNights: d.tropicalNights,
  frostDays: d.frostDays,
  extremeColdDays: d.extremeColdDays
})), null, 2));

// 5. Climate impacts and CO2
const impactsCsvHeader = 'year,co2_ppm,grape_harvest_day_of_year,danube_avg_summer_level_cm,extreme_weather_events_count\n';
const impactsCsvRows = HUNGARY_CLIMATE_DATA.map(d => 
  `${d.year},${d.co2Ppm.toFixed(1)},${d.grapeHarvestDayOfYear},${d.danubeAvgSummerLevelCm},${d.extremeWeatherEventsCount}`
).join('\n');

fs.writeFileSync(path.join(dataDir, 'climate_impacts_co2.csv'), impactsCsvHeader + impactsCsvRows);
fs.writeFileSync(path.join(publicDataDir, 'climate_impacts_co2.csv'), impactsCsvHeader + impactsCsvRows);
fs.writeFileSync(path.join(dataDir, 'climate_impacts_co2.json'), JSON.stringify(HUNGARY_CLIMATE_DATA.map(d => ({
  year: d.year,
  co2Ppm: d.co2Ppm,
  grapeHarvestDayOfYear: d.grapeHarvestDayOfYear,
  danubeAvgSummerLevelCm: d.danubeAvgSummerLevelCm,
  extremeWeatherEventsCount: d.extremeWeatherEventsCount
})), null, 2));

// Full combined dataset JSON
fs.writeFileSync(path.join(dataDir, 'hungary_climate_1940_2026.json'), JSON.stringify(HUNGARY_CLIMATE_DATA, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'hungary_climate_1940_2026.json'), JSON.stringify(HUNGARY_CLIMATE_DATA, null, 2));
fs.writeFileSync(path.join(dataDir, 'hungary_climate_1940_2025.json'), JSON.stringify(HUNGARY_CLIMATE_DATA, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'hungary_climate_1940_2025.json'), JSON.stringify(HUNGARY_CLIMATE_DATA, null, 2));
fs.writeFileSync(path.join(dataDir, 'decadal_summary.json'), JSON.stringify(DECADAL_SUMMARIES, null, 2));
fs.writeFileSync(path.join(dataDir, 'regional_stations.json'), JSON.stringify(REGIONAL_STATIONS, null, 2));

// Monthly series (2020-01 to 2026-09)
const monthlyCsvHeader = 'month_key,year,month,month_name,temp,temp_anomaly,precipitation_mm,heat_wave_days,tropical_nights,frost_days,note\n';
const monthlyCsvRows = HUNGARY_MONTHLY_DATA.map(d =>
  `${d.monthKey},${d.year},${d.month},${d.monthName},${d.temp.toFixed(1)},${d.tempAnomaly > 0 ? '+' : ''}${d.tempAnomaly.toFixed(1)},${d.precipitation},${d.heatWaveDays},${d.tropicalNights},${d.frostDays},"${d.note || ''}"`
).join('\n');

fs.writeFileSync(path.join(dataDir, 'hungary_monthly_2020_2026_09.csv'), monthlyCsvHeader + monthlyCsvRows);
fs.writeFileSync(path.join(publicDataDir, 'hungary_monthly_2020_2026_09.csv'), monthlyCsvHeader + monthlyCsvRows);
fs.writeFileSync(path.join(dataDir, 'hungary_monthly_2020_2026_09.json'), JSON.stringify(HUNGARY_MONTHLY_DATA, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'hungary_monthly_2020_2026_09.json'), JSON.stringify(HUNGARY_MONTHLY_DATA, null, 2));

console.log('Successfully generated all CSV and JSON data files in /data and /public/data');
