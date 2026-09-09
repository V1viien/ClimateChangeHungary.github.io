import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { YearlyClimateData, Language } from '../../types';

interface FrostDaysChartProps {
  data: YearlyClimateData[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  lang: Language;
}

export function FrostDaysChart({
  data,
  currentYear,
  onSelectYear,
  lang,
}: FrostDaysChartProps) {

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: YearlyClimateData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-sm font-bold font-mono text-white">{d.year}</span>
            <span className="text-sky-300 font-semibold">{d.winterTemp > 0 ? '+' : ''}{d.winterTemp.toFixed(1)} °C tél</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-sky-400 font-medium">
                {lang === 'hu' ? 'Fagyos napok (<0°C):' : 'Frost Days (<0°C):'}
              </span>
              <span className="font-mono font-bold text-white">{d.frostDays} {lang === 'hu' ? 'nap' : 'days'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-400 font-medium">
                {lang === 'hu' ? 'Zord napok (≤-10°C):' : 'Severe Cold (≤-10°C):'}
              </span>
              <span className="font-mono font-bold text-white">{d.extremeColdDays} {lang === 'hu' ? 'nap' : 'days'}</span>
            </div>
            {d.frostDays < 60 && (
              <div className="text-[10px] text-amber-300 pt-1 border-t border-slate-800">
                ❄️ {lang === 'hu' ? 'Rendkívül enyhe, hómentes tél' : 'Exceptionally mild, snowless winter'}
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
            <span>{lang === 'hu' ? 'Fagyos és Zord Napok Csökkenése (1940–2025)' : 'Decline in Frost & Severe Cold Days'}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {lang === 'hu' ? 'Csökkenő trend' : 'Declining trend'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'hu'
              ? 'Fagyos napok (Tmin < 0 °C) és zord napok (Tmin ≤ -10 °C) fokozatos visszaszorulása'
              : 'Declining frequency of frost days (<0 °C) and severe freezing days (≤-10 °C)'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-500"></span>
            <span>{lang === 'hu' ? 'Fagyos napok (<0°C)' : 'Frost Days (<0°C)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-600"></span>
            <span>{lang === 'hu' ? 'Zord napok (≤-10°C)' : 'Severe Cold (≤-10°C)'}</span>
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
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 135]} />
            <Tooltip content={<CustomTooltip />} />

            {/* 1940-1970 average line ~105 days */}
            <ReferenceLine
              y={105}
              stroke="#64748b"
              strokeDasharray="3 3"
              label={{ value: '1940s átlag: ~105 nap', fill: '#94a3b8', fontSize: 10, position: 'insideTopLeft' }}
            />

            {/* Current year indicator line */}
            <ReferenceLine x={currentYear} stroke="#ffffff" strokeWidth={2} />

            <Bar 
              dataKey="frostDays" 
              name={lang === 'hu' ? 'Fagyos napok (<0°C)' : 'Frost Days'} 
              fill="#38bdf8" 
              isAnimationActive={false}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="extremeColdDays" 
              name={lang === 'hu' ? 'Zord napok (≤-10°C)' : 'Severe Cold Days'} 
              fill="#6366f1" 
              isAnimationActive={false}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
        <span>
          {lang === 'hu' ? '1963 rekord hideg: 126 fagyos nap, 31 zord nap' : '1963 cold winter: 126 frost days, 31 severe cold days'}
        </span>
        <span className="text-sky-400 font-semibold">
          {lang === 'hu' ? '2024: csupán 48 fagyos nap, 0 zord nap' : '2024: only 48 frost days, 0 severe cold days'}
        </span>
      </div>
    </div>
  );
}
