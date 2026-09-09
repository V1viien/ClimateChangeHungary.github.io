import { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { HUNGARY_MONTHLY_DATA } from '../../data/monthlyData';
import { Language } from '../../types';
import { getAnomalyColor } from '../../utils/csvLoader';
import { Calendar, Flame, CloudRain } from 'lucide-react';

interface MonthlyDetailChartProps {
  lang: Language;
}

export function MonthlyDetailChart({ lang }: MonthlyDetailChartProps) {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(2026);

  const filteredData = selectedYear === 'all'
    ? HUNGARY_MONTHLY_DATA
    : HUNGARY_MONTHLY_DATA.filter((d) => d.year === selectedYear);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-sm font-bold font-mono text-white">
              {d.monthKey} ({d.monthName})
            </span>
            <span className={`px-2 py-0.5 rounded font-mono font-bold ${
              d.tempAnomaly >= 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-sky-500/20 text-sky-300'
            }`}>
              {d.tempAnomaly >= 0 ? '+' : ''}{d.tempAnomaly.toFixed(1)} °C
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Havi középhőmérséklet:' : 'Monthly Mean Temp:'}</span>
              <span className="font-mono font-bold text-amber-300">{d.temp.toFixed(1)} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Havi csapadék:' : 'Precipitation:'}</span>
              <span className="font-mono text-sky-300">{d.precipitation} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Hőségnapok / Trópusi éj:' : 'Heat Days / Trop Nights:'}</span>
              <span className="font-mono text-slate-200">{d.heatWaveDays} / {d.tropicalNights}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Fagyos napok:' : 'Frost Days:'}</span>
              <span className="font-mono text-blue-300">{d.frostDays} nap</span>
            </div>
            {d.note && (
              <div className="text-[10px] text-amber-300/90 pt-1 border-t border-slate-800 italic">
                📌 {d.note}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>{lang === 'hu' ? 'Havi Részletező Nézet (2026.09-ig)' : 'Monthly Breakdown View (up to 2026-09)'}</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
              2026-09
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'hu'
              ? 'Havi középhőmérsékletek és anomáliák vizsgálata a közelmúltban, 2026 szeptemberéig kiterjesztve'
              : 'Monthly mean temperatures and anomalies extending through September 2026'}
          </p>
        </div>

        {/* Year Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                selectedYear === yr
                  ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-sm shadow-rose-900/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {yr === 2026 ? '2026 (szept.-ig)' : yr}
            </button>
          ))}
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              selectedYear === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? 'Összes (2020–2026)' : 'All (2020–2026)'}
          </button>
        </div>
      </div>

      {/* Monthly Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis 
              dataKey={selectedYear === 'all' ? 'monthKey' : 'monthName'} 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              interval={selectedYear === 'all' ? 3 : 0}
            />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[-2, 30]} tickFormatter={(v) => `${v}°`} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />

            {/* Temperature bar */}
            <Bar dataKey="temp" name="Hőmérséklet (°C)" isAnimationActive={false} radius={[2, 2, 0, 0]}>
              {filteredData.map((entry) => (
                <Cell key={`m-bar-${entry.monthKey}`} fill={getAnomalyColor(entry.tempAnomaly)} />
              ))}
            </Bar>

            {/* Precipitation line indicator */}
            <Line 
              type="monotone" 
              dataKey={(d: any) => (d.precipitation / 4)} 
              stroke="#38bdf8" 
              strokeWidth={1.5} 
              dot={{ r: 2, fill: '#38bdf8' }} 
              isAnimationActive={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#b2182b]"></span>
            {lang === 'hu' ? 'Nyári kánikula (2026.07-08: 25.6 °C)' : 'Summer heat (2026.07-08: 25.6 °C)'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[#38bdf8]"></span>
            {lang === 'hu' ? 'Csapadék trend' : 'Precipitation trend'}
          </span>
        </div>
        <span className="text-amber-300 font-medium">
          {lang === 'hu'
            ? '2026.09 (lezáró hónap): +2.5 °C anomália, korai őszi szárazság'
            : '2026-09 (current month): +2.5 °C anomaly, dry early autumn'}
        </span>
      </div>
    </div>
  );
}
