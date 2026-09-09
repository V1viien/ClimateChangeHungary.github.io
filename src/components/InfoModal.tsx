import { X, Database, FileSpreadsheet, ShieldCheck, Download, Code2, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function InfoModal({ isOpen, onClose, lang }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {lang === 'hu' ? 'Adatforrások, Módszertan és CSV Csere' : 'Data Sources, Methodology & CSV Swapping'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hu' ? 'Hungary Climate Explorer dokumentáció és adatszerkezet' : 'Documentation and dataset structure guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          
          {/* Section 1: Overview */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'hu' ? '1. Az Alkalmazás Célja és Bázisidőszaka' : '1. Purpose & Baseline Period'}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'hu' ? (
                <>
                  A <strong>Hungary Climate Explorer</strong> célja Magyarország éghajlatváltozásának és növekvő időjárási szélsőségeinek bemutatása 1940-től napjainkig (2026.09). Az anomáliák viszonyítási alapja a <strong>1940–1949 közötti évtized átlaga (10.15 °C)</strong>. Az elmúlt 86 évben Magyarország évi középhőmérséklete több mint <strong>+2.7 °C-kal</strong> emelkedett, ami meghaladja a globális átlagos melegedési ütemet a Kárpát-medence zártsága és kontinentalitása miatt.
                </>
              ) : (
                <>
                  The <strong>Hungary Climate Explorer</strong> visualizes long-term climate trends and escalating extreme events in Hungary from 1940 to September 2026. Anomalies are computed against the <strong>1940–1949 decadal baseline (10.15 °C)</strong>. Over the last 86 years, Hungary's annual mean temperature has surged by over <strong>+2.7 °C</strong>, warming faster than the global average due to the enclosed Carpathian Basin geography.
                </>
              )}
            </p>
          </div>

          {/* Section 2: Data Sources & Verified vs Approximated */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              {lang === 'hu' ? '2. Adatforrások és Megbízhatósági Szintek' : '2. Data Sources & Verification Levels'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-emerald-500/30">
                <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                  ✓ {lang === 'hu' ? 'Hitelesített Hivatalos Adatok' : 'Verified Official Datasets'}
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>HungaroMet Zrt. (korábban OMSZ)</strong>: Éves és évszakos középhőmérsékletek, évi csapadékösszegek (1901–2024).</li>
                  <li><strong>KSH (Központi Statisztikai Hivatal)</strong>: Időjárási szélsőségek, aszálykárok, hőhullámok.</li>
                  <li><strong>ECA&D (European Climate Assessment & Dataset)</strong>: Magyar mérőállomások (Budapest, Szeged, Debrecen, Pécs, Szombathely).</li>
                  <li><strong>NOAA Global Monitoring Lab</strong>: Légköri CO₂ koncentráció (Mauna Loa bázis).</li>
                </ul>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-amber-500/30">
                <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                  ⚡ {lang === 'hu' ? 'Reprezentatív / Becsült Mutatók' : 'Representative / Reconstructed Indicators'}
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>Pálfai-féle Aszályindex (PAI)</strong>: Súlyozott hőmérsékleti és csapadékeloszlási modellezés.</li>
                  <li><strong>Tokaji Szüret Dátuma</strong>: Agrárfenológiai rekonstrukció a nyári hőösszegek alapján (a korábbra tolódás reprezentációja).</li>
                  <li><strong>Duna Nyári Vízállása (Bp)</strong>: OVF kisvízi trendekkel kalibrált rekonstrukció.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: How to swap in real CSV/JSON data */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              {lang === 'hu' ? '3. Saját CSV vagy JSON Adatsor Betöltése' : '3. How to Swap in Custom CSV/JSON Data'}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'hu' 
                ? 'Az alkalmazás fejlécében található "Egyéni CSV" gombbal közvetlenül betölthetsz saját mérési adatokat. A CSV fájl fejlécében az alábbi oszlopneveket érdemes használni:' 
                : 'You can upload your own research or station CSV file using the "Upload CSV" button in the header. Recommended CSV header columns:'}
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto text-sky-300">
              year,temp,tempAnomaly,precipitation,heatWaveDays,tropicalNights,frostDays,co2Ppm
            </div>

            <div className="text-xs text-slate-400">
              {lang === 'hu' ? (
                <>
                  Példa sor: <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">2024,12.92,2.77,535,51,26,48,422.8</code>
                  <br />
                  A projekt <code className="text-amber-400">/data/</code> és <code className="text-amber-400">/public/data/</code> mappájában megtalálhatók a kész CSV és JSON fájlok, melyek tetszés szerint szerkeszthetők vagy felülírhatók.
                </>
              ) : (
                <>
                  Sample row: <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">2024,12.92,2.77,535,51,26,48,422.8</code>
                  <br />
                  Full bundled files are available in <code className="text-amber-400">/data/</code> and <code className="text-amber-400">/public/data/</code> for direct modification.
                </>
              )}
            </div>
          </div>

          {/* Direct Download Bundles */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            <a
              href="/data/hungary_climate_yearly_1940_2025.csv"
              download="hungary_climate_yearly_1940_2025.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>hungary_climate_yearly_1940_2025.csv</span>
            </a>
            <a
              href="/data/hungary_climate_decades.csv"
              download="hungary_climate_decades.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>hungary_climate_decades.csv</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'hu' ? 'Értem, bezárás' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
