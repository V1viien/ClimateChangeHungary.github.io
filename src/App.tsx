import { useState } from 'react';
import { useClimateData } from './hooks/useClimateData';
import { Header } from './components/Header';
import { IntroBanner } from './components/IntroBanner';
import { WarmingStripes } from './components/WarmingStripes';
import { TimelineControls } from './components/TimelineControls';
import { SummaryCards } from './components/SummaryCards';
import { MainTempChart } from './components/charts/MainTempChart';
import { PrecipitationChart } from './components/charts/PrecipitationChart';
import { ExtremeDaysChart } from './components/charts/ExtremeDaysChart';
import { FrostDaysChart } from './components/charts/FrostDaysChart';
import { DecadeComparisonChart } from './components/charts/DecadeComparisonChart';
import { SeasonalShiftChart } from './components/charts/SeasonalShiftChart';
import { MonthlyDetailChart } from './components/charts/MonthlyDetailChart';
import { HungaryMapModal } from './components/HungaryMapModal';
import { InfoModal } from './components/InfoModal';
import { Language } from './types';
import { 
  BarChart3, 
  Flame, 
  MapPin, 
  Info, 
  Calendar, 
  Compass, 
  Globe2, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('hu');
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  const {
    data,
    currentYear,
    currentData,
    minYear,
    maxYear,
    isPlaying,
    playSpeed,
    selectYear,
    togglePlay,
    stepYear,
    changeSpeed,
    isRangeMode,
    toggleRangeMode,
    rangeStart,
    rangeEnd,
    changeRangeStart,
    changeRangeEnd,
    compareStart,
    compareEnd,
    changeCompareStart,
    changeCompareEnd,
    rangeAStats,
    rangeBStats,
    records,
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
    showDroughtOverlay,
    setShowDroughtOverlay,
    loadCustomData,
    resetToDefaultData,
  } = useClimateData();

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'hu' ? 'en' : 'hu'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* 1. App Header */}
      <Header
        data={data}
        onDataLoaded={loadCustomData}
        onResetData={resetToDefaultData}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
      />

      {/* 2. Intro Banner with Source Badges & Quick Insights */}
      <IntroBanner lang={lang} onOpenInfo={() => setIsInfoOpen(true)} />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Warming Stripes visual barcode (1940-2025) */}
        <WarmingStripes
          data={data}
          currentYear={currentYear}
          onSelectYear={selectYear}
          lang={lang}
        />

        {/* Interactive Playback & Scrubbing Controls */}
        <TimelineControls
          currentYear={currentYear}
          minYear={minYear}
          maxYear={maxYear}
          isPlaying={isPlaying}
          playSpeed={playSpeed}
          onSelectYear={selectYear}
          onTogglePlay={togglePlay}
          onStepYear={stepYear}
          onChangeSpeed={changeSpeed}
          isRangeMode={isRangeMode}
          onToggleRangeMode={toggleRangeMode}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onChangeRangeStart={changeRangeStart}
          onChangeRangeEnd={changeRangeEnd}
          compareStart={compareStart}
          compareEnd={compareEnd}
          onChangeCompareStart={changeCompareStart}
          onChangeCompareEnd={changeCompareEnd}
          lang={lang}
        />

        {/* Live Updating Summary Stat Cards */}
        <SummaryCards
          currentData={currentData}
          isRangeMode={isRangeMode}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          compareStart={compareStart}
          compareEnd={compareEnd}
          rangeAStats={rangeAStats}
          rangeBStats={rangeBStats}
          records={records}
          lang={lang}
        />

        {/* Main Temperature & Anomaly Chart */}
        <MainTempChart
          data={data}
          currentYear={currentYear}
          onSelectYear={selectYear}
          showRawTemp={showRawTemp}
          setShowRawTemp={setShowRawTemp}
          showAnomaly={showAnomaly}
          setShowAnomaly={setShowAnomaly}
          showMovingAvg5y={showMovingAvg5y}
          setShowMovingAvg5y={setShowMovingAvg5y}
          showMovingAvg10y={showMovingAvg10y}
          setShowMovingAvg10y={setShowMovingAvg10y}
          showTrendline={showTrendline}
          setShowTrendline={setShowTrendline}
          lang={lang}
        />

        {/* Two-Column Grid: Precipitation & Extreme Heat Days */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PrecipitationChart
            data={data}
            currentYear={currentYear}
            onSelectYear={selectYear}
            showDroughtOverlay={showDroughtOverlay}
            setShowDroughtOverlay={setShowDroughtOverlay}
            lang={lang}
          />

          <ExtremeDaysChart
            data={data}
            currentYear={currentYear}
            onSelectYear={selectYear}
            lang={lang}
          />
        </div>

        {/* Two-Column Grid: Frost Days & Seasonal Shift */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FrostDaysChart
            data={data}
            currentYear={currentYear}
            onSelectYear={selectYear}
            lang={lang}
          />

          <SeasonalShiftChart
            data={data}
            currentYear={currentYear}
            onSelectYear={selectYear}
            lang={lang}
          />
        </div>

        {/* Full-Width Decadal Comparison */}
        <DecadeComparisonChart lang={lang} />

        {/* Monthly Breakdown View extending up to 2026-09 */}
        <MonthlyDetailChart lang={lang} />

        {/* Regional Quick Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">
                {lang === 'hu' ? 'Szeretnéd látni a regionális különbségeket?' : 'Explore Regional Disparities Across Hungary'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'hu' 
                  ? 'Kattints az interaktív térképre Budapest, Szeged, Debrecen, Pécs és Kékestető állomások adatainak megtekintéséhez.' 
                  : 'View station time-series for Budapest, Szeged, Debrecen, Pécs, Szombathely and Kékestető.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMapOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40 transition-all cursor-pointer flex-shrink-0"
          >
            {lang === 'hu' ? 'Térkép Megnyitása' : 'Open Station Map'}
          </button>
        </div>

      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-slate-400 font-medium">
              Hungary Climate Explorer • 1940–2025
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'hu' 
                ? 'Adatforrások: HungaroMet Zrt. (OMSZ), Központi Statisztikai Hivatal (KSH), ECA&D, NOAA Mauna Loa CO₂'
                : 'Data Sources: HungaroMet (OMSZ), Hungarian Central Statistical Office (KSH), ECA&D, NOAA Mauna Loa'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {lang === 'hu' ? 'Módszertan & CSV útmutató' : 'Methodology & CSV guide'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsMapOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {lang === 'hu' ? 'Állomástérkép' : 'Station Map'}
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <HungaryMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        lang={lang}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        lang={lang}
      />
    </div>
  );
}
