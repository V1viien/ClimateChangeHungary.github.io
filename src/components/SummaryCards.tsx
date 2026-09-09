import { 
  Thermometer, 
  CloudRain, 
  SunMedium, 
  Snowflake, 
  Factory, 
  Trophy, 
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  Droplets
} from 'lucide-react';
import { YearlyClimateData, Language } from '../types';

interface SummaryCardsProps {
  currentData: YearlyClimateData;
  isRangeMode: boolean;
  rangeStart: number;
  rangeEnd: number;
  compareStart: number;
  compareEnd: number;
  rangeAStats: { avgTemp: number; avgPrecip: number; avgHeat: number; avgTropical: number; avgFrost: number } | null;
  rangeBStats: { avgTemp: number; avgPrecip: number; avgHeat: number; avgTropical: number; avgFrost: number } | null;
  records: {
    hottest: YearlyClimateData;
    coldest: YearlyClimateData;
    driest: YearlyClimateData;
    wettest: YearlyClimateData;
    mostHeatDays: YearlyClimateData;
    mostFrostDays: YearlyClimateData;
  };
  lang: Language;
}

export function SummaryCards({
  currentData,
  isRangeMode,
  rangeStart,
  rangeEnd,
  compareStart,
  compareEnd,
  rangeAStats,
  rangeBStats,
  records,
  lang,
}: SummaryCardsProps) {

  if (isRangeMode && rangeAStats && rangeBStats) {
    const tempDiff = rangeBStats.avgTemp - rangeAStats.avgTemp;
    const heatDiff = rangeBStats.avgHeat - rangeAStats.avgHeat;
    const frostDiff = rangeBStats.avgFrost - rangeAStats.avgFrost;
    const precipDiffPct = ((rangeBStats.avgPrecip - rangeAStats.avgPrecip) / rangeAStats.avgPrecip) * 100;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Temp Delta Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{lang === 'hu' ? 'Hőmérséklet különbség' : 'Temp Difference'}</span>
            <Thermometer className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {tempDiff >= 0 ? `+${tempDiff.toFixed(2)}` : tempDiff.toFixed(2)} °C
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {rangeAStats.avgTemp.toFixed(2)} °C ({rangeStart}–{rangeEnd}) →{' '}
            <span className="text-rose-400 font-semibold">{rangeBStats.avgTemp.toFixed(2)} °C</span> ({compareStart}–{compareEnd})
          </p>
        </div>

        {/* Heatwave Days Shift */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{lang === 'hu' ? 'Hőségnapok növekedése' : 'Heat Days Increase'}</span>
            <SunMedium className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            +{heatDiff.toFixed(1)} {lang === 'hu' ? 'nap/év' : 'days/yr'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {rangeAStats.avgHeat.toFixed(1)} nap →{' '}
            <span className="text-amber-300 font-semibold">{rangeBStats.avgHeat.toFixed(1)} nap</span> átlagosan
          </p>
        </div>

        {/* Frost Days Shift */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{lang === 'hu' ? 'Fagyos napok csökkenése' : 'Frost Days Decline'}</span>
            <Snowflake className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
            {frostDiff.toFixed(1)} {lang === 'hu' ? 'nap/év' : 'days/yr'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {rangeAStats.avgFrost.toFixed(1)} nap →{' '}
            <span className="text-sky-300 font-semibold">{rangeBStats.avgFrost.toFixed(1)} nap</span> telek enyhülése
          </p>
        </div>

        {/* Precipitation Shift */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{lang === 'hu' ? 'Csapadék változás' : 'Precipitation Shift'}</span>
            <CloudRain className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-2xl font-bold font-mono mt-1 ${precipDiffPct < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {precipDiffPct >= 0 ? `+${precipDiffPct.toFixed(1)}` : precipDiffPct.toFixed(1)} %
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {rangeAStats.avgPrecip.toFixed(0)} mm → {rangeBStats.avgPrecip.toFixed(0)} mm (szélsőségesebb eloszlás)
          </p>
        </div>
      </div>
    );
  }

  // Single Year Active Cards
  const isAnomalyPositive = currentData.tempAnomaly >= 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      
      {/* 1. Temp & Anomaly Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium">{lang === 'hu' ? 'Középhőmérséklet' : 'Mean Temp'}</span>
          <Thermometer className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-white">
          {currentData.temp.toFixed(2)} <span className="text-sm font-normal text-slate-400">°C</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px]">
          <span className="text-slate-400">{lang === 'hu' ? 'vs 1940s bázis:' : 'vs 1940s:'}</span>
          <span className={`font-semibold font-mono ${isAnomalyPositive ? 'text-rose-400' : 'text-sky-400'}`}>
            {isAnomalyPositive ? '+' : ''}{currentData.tempAnomaly.toFixed(2)} °C
          </span>
        </div>
      </div>

      {/* 2. Precipitation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium">{lang === 'hu' ? 'Éves csapadék' : 'Precipitation'}</span>
          <CloudRain className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-white">
          {currentData.precipitation} <span className="text-sm font-normal text-slate-400">mm</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] truncate">
          <span className="text-slate-400">{lang === 'hu' ? 'Aszály (PAI):' : 'Drought:'}</span>
          <span className={`font-medium ${
            currentData.droughtIndexPai > 7 
              ? 'text-rose-400 font-bold' 
              : currentData.droughtIndexPai > 5 
                ? 'text-amber-400' 
                : 'text-emerald-400'
          }`}>
            {currentData.droughtCategory}
          </span>
        </div>
      </div>

      {/* 3. Heatwave Days Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium">{lang === 'hu' ? 'Hőségnapok (≥30°C)' : 'Heat Days'}</span>
          <SunMedium className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
          {currentData.heatWaveDays} <span className="text-sm font-normal text-slate-400">{lang === 'hu' ? 'nap' : 'days'}</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {lang === 'hu' ? 'Trópusi éj (≥20°C): ' : 'Trop. nights: '}
          <span className="text-amber-300 font-semibold">{currentData.tropicalNights}</span>
        </div>
      </div>

      {/* 4. Frost Days Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium">{lang === 'hu' ? 'Fagyos napok (<0°C)' : 'Frost Days'}</span>
          <Snowflake className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">
          {currentData.frostDays} <span className="text-sm font-normal text-slate-400">{lang === 'hu' ? 'nap' : 'days'}</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {lang === 'hu' ? 'Zord nap (≤-10°C): ' : 'Cold days: '}
          <span className="text-sky-300 font-semibold">{currentData.extremeColdDays}</span>
        </div>
      </div>

      {/* 5. Atmospheric CO2 Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium">{lang === 'hu' ? 'Légköri CO₂' : 'Global CO₂'}</span>
          <Factory className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-200">
          {currentData.co2Ppm.toFixed(1)} <span className="text-sm font-normal text-slate-400">ppm</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {lang === 'hu' ? '1940: 310 ppm (+37%)' : '1940: 310 ppm (+37%)'}
        </div>
      </div>

      {/* 6. Milestone / Historical Records Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium">{lang === 'hu' ? 'Rekordok & Mérföldkő' : 'All-time Records'}</span>
          <Trophy className="w-4 h-4 text-amber-400" />
        </div>
        {currentData.isRecordWarmth ? (
          <div className="text-xs font-bold text-rose-400 leading-tight">
            🔥 {lang === 'hu' ? 'Abszolút melegrekord év!' : 'Warmest year on record!'}
          </div>
        ) : currentData.isRecordDrought ? (
          <div className="text-xs font-bold text-amber-400 leading-tight">
            🏜️ {lang === 'hu' ? 'Évszázad aszálya!' : 'Historic drought!'}
          </div>
        ) : currentData.isRecordPrecipitation ? (
          <div className="text-xs font-bold text-sky-400 leading-tight">
            🌊 {lang === 'hu' ? 'Csapadékrekord év!' : 'Wettest year on record!'}
          </div>
        ) : (
          <div className="text-xs text-slate-300 leading-tight">
            <span className="text-slate-400">{lang === 'hu' ? 'Csúcs: ' : 'Record: '}</span>
            <span className="font-semibold text-rose-400">{records.hottest.year} ({records.hottest.temp}°C)</span>
          </div>
        )}
        <div className="mt-1 text-[10px] text-slate-400 truncate">
          {lang === 'hu' ? 'Legszárazabb: ' : 'Driest: '}{records.driest.year} ({records.driest.precipitation} mm)
        </div>
      </div>

    </div>
  );
}
