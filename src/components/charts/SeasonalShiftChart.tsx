import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { YearlyClimateData, Language } from '../../types';

interface SeasonalShiftChartProps {
  data: YearlyClimateData[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  lang: Language;
}

export function SeasonalShiftChart({
  data,
  currentYear,
  onSelectYear,
  lang,
}: SeasonalShiftChartProps) {
  const [viewMode, setViewMode] = useState<'seasons' | 'impacts'>('seasons');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: YearlyClimateData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-sm font-bold font-mono text-white">{d.year}</span>
            <span className="text-amber-400 font-mono font-semibold">{d.temp.toFixed(2)} °C</span>
          </div>

          {viewMode === 'seasons' ? (
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-sky-400 font-medium">Tél (Dec-Feb):</span>
                <span className="font-mono">{d.winterTemp > 0 ? '+' : ''}{d.winterTemp.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-medium">Tavasz (Már-Máj):</span>
                <span className="font-mono">+{d.springTemp.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400 font-medium">Nyár (Jún-Aug):</span>
                <span className="font-mono font-bold">+{d.summerTemp.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400 font-medium">Ősz (Szept-Nov):</span>
                <span className="font-mono">+{d.autumnTemp.toFixed(1)} °C</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-purple-400 font-medium">
                  {lang === 'hu' ? 'Szüret kezdete (DOY):' : 'Grape Harvest DOY:'}
                </span>
                <span className="font-mono font-bold text-white">
                  {d.grapeHarvestDayOfYear}. nap ({d.grapeHarvestDayOfYear < 255 ? 'Augusztus' : 'Szeptember/Október'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400 font-medium">
                  {lang === 'hu' ? 'Duna aug. vízállás (Bp):' : 'Danube Aug Level (Bp):'}
                </span>
                <span className="font-mono">{d.danubeAvgSummerLevelCm} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {lang === 'hu' ? 'Légköri CO₂:' : 'Atmospheric CO₂:'}
                </span>
                <span className="font-mono text-slate-200">{d.co2Ppm.toFixed(1)} ppm</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white font-display">
            {viewMode === 'seasons' 
              ? (lang === 'hu' ? 'Évszakos Átlagok Eltolódása (1940–2025)' : 'Seasonal Temperature Shift (1940–2025)')
              : (lang === 'hu' ? 'Ökológiai és Hidrológiai Indikátorok' : 'Ecological & River Indicators')}
          </h3>
          <p className="text-xs text-slate-400">
            {viewMode === 'seasons'
              ? (lang === 'hu' ? 'Tél, tavasz, nyár és ősz középhőmérsékletei' : 'Winter, spring, summer, and autumn temperatures')
              : (lang === 'hu' ? 'A szüreti naptár korábbra tolódása és a Duna nyári kisvízszintjei' : 'Tokaj grape harvest advance and Danube summer low water')}
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode('seasons')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'seasons'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? '4 Évszak' : '4 Seasons'}
          </button>
          <button
            onClick={() => setViewMode('impacts')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'impacts'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? 'Bónusz Agrár & Folyó' : 'Agro & River'}
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'seasons' ? (
            <LineChart
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
              <YAxis stroke="#94a3b8" fontSize={11} domain={[-6, 26]} tickFormatter={(v) => `${v}°`} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
              <ReferenceLine x={currentYear} stroke="#ffffff" strokeWidth={2} />

              <Line type="monotone" dataKey="summerTemp" name="Nyár" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="springTemp" name="Tavasz" stroke="#10b981" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="autumnTemp" name="Ősz" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="winterTemp" name="Tél" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          ) : (
            <LineChart
              data={data}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  onSelectYear(e.activePayload[0].payload.year);
                }
              }}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} minTickGap={25} />
              <YAxis yAxisId="harvest" stroke="#a855f7" fontSize={10} domain={[230, 305]} tickFormatter={(v) => `${v}. n.`} tickLine={false} />
              <YAxis yAxisId="danube" orientation="right" stroke="#0284c7" fontSize={10} domain={[0, 480]} tickFormatter={(v) => `${v}cm`} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine yAxisId="harvest" x={currentYear} stroke="#ffffff" strokeWidth={2} />

              <Line yAxisId="harvest" type="monotone" dataKey="grapeHarvestDayOfYear" name="Szüret kezdete (Év napja)" stroke="#a855f7" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line yAxisId="danube" type="monotone" dataKey="danubeAvgSummerLevelCm" name="Duna aug. vízállás (Bp)" stroke="#0284c7" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        {viewMode === 'seasons' ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#ef4444]"></span> Nyár (+24.5 °C csúcs)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#f59e0b]"></span> Ősz (+13.1 °C rekord)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#10b981]"></span> Tavasz</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#38bdf8]"></span> Tél (fagyok eltűnése)</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between w-full">
            <span className="text-purple-300">
              {lang === 'hu' ? '🍇 Tokaji szüret: 1950-es évek ~október közepe → 2024: augusztus vége (közel 1 hónappal korábban!)' : '🍇 Grape harvest: mid-October in 1950s → late August in 2024 (1 month earlier)'}
            </span>
            <span className="text-sky-400">
              {lang === 'hu' ? '🌊 2018 rekord kisvíz a Dunán (38 cm)' : '🌊 2018 record low Danube water (38 cm)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
