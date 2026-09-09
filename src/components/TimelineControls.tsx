import { useState } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  SlidersHorizontal,
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';
import { Language } from '../types';

interface TimelineControlsProps {
  currentYear: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  playSpeed: number;
  onSelectYear: (year: number) => void;
  onTogglePlay: () => void;
  onStepYear: (delta: number) => void;
  onChangeSpeed: (speed: number) => void;
  isRangeMode: boolean;
  onToggleRangeMode: () => void;
  rangeStart: number;
  rangeEnd: number;
  onChangeRangeStart: (val: number) => void;
  onChangeRangeEnd: (val: number) => void;
  compareStart: number;
  compareEnd: number;
  onChangeCompareStart: (val: number) => void;
  onChangeCompareEnd: (val: number) => void;
  lang: Language;
}

export function TimelineControls({
  currentYear,
  minYear,
  maxYear,
  isPlaying,
  playSpeed,
  onSelectYear,
  onTogglePlay,
  onStepYear,
  onChangeSpeed,
  isRangeMode,
  onToggleRangeMode,
  rangeStart,
  rangeEnd,
  onChangeRangeStart,
  onChangeRangeEnd,
  compareStart,
  compareEnd,
  onChangeCompareStart,
  onChangeCompareEnd,
  lang,
}: TimelineControlsProps) {

  // Milestones for quick jump
  const milestones = [
    { year: 1940, label: '1940 (Bázis)' },
    { year: 1963, label: '1963 (Jeges tél)' },
    { year: 1987, label: '1987 (Hóvihar)' },
    { year: 2000, label: '2000 (Millennium)' },
    { year: 2010, label: '2010 (Rekord eső)' },
    { year: 2022, label: '2022 (Aszály)' },
    { year: 2024, label: '2024 (Melegrekord)' },
    { year: 2026, label: '2026 (2026.09)' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top row: Mode toggle + Playback controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        
        {/* Play / Step controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-xl text-white font-medium transition-all shadow-md cursor-pointer ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30' 
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
            }`}
            title={isPlaying ? (lang === 'hu' ? 'Megállítás' : 'Pause') : (lang === 'hu' ? 'Lejátszás' : 'Play animation')}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Step backwards */}
          <button
            onClick={() => onStepYear(-1)}
            disabled={currentYear <= minYear}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700/60 transition-colors cursor-pointer"
            title={lang === 'hu' ? 'Előző év (-1 év)' : 'Previous year (-1)'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Step forwards */}
          <button
            onClick={() => onStepYear(1)}
            disabled={currentYear >= maxYear}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700/60 transition-colors cursor-pointer"
            title={lang === 'hu' ? 'Következő év (+1 év)' : 'Next year (+1)'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Current Year Display Badge */}
          <div className="ml-2 flex items-baseline gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              {lang === 'hu' ? 'Kiválasztott év:' : 'Active Year:'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
              {currentYear}
            </span>
          </div>

          {/* Speed options */}
          <div className="hidden md:flex items-center gap-1 ml-2 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60 text-xs">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  playSpeed === spd
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* View mode toggle: Single Year vs Range comparison */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onToggleRangeMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isRangeMode
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>
              {isRangeMode
                ? (lang === 'hu' ? 'Összehasonlító Mód Aktív' : 'Range Compare Mode')
                : (lang === 'hu' ? 'Időszakok Összehasonlítása' : 'Compare Two Periods')}
            </span>
          </button>
        </div>

      </div>

      {/* Main Single Year Slider */}
      {!isRangeMode ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>{minYear}</span>
            <span className="text-slate-500 hidden sm:inline">
              {lang === 'hu' ? 'Húzd a csúszkát az időutazáshoz' : 'Scrub slider to explore timeline'}
            </span>
            <span>{maxYear}</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={minYear}
              max={maxYear}
              step={1}
              value={currentYear}
              onChange={(e) => onSelectYear(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer focus:outline-none"
            />
          </div>

          {/* Quick jump milestone tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {lang === 'hu' ? 'Főbb fordulópontok:' : 'Milestones:'}
            </span>
            {milestones.map((m) => (
              <button
                key={m.year}
                onClick={() => onSelectYear(m.year)}
                className={`text-[11px] px-2 py-0.5 rounded transition-all cursor-pointer ${
                  currentYear === m.year
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Period Range Selector Mode */
        <div className="bg-slate-800/40 p-3.5 rounded-lg border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-medium">
            <span>{lang === 'hu' ? 'Két történelmi időszak összehasonlítása' : 'Compare two historical periods side-by-side'}</span>
            <button
              onClick={onToggleRangeMode}
              className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              {lang === 'hu' ? 'Vissza egyéni évhez' : 'Back to single year'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Period A */}
            <div className="bg-slate-800/80 p-3 rounded-lg border border-sky-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sky-400">{lang === 'hu' ? 'A) Referencia időszak:' : 'A) Baseline Period:'}</span>
                <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                  {rangeStart} – {rangeEnd}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={minYear}
                  max={rangeEnd - 1}
                  value={rangeStart}
                  onChange={(e) => onChangeRangeStart(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={rangeStart + 1}
                  max={maxYear}
                  value={rangeEnd}
                  onChange={(e) => onChangeRangeEnd(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Period B */}
            <div className="bg-slate-800/80 p-3 rounded-lg border border-rose-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-rose-400">{lang === 'hu' ? 'B) Közelmúlt / Jelen:' : 'B) Recent Period:'}</span>
                <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                  {compareStart} – {compareEnd}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={minYear}
                  max={compareEnd - 1}
                  value={compareStart}
                  onChange={(e) => onChangeCompareStart(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={compareStart + 1}
                  max={maxYear}
                  value={compareEnd}
                  onChange={(e) => onChangeCompareEnd(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
