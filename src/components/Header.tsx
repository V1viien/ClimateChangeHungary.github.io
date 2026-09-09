import React, { useState, useRef } from 'react';
import { 
  BarChart3, 
  Download, 
  Upload, 
  Info, 
  MapPin, 
  Sparkles,
  RefreshCw,
  Globe2,
  FileText
} from 'lucide-react';
import { YearlyClimateData, Language } from '../types';
import { downloadDatasetAsCsv, parseClimateCsv } from '../utils/csvLoader';

interface HeaderProps {
  data: YearlyClimateData[];
  onDataLoaded: (newData: YearlyClimateData[]) => void;
  onResetData: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenInfo: () => void;
  onOpenMap: () => void;
}

export function Header({
  data,
  onDataLoaded,
  onResetData,
  lang,
  onToggleLang,
  onOpenInfo,
  onOpenMap
}: HeaderProps) {
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].year) {
            onDataLoaded(parsed);
            setUploadSuccess(lang === 'hu' ? 'JSON adatsor sikeresen betöltve!' : 'JSON dataset successfully loaded!');
            setTimeout(() => setUploadSuccess(null), 4000);
          }
        } else {
          const parsedPartial = parseClimateCsv(text);
          if (parsedPartial.length > 0) {
            // Merge with existing base data or create dataset
            const merged: YearlyClimateData[] = parsedPartial.map((row) => {
              const existing = data.find(d => d.year === row.year) || data[0];
              const temp = row.temp !== undefined ? row.temp : existing.temp;
              return {
                ...existing,
                ...row,
                year: row.year!,
                temp,
                tempAnomaly: Number((temp - 10.15).toFixed(2)),
              };
            }) as YearlyClimateData[];
            
            merged.sort((a, b) => a.year - b.year);
            onDataLoaded(merged);
            setUploadSuccess(lang === 'hu' ? 'CSV adatsor sikeresen betöltve!' : 'CSV dataset loaded successfully!');
            setTimeout(() => setUploadSuccess(null), 4000);
          }
        }
      } catch (err) {
        alert(lang === 'hu' ? 'Hiba történt a fájl feldolgozása közben.' : 'Error processing data file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-amber-500 to-rose-600 p-0.5 shadow-lg shadow-rose-950/40">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              {/* Hungary SVG Silhouette icon */}
              <svg viewBox="0 0 100 65" className="w-8 h-6 fill-rose-500 stroke-amber-300 stroke-[1.5]">
                <path d="M 8,28 Q 18,12 36,14 T 68,10 T 92,20 Q 94,36 82,48 T 56,58 T 32,56 Q 16,58 10,42 Z" />
              </svg>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                {lang === 'hu' ? 'Hungary Climate Explorer' : 'Hungary Climate Explorer'}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                1940–2026 (szept.)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'hu' 
                ? 'Magyarország éghajlatváltozása és meteorológiai szélsőségei' 
                : 'Climate change and extreme weather time series in Hungary'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Hungary Map & Regions Button */}
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
            title={lang === 'hu' ? 'Magyarországi mérőállomások és régiók' : 'Hungarian weather stations and regional map'}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'hu' ? 'Állomások & Térkép' : 'Stations & Map'}</span>
          </button>

          {/* Info Modal Button */}
          <button
            onClick={onOpenInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
            title={lang === 'hu' ? 'Módszertan, források és CSV csere útmutató' : 'Methodology, sources and CSV swap instructions'}
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hu' ? 'Adatforrások & Info' : 'Data Sources & Info'}</span>
          </button>

          {/* CSV Download Button */}
          <button
            onClick={() => downloadDatasetAsCsv(data)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title={lang === 'hu' ? 'Adatkészlet letöltése CSV formátumban' : 'Download dataset as CSV'}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'hu' ? 'CSV letöltés' : 'Export CSV'}</span>
          </button>

          {/* CSV/JSON Custom Upload Button */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{lang === 'hu' ? 'Egyéni CSV' : 'Upload CSV'}</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv,.json" 
              onChange={handleFileUpload}
              className="hidden" 
            />
          </label>

          {/* Reset button if custom data is loaded */}
          <button
            onClick={onResetData}
            className="flex items-center gap-1 p-1.5 text-xs font-medium rounded-lg bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            title={lang === 'hu' ? 'Alapértelmezett HungaroMet adatok visszaállítása' : 'Reset to default HungaroMet data'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'hu' ? 'EN' : 'HU'}</span>
          </button>
        </div>

      </div>

      {uploadSuccess && (
        <div className="bg-emerald-900/80 border-t border-b border-emerald-600/50 py-1.5 px-4 text-center text-xs text-emerald-200 font-medium">
          ✓ {uploadSuccess}
        </div>
      )}
    </header>
  );
}
