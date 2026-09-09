import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { DECADAL_SUMMARIES } from '../../data/climateData';
import { Language } from '../../types';
import { getAnomalyColor } from '../../utils/csvLoader';

interface DecadeComparisonChartProps {
  lang: Language;
}

type DecadeMetric = 'temp' | 'heat' | 'frost' | 'co2' | 'harvest';

export function DecadeComparisonChart({ lang }: DecadeComparisonChartProps) {
  const [activeMetric, setActiveMetric] = useState<DecadeMetric>('temp');

  const metricConfig = {
    temp: {
      key: 'avgTemp',
      title: lang === 'hu' ? 'Évtizedes Átlaghőmérséklet (°C)' : 'Decadal Mean Temperature (°C)',
      unit: '°C',
      domain: [9.0, 13.0],
      format: (v: number) => `${v.toFixed(2)} °C`,
    },
    heat: {
      key: 'avgHeatWaveDays',
      title: lang === 'hu' ? 'Hőségnapok Átlagos Száma (nap/év)' : 'Mean Heat Wave Days (days/yr)',
      unit: lang === 'hu' ? 'nap' : 'days',
      domain: [0, 50],
      format: (v: number) => `${v.toFixed(1)} ${lang === 'hu' ? 'nap' : 'days'}`,
    },
    frost: {
      key: 'avgFrostDays',
      title: lang === 'hu' ? 'Fagyos Napok Átlagos Száma (nap/év)' : 'Mean Frost Days (days/yr)',
      unit: lang === 'hu' ? 'nap' : 'days',
      domain: [40, 130],
      format: (v: number) => `${v.toFixed(1)} ${lang === 'hu' ? 'nap' : 'days'}`,
    },
    co2: {
      key: 'avgCo2',
      title: lang === 'hu' ? 'Légköri CO₂ Koncentráció (ppm)' : 'Atmospheric CO₂ (ppm)',
      unit: 'ppm',
      domain: [300, 435],
      format: (v: number) => `${v.toFixed(1)} ppm`,
    },
    harvest: {
      key: 'avgGrapeHarvestDoy',
      title: lang === 'hu' ? 'Tokaji Szüret Átlagos Kezdete (Év napja)' : 'Tokaj Grape Harvest Start (Day of Year)',
      unit: lang === 'hu' ? '. nap' : 'DOY',
      domain: [230, 305],
      format: (v: number) => `${Math.round(v)}. nap (${v < 260 ? (lang === 'hu' ? 'Augusztus vége' : 'Late Aug') : (lang === 'hu' ? 'Október' : 'October')})`,
    },
  };

  const currentCfg = metricConfig[activeMetric];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[210px]">
          <div className="font-bold text-white text-sm border-b border-slate-800 pb-1 mb-1.5">
            {d.decade} ({d.startYear}–{d.endYear})
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Középhőmérséklet:' : 'Mean Temp:'}</span>
              <span className="font-mono font-bold text-amber-300">{d.avgTemp.toFixed(2)} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Anomália (vs 1940s):' : 'Anomaly (vs 1940s):'}</span>
              <span className={`font-mono font-bold ${d.avgTempAnomaly >= 0 ? 'text-rose-400' : 'text-sky-400'}`}>
                {d.avgTempAnomaly >= 0 ? '+' : ''}{d.avgTempAnomaly.toFixed(2)} °C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Hőségnapok átlaga:' : 'Heat Days Avg:'}</span>
              <span className="font-mono text-amber-400">{d.avgHeatWaveDays.toFixed(1)} nap/év</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Fagyos napok átlaga:' : 'Frost Days Avg:'}</span>
              <span className="font-mono text-sky-400">{d.avgFrostDays.toFixed(1)} nap/év</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Légköri CO₂:' : 'Atmospheric CO₂:'}</span>
              <span className="font-mono text-slate-200">{d.avgCo2.toFixed(1)} ppm</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white font-display">
            {lang === 'hu' ? 'Évtizedes Összehasonlítás (1940-től 2020-ig)' : 'Decade-by-Decade Comparison (1940s to 2020s)'}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'hu'
              ? 'Hosszú távú 10 éves átlagok a természetes éves ingadozások kiszűrésére'
              : 'Long-term 10-year decadal averages filtering annual weather noise'}
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeMetric === 'temp'
                ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? 'Hőmérséklet (°C)' : 'Temperature (°C)'}
          </button>

          <button
            onClick={() => setActiveMetric('heat')}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeMetric === 'heat'
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? 'Hőségnapok' : 'Heat Days'}
          </button>

          <button
            onClick={() => setActiveMetric('frost')}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeMetric === 'frost'
                ? 'bg-sky-600/30 text-sky-300 border-sky-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? 'Fagyos napok' : 'Frost Days'}
          </button>

          <button
            onClick={() => setActiveMetric('co2')}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeMetric === 'co2'
                ? 'bg-slate-700 text-white border-slate-600 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            CO₂ (ppm)
          </button>

          <button
            onClick={() => setActiveMetric('harvest')}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeMetric === 'harvest'
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang === 'hu' ? 'Szüret dátuma' : 'Grape Harvest'}
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DECADAL_SUMMARIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis 
              dataKey="decade" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false}
              tickFormatter={(v) => v.replace('-es évek', '').replace('-as évek', '').replace(' (eddig)', '')}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              domain={currentCfg.domain as any}
              tickFormatter={(v) => `${v}`}
              tickLine={false} 
            />
            <Tooltip content={<CustomTooltip />} />

            <Bar 
              dataKey={currentCfg.key} 
              radius={[4, 4, 0, 0]} 
              isAnimationActive={false}
            >
              {DECADAL_SUMMARIES.map((entry) => {
                let fill = '#3b82f6';
                if (activeMetric === 'temp') {
                  fill = getAnomalyColor(entry.avgTempAnomaly);
                } else if (activeMetric === 'heat') {
                  fill = '#f59e0b';
                } else if (activeMetric === 'frost') {
                  fill = '#0284c7';
                } else if (activeMetric === 'co2') {
                  fill = '#64748b';
                } else if (activeMetric === 'harvest') {
                  fill = '#8b5cf6';
                }
                return <Cell key={`cell-dec-${entry.startYear}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex flex-wrap justify-between gap-2">
        <span>
          {lang === 'hu' 
            ? '1940-es évek: 10.15 °C átlag, 15.6 hőségnap' 
            : '1940s: 10.15 °C mean, 15.6 heat days'}
        </span>
        <span className="text-rose-400 font-semibold">
          {lang === 'hu' 
            ? '2020-as évek: 12.23 °C átlag (+2.08 °C eltolódás!), 41.5 hőségnap' 
            : '2020s: 12.23 °C mean (+2.08 °C shift!), 41.5 heat days'}
        </span>
      </div>
    </div>
  );
}
