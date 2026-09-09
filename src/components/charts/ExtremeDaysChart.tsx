import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { YearlyClimateData, Language } from '../../types';

interface ExtremeDaysChartProps {
  data: YearlyClimateData[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  lang: Language;
}

export function ExtremeDaysChart({
  data,
  currentYear,
  onSelectYear,
  lang,
}: ExtremeDaysChartProps) {

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: YearlyClimateData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-sm font-bold font-mono text-white">{d.year}</span>
            <span className="text-amber-400 font-semibold">{d.temp.toFixed(2)} °C</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-amber-300 font-medium">
                {lang === 'hu' ? 'Hőségnapok (≥30°C):' : 'Heat Days (≥30°C):'}
              </span>
              <span className="font-mono font-bold text-white">{d.heatWaveDays} {lang === 'hu' ? 'nap' : 'days'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-400 font-medium">
                {lang === 'hu' ? 'Trópusi éjszakák (≥20°C):' : 'Tropical Nights (≥20°C):'}
              </span>
              <span className="font-mono font-bold text-white">{d.tropicalNights} {lang === 'hu' ? 'nap' : 'nights'}</span>
            </div>
            {d.heatWaveDays > 40 && (
              <div className="text-[10px] text-amber-300 pt-1 border-t border-slate-800">
                ⚠️ {lang === 'hu' ? 'Rendkívül terhelő hőhullámos év' : 'Severe persistent heatwaves'}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span>{lang === 'hu' ? 'Hőségnapok és Trópusi Éjszakák (1940–2025)' : 'Heat Wave Days & Tropical Nights'}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {lang === 'hu' ? 'Növekvő trend' : 'Rising trend'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'hu'
              ? 'Hőségnap (Tmax ≥ 30 °C) és Trópusi éjszaka (Tmin ≥ 20 °C) gyakorisága évenként'
              : 'Frequency of Heat Days (Tmax ≥ 30 °C) & Tropical Nights (Tmin ≥ 20 °C)'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
            <span>{lang === 'hu' ? 'Hőségnapok' : 'Heat Days'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-600"></span>
            <span>{lang === 'hu' ? 'Trópusi éjszakák' : 'Tropical Nights'}</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload[0]) {
                onSelectYear(e.activePayload[0].payload.year);
              }
            }}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} minTickGap={25} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* 1940-1970 average line ~14 days */}
            <ReferenceLine
              y={14}
              stroke="#64748b"
              strokeDasharray="3 3"
              label={{ value: '1940s átlag: ~14 nap', fill: '#94a3b8', fontSize: 10, position: 'insideTopLeft' }}
            />

            {/* Current year indicator line */}
            <ReferenceLine x={currentYear} stroke="#ffffff" strokeWidth={2} />

            <Bar 
              dataKey="heatWaveDays" 
              name={lang === 'hu' ? 'Hőségnapok (Tmax ≥ 30°C)' : 'Heat Days'} 
              fill="#f59e0b" 
              isAnimationActive={false}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="tropicalNights" 
              name={lang === 'hu' ? 'Trópusi éjszakák (Tmin ≥ 20°C)' : 'Tropical Nights'} 
              fill="#e11d48" 
              isAnimationActive={false}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
        <span>
          {lang === 'hu' ? '1940-es évek átlaga: 15.6 hőségnap' : '1940s average: 15.6 heat days'}
        </span>
        <span className="text-rose-400 font-semibold">
          {lang === 'hu' ? '2024 rekord: 51 hőségnap, 26 trópusi éjszaka' : '2024 record: 51 heat days, 26 tropical nights'}
        </span>
      </div>
    </div>
  );
}
