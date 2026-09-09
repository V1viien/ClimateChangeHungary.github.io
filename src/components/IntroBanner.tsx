import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Database, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface IntroBannerProps {
  lang: Language;
  onOpenInfo: () => void;
}

export function IntroBanner({ lang, onOpenInfo }: IntroBannerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border-b border-slate-800 text-slate-300 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-start gap-2.5">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5 flex-shrink-0">
              <Flame className="w-4 h-4 text-amber-400" />
            </span>
            <div>
              <p className="font-medium text-slate-200">
                {lang === 'hu' ? (
                  <>
                    <span className="text-white font-semibold">Magyarország klímája az elmúlt 85 évben:</span> az évi középhőmérséklet <span className="text-rose-400 font-bold">+2.77 °C-kal</span> emelkedett az 1940-es évek bázisához képest.
                  </>
                ) : (
                  <>
                    <span className="text-white font-semibold">Hungary's climate over the past 85 years:</span> annual mean temperature has risen by <span className="text-rose-400 font-bold">+2.77 °C</span> compared to the 1940s baseline.
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'hu' ? 'Hivatalos HungaroMet / OMSZ & KSH bázis' : 'Official HungaroMet & KSH base data'}
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span>{lang === 'hu' ? 'Bázisidőszak: 1940–1949 (10.15 °C)' : 'Baseline: 1940–1949 (10.15 °C)'}</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <button 
                  onClick={onOpenInfo}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
                >
                  {lang === 'hu' ? 'Források & séma részletei' : 'Sources & schema details'}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-end md:self-center flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? (lang === 'hu' ? 'Kevesebb' : 'Less') : (lang === 'hu' ? 'Módszertani áttekintés' : 'Methodology overview')}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'hu' ? 'Hitelesített sorozatok' : 'Verified Series'}
              </div>
              <p>
                {lang === 'hu'
                  ? 'Éves középhőmérséklet, évszakos átlagok és évi csapadékösszegek az OMSZ / HungaroMet publikált mérési adatai alapján.'
                  : 'Annual mean temperature, seasonal averages and rainfall based on published Hungarian Meteorological Service observations.'}
              </p>
            </div>

            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                {lang === 'hu' ? 'Extrém napok és indexek' : 'Extreme Days & Indices'}
              </div>
              <p>
                {lang === 'hu'
                  ? 'Hőségnapok (≥30 °C), trópusi éjszakák (≥20 °C) és fagyos napok (<0 °C) országos hálózati trendjei, valamint Pálfai-féle aszályindex (PAI).'
                  : 'Heatwave days (≥30 °C), tropical nights (≥20 °C), and frost days (<0 °C) trendlines, with Pálfai drought indices.'}
              </p>
            </div>

            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'hu' ? 'Bónusz agrár & folyó adatok' : 'Bonus Agro & River Data'}
              </div>
              <p>
                {lang === 'hu'
                  ? 'Tokaji/balatoni szüreti naptár és a Duna vízállási anomáliák reprezentatív rekonstrukciók. Könnyen lecserélhetők saját CSV fájlokra.'
                  : 'Grape harvest dates & Danube water levels are representative reconstructions, fully replaceable with custom CSVs.'}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
