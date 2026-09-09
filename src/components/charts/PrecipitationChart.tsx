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
import { YearlyClimateData, Language } from '../../types';

interface PrecipitationChartProps {
  data: YearlyClimateData[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  showDroughtOverlay: boolean;
  setShowDroughtOverlay: (val: boolean) => void;
  lang: Language;
}

export function PrecipitationChart({
  data,
  currentYear,
  onSelectYear,
  showDroughtOverlay,
  setShowDroughtOverlay,
  lang,
}: PrecipitationChartProps) {

  // Color helper for precipitation: dry years (red/amber) vs wet years (teal/cyan)
  const getPrecipColor = (val: number, year: number) => {
    if (year === currentYear) return '#f43f5e'; // Highlight active year in rose
    if (val < 450) return '#ea580c'; // Extreme dry
    if (val < 520) return '#d97706'; // Dry
    if (val < 650) return '#0284c7'; // Normal
    if (val < 800) return '#0d9488'; // Wet
    return '#059669'; // Historic flood wet (e.g. 2010)
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: YearlyClimateData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-sm font-bold font-mono text-white">{d.year}</span>
            <span className="px-2 py-0.5 rounded font-mono font-semibold bg-sky-500/20 text-sky-300">
              {d.precipitation} mm
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Eltérés a bázistól:' : 'Anomaly vs avg:'}</span>
              <span className={`font-mono font-semibold ${d.precipitationAnomalyPct >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {d.precipitationAnomalyPct >= 0 ? '+' : ''}{d.precipitationAnomalyPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'hu' ? 'Aszályindex (PAI):' : 'Drought Index (PAI):'}</span>
              <span className="font-mono font-bold text-amber-300">{d.droughtIndexPai.toFixed(1)} ({d.droughtCategory})</span>
            </div>
            {d.isRecordPrecipitation && (
              <div className="text-[11px] text-sky-300 font-semibold pt-1 border-t border-slate-800">
                🌊 {lang === 'hu' ? 'Minden idők legcsapadékosabb éve!' : 'All-time highest rainfall!'}
              </div>
            )}
            {d.isRecordDrought && (
              <div className="text-[11px] text-amber-400 font-semibold pt-1 border-t border-slate-800">
                🏜️ {lang === 'hu' ? 'Történelmi aszálykatasztrófa!' : 'Historic drought disaster!'}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white font-display">
            {lang === 'hu' ? 'Éves Csapadék és Aszályindex (1940–2025)' : 'Annual Precipitation & Drought (1940–2025)'}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'hu'
              ? 'Országos évi csapadékmennyiség (mm) és a Pálfai-féle Aszályindex (PAI)'
              : 'National annual precipitation (mm) and Pálfai Drought Index (PAI)'}
          </p>
        </div>

        <button
          onClick={() => setShowDroughtOverlay(!showDroughtOverlay)}
          className={`self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
            showDroughtOverlay
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span className="w-2.5 h-0.5 bg-amber-400"></span>
          {lang === 'hu' ? 'Aszályindex (PAI) vonal' : 'Drought Index Line'}
        </button>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload[0]) {
                onSelectYear(e.activePayload[0].payload.year);
              }
            }}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} minTickGap={25} />
            <YAxis 
              yAxisId="precip" 
              stroke="#94a3b8" 
              fontSize={11} 
              domain={[300, 1050]} 
              tickFormatter={(v) => `${v}mm`}
              tickLine={false} 
            />
            
            {showDroughtOverlay && (
              <YAxis 
                yAxisId="pai" 
                orientation="right" 
                stroke="#f59e0b" 
                fontSize={10} 
                domain={[0, 10]} 
                tickFormatter={(v) => `${v} PAI`}
                tickLine={false} 
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* Average baseline 595 mm */}
            <ReferenceLine
              yAxisId="precip"
              y={595}
              stroke="#64748b"
              strokeDasharray="3 3"
              label={{ value: 'Átlag: 595 mm', fill: '#94a3b8', fontSize: 10, position: 'insideTopLeft' }}
            />

            {/* Severe drought line 450 mm */}
            <ReferenceLine
              yAxisId="precip"
              y={450}
              stroke="#ea580c"
              strokeDasharray="2 2"
              label={{ value: 'Aszály <450 mm', fill: '#ea580c', fontSize: 9, position: 'insideBottomLeft' }}
            />

            {/* Current year indicator line */}
            <ReferenceLine yAxisId="precip" x={currentYear} stroke="#f43f5e" strokeWidth={2} />

            <Bar yAxisId="precip" dataKey="precipitation" isAnimationActive={false} radius={[2, 2, 0, 0]}>
              {data.map((entry) => (
                <Cell key={`bar-${entry.year}`} fill={getPrecipColor(entry.precipitation, entry.year)} />
              ))}
            </Bar>

            {showDroughtOverlay && (
              <Line
                yAxisId="pai"
                type="monotone"
                dataKey="droughtIndexPai"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ea580c]"></span>
            {lang === 'hu' ? 'Aszályos év (<450mm)' : 'Drought (<450mm)'}
          </span>
          <span className="flex items-center gap-1 ml-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#059669]"></span>
            {lang === 'hu' ? 'Kifejezetten csapadékos (>700mm)' : 'Very Wet (>700mm)'}
          </span>
        </div>
        <span className="text-slate-400">
          {lang === 'hu' ? '2022: 448 mm (Aszálykatasztrófa) | 2010: 959 mm (Árvízi rekord)' : '2022: 448mm (Historic drought) | 2010: 959mm (Record floods)'}
        </span>
      </div>
    </div>
  );
}
