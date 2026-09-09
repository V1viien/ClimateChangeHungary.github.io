import { useState } from 'react';
import { YearlyClimateData, Language } from '../types';
import { getAnomalyColor } from '../utils/csvLoader';

interface WarmingStripesProps {
  data: YearlyClimateData[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  lang: Language;
}

export function WarmingStripes({ data, currentYear, onSelectYear, lang }: WarmingStripesProps) {
  const [hoveredYearData, setHoveredYearData] = useState<YearlyClimateData | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            {lang === 'hu' ? 'Magyarország Klímacsíkjai (1940–2025)' : 'Hungary Warming Stripes (1940–2025)'}
          </span>
          <span className="text-slate-400 text-[10px]">
            {lang === 'hu' ? '(Kattints egy évre az ugráshoz)' : '(Click any stripe to jump to year)'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#08519c]"></span>
            {lang === 'hu' ? 'Hűvösebb (-1.3°C)' : 'Cooler (-1.3°C)'}
          </span>
          <span className="text-slate-600">→</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#fee0d2]"></span>
            {lang === 'hu' ? 'Bázis (10.15°C)' : 'Baseline'}
          </span>
          <span className="text-slate-600">→</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#67000d]"></span>
            {lang === 'hu' ? 'Melegebb (+2.8°C)' : 'Warmer (+2.8°C)'}
          </span>
        </div>
      </div>

      {/* Stripes Container */}
      <div className="relative">
        <div className="flex w-full h-12 sm:h-14 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 select-none">
          {data.map((d) => {
            const isSelected = d.year === currentYear;
            const color = getAnomalyColor(d.tempAnomaly);
            return (
              <button
                key={d.year}
                onClick={() => onSelectYear(d.year)}
                onMouseEnter={() => setHoveredYearData(d)}
                onMouseLeave={() => setHoveredYearData(null)}
                className={`flex-1 h-full transition-all relative group cursor-pointer focus:outline-none ${
                  isSelected ? 'scale-y-110 z-10 shadow-lg' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: color }}
                title={`${d.year}: ${d.temp.toFixed(2)} °C (${d.tempAnomaly > 0 ? '+' : ''}${d.tempAnomaly.toFixed(2)} °C)`}
              >
                {isSelected && (
                  <div className="absolute inset-0 ring-2 ring-white shadow-xl">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Milestone year labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-0.5">
          <span>1940</span>
          <span className="hidden sm:inline">1960</span>
          <span>1980</span>
          <span className="hidden sm:inline">2000</span>
          <span>2020</span>
          <span className="text-rose-400 font-semibold">2025</span>
        </div>
      </div>

      {/* Hover / Active inspection strip */}
      {hoveredYearData && (
        <div className="mt-2 text-xs bg-slate-800/90 py-1 px-2.5 rounded flex items-center justify-between border border-slate-700 animate-fadeIn">
          <span className="font-semibold text-white">
            {hoveredYearData.year}: <span className="text-amber-300">{hoveredYearData.temp.toFixed(2)} °C</span>
          </span>
          <span className="text-slate-300">
            {lang === 'hu' ? 'Anomália: ' : 'Anomaly: '}
            <span className={hoveredYearData.tempAnomaly >= 0 ? 'text-rose-400 font-medium' : 'text-sky-400 font-medium'}>
              {hoveredYearData.tempAnomaly >= 0 ? '+' : ''}{hoveredYearData.tempAnomaly.toFixed(2)} °C
            </span>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            {hoveredYearData.precipitation} mm • {hoveredYearData.heatWaveDays} {lang === 'hu' ? 'hőségnap' : 'heat days'}
          </span>
        </div>
      )}
    </div>
  );
}
