import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  Cell
} from 'recharts';
import { YearlyClimateData, Language } from '../../types';
import { getAnomalyColor } from '../../utils/csvLoader';
import { Eye, EyeOff, Info, TrendingUp } from 'lucide-react';

interface MainTempChartProps {
  data: YearlyClimateData[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  showRawTemp: boolean;
  setShowRawTemp: (val: boolean) => void;
  showAnomaly: boolean;
  setShowAnomaly: (val: boolean) => void;
  showMovingAvg5y: boolean;
  setShowMovingAvg5y: (val: boolean) => void;
  showMovingAvg10y: boolean;
  setShowMovingAvg10y: (val: boolean) => void;
  showTrendline: boolean;
  setShowTrendline: (val: boolean) => void;
  lang: Language;
}

export function MainTempChart({
  data,
  currentYear,
  onSelectYear,
  showRawTemp,
  setShowRawTemp,
  showAnomaly,
  setShowAnomaly,
  showMovingAvg5y,
  setShowMovingAvg5y,
  showMovingAvg10y,
  setShowMovingAvg10y,
  showTrendline,
  setShowTrendline,
  lang,
}: MainTempChartProps) {
  // Compute linear trendline points
  const chartDataWithTrend = useMemo(() => {
    const n = data.length;
    if (n === 0) return [];

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    data.forEach((d, idx) => {
      const x = idx;
      const y = showRawTemp ? d.temp : d.tempAnomaly;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((d, idx) => ({
      ...d,
      trendline: Number((slope * idx + intercept).toFixed(2)),
      displayVal: showRawTemp ? d.temp : d.tempAnomaly,
      color: getAnomalyColor(d.tempAnomaly),
    }));
  }, [data, showRawTemp]);

  const yDomain = showRawTemp ? [8.0, 13.5] : [-2.0, 3.5];

  // Custom rich tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: YearlyClimateData = payload[0].payload;
      const isPositive = d.tempAnomaly >= 0;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[230px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-base font-bold font-mono text-white">{d.year}</span>
            <span className={`px-2 py-0.5 rounded font-mono font-semibold ${
              isPositive ? 'bg-rose-500/20 text-rose-300' : 'bg-sky-500/20 text-sky-300'
            }`}>
              {isPositive ? '+' : ''}{d.tempAnomaly.toFixed(2)} °C
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Évi középhőmérséklet:' : 'Annual Mean Temp:'}</span>
              <span className="font-mono font-bold text-white">{d.temp.toFixed(2)} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? '5 éves mozgóátlag:' : '5-yr Moving Avg:'}</span>
              <span className="font-mono text-amber-300">{d.movingAvg5y.toFixed(2)} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Csapadékösszeg:' : 'Precipitation:'}</span>
              <span className="font-mono text-sky-300">{d.precipitation} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Hőségnap / Fagyos nap:' : 'Heat / Frost Days:'}</span>
              <span className="font-mono text-slate-200">{d.heatWaveDays} nap / {d.frostDays} nap</span>
            </div>

            {/* Seasonal preview */}
            <div className="pt-2 mt-1 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
              <div className="bg-slate-800/60 p-1 rounded">
                <div className="text-sky-400">Tél</div>
                <div>{d.winterTemp > 0 ? '+' : ''}{d.winterTemp.toFixed(1)}°</div>
              </div>
              <div className="bg-slate-800/60 p-1 rounded">
                <div className="text-emerald-400">Tav</div>
                <div>+{d.springTemp.toFixed(1)}°</div>
              </div>
              <div className="bg-slate-800/60 p-1 rounded">
                <div className="text-amber-400">Nyár</div>
                <div>+{d.summerTemp.toFixed(1)}°</div>
              </div>
              <div className="bg-slate-800/60 p-1 rounded">
                <div className="text-orange-400">Ősz</div>
                <div>+{d.autumnTemp.toFixed(1)}°</div>
              </div>
            </div>

            {d.historicalNote && (
              <div className="mt-2 pt-1 text-[11px] text-amber-200/90 italic border-t border-slate-800">
                "{d.historicalNote}"
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
      {/* Chart Header & Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              {lang === 'hu' ? 'Hőmérsékleti Trendek és Anomália (1940–2025)' : 'Temperature Trends & Anomaly (1940–2025)'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {showRawTemp ? '°C (Középhőmérséklet)' : '°C (Anomália)'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'hu' 
              ? 'Magyarország országos éves átlaghőmérséklete az 1940-es évek bázisához (10.15 °C) viszonyítva' 
              : 'Hungary national annual mean temperature anomaly vs. 1940s baseline (10.15 °C)'}
          </p>
        </div>

        {/* Series Controls / Toggle switches */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Unit Toggle: Anomaly vs Raw */}
          <button
            onClick={() => setShowRawTemp(!showRawTemp)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showRawTemp
                ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {showRawTemp ? (lang === 'hu' ? 'Tényleges °C' : 'Actual °C') : (lang === 'hu' ? 'Anomália nézet' : 'Anomaly View')}
          </button>

          {/* 5-year Moving Average Toggle */}
          <button
            onClick={() => setShowMovingAvg5y(!showMovingAvg5y)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showMovingAvg5y
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-amber-400"></span>
            {lang === 'hu' ? '5 éves átlag' : '5y Moving Avg'}
          </button>

          {/* 10-year Moving Average Toggle */}
          <button
            onClick={() => setShowMovingAvg10y(!showMovingAvg10y)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showMovingAvg10y
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-purple-400"></span>
            {lang === 'hu' ? '10 éves átlag' : '10y Moving Avg'}
          </button>

          {/* Trendline Toggle */}
          <button
            onClick={() => setShowTrendline(!showTrendline)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showTrendline
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            {lang === 'hu' ? 'Trendvonal' : 'Trendline'}
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[340px] sm:h-[380px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartDataWithTrend}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload[0]) {
                onSelectYear(e.activePayload[0].payload.year);
              }
            }}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8" 
              fontSize={11}
              tickLine={false}
              minTickGap={25}
            />

            <YAxis 
              stroke="#94a3b8" 
              fontSize={11}
              domain={yDomain}
              tickFormatter={(v) => `${v > 0 && !showRawTemp ? '+' : ''}${v.toFixed(1)}°`}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Baseline 0 anomaly or 10.15 °C baseline */}
            <ReferenceLine
              y={showRawTemp ? 10.15 : 0}
              stroke="#64748b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: showRawTemp ? 'Bázis: 10.15 °C' : '0.0 °C (1940-1949)',
                fill: '#94a3b8',
                fontSize: 10,
                position: 'insideBottomRight'
              }}
            />

            {/* Selected scrubbed year vertical marker */}
            <ReferenceLine
              x={currentYear}
              stroke="#f43f5e"
              strokeWidth={2}
              label={{
                value: `${currentYear}`,
                fill: '#f43f5e',
                fontSize: 12,
                fontWeight: 'bold',
                position: 'top'
              }}
            />

            {/* Bar columns for anomaly colors */}
            {!showRawTemp && (
              <Bar 
                dataKey="tempAnomaly" 
                opacity={0.65} 
                isAnimationActive={false}
                radius={[2, 2, 0, 0]}
              >
                {chartDataWithTrend.map((entry) => (
                  <Cell key={`cell-${entry.year}`} fill={entry.color} />
                ))}
              </Bar>
            )}

            {/* Raw Temperature Line */}
            {showRawTemp && (
              <Line
                type="monotone"
                dataKey="temp"
                name={lang === 'hu' ? 'Középhőmérséklet' : 'Mean Temperature'}
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 2, fill: '#f43f5e' }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#f43f5e', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            )}

            {/* 5-year Moving Average Line */}
            {showMovingAvg5y && (
              <Line
                type="monotone"
                dataKey={showRawTemp ? 'movingAvg5y' : (d: any) => Number((d.movingAvg5y - 10.15).toFixed(2))}
                name={lang === 'hu' ? '5 éves mozgóátlag' : '5-year Moving Average'}
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* 10-year Moving Average Line */}
            {showMovingAvg10y && (
              <Line
                type="monotone"
                dataKey={showRawTemp ? 'movingAvg10y' : (d: any) => Number((d.movingAvg10y - 10.15).toFixed(2))}
                name={lang === 'hu' ? '10 éves mozgóátlag' : '10-year Moving Average'}
                stroke="#c084fc"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Linear Trendline */}
            {showTrendline && (
              <Line
                type="linear"
                dataKey="trendline"
                name={lang === 'hu' ? 'Lineáris felmelegedési trend' : 'Warming Trendline'}
                stroke="#f43f5e"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#f43f5e]"></span>
            {lang === 'hu' ? 'Felmelegedési ráta: ~ +0.33 °C / évtized' : 'Warming rate: ~ +0.33 °C / decade'}
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-400">
            {lang === 'hu' ? 'Legmelegebb év: 2024 (12.92 °C)' : 'Warmest year: 2024 (12.92 °C)'}
          </span>
        </div>
        <span className="text-slate-500 italic">
          {lang === 'hu' ? 'Kattints bármelyik pontra az év kiválasztásához' : 'Click any year on the chart to select it'}
        </span>
      </div>
    </div>
  );
}
