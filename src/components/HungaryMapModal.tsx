import { useState } from 'react';
import { X, MapPin, Thermometer, SunMedium, CloudRain, Mountain, Building2, Compass } from 'lucide-react';
import { REGIONAL_STATIONS } from '../data/climateData';
import { RegionalStationData, Language } from '../types';

interface HungaryMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function HungaryMapModal({ isOpen, onClose, lang }: HungaryMapModalProps) {
  const [selectedStation, setSelectedStation] = useState<RegionalStationData>(REGIONAL_STATIONS[0]);

  if (!isOpen) return null;

  // Map coordinates projection helper to SVG 0..600 x 0..380
  // Hungary bounds approx: Lat 45.7 - 48.6, Lng 16.1 - 22.9
  const projectCoords = (lat: number, lng: number) => {
    const minLng = 16.0;
    const maxLng = 23.0;
    const minLat = 45.6;
    const maxLat = 48.7;

    const x = ((lng - minLng) / (maxLng - minLng)) * 520 + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 300 + 35;
    return { x, y };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {lang === 'hu' ? 'Magyarország Regionális Klímatérképe' : 'Regional Climate Map of Hungary'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hu' 
                  ? 'Főbb meteorológiai állomások és területi felmelegedési mintázatok' 
                  : 'Key meteorological stations and geographic warming patterns'}
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Interactive SVG Map of Hungary */}
          <div className="relative bg-slate-950/90 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            
            <svg 
              viewBox="0 0 600 380" 
              className="w-full max-w-2xl h-auto drop-shadow-md select-none"
            >
              <defs>
                <linearGradient id="huGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Stylized accurate silhouette path of Hungary */}
              <path
                d="M 65,115 
                   C 105,95 160,110 200,80 
                   C 240,65 300,50 350,55 
                   C 400,60 460,80 495,100
                   C 540,120 560,165 540,195
                   C 515,225 480,270 450,290
                   C 400,315 340,320 290,325
                   C 230,330 180,310 140,300
                   C 95,290 60,250 50,210
                   C 45,170 50,135 65,115 Z"
                fill="url(#huGradient)"
                stroke="#475569"
                strokeWidth="2.5"
              />

              {/* Danube River Path (Duna folyó) */}
              <path
                d="M 180,105 Q 260,115 285,150 T 290,260 Q 295,310 290,325"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeOpacity="0.7"
                strokeDasharray="4 2"
              />

              {/* Tisza River Path (Tisza folyó) */}
              <path
                d="M 500,110 Q 460,170 435,210 T 390,280 Q 380,310 380,325"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeDasharray="4 2"
              />

              {/* Lake Balaton (Balaton) */}
              <path
                d="M 170,225 Q 205,210 235,200 Q 240,208 215,222 Q 185,232 170,225 Z"
                fill="#0369a1"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              {/* River and Lake Labels */}
              <text x="265" y="130" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.8">Duna</text>
              <text x="445" y="170" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.8">Tisza</text>
              <text x="185" y="212" fill="#7dd3fc" fontSize="9" fontWeight="bold">Balaton</text>

              {/* Station Markers */}
              {REGIONAL_STATIONS.map((station) => {
                const { x, y } = projectCoords(station.lat, station.lng);
                const isSelected = selectedStation.id === station.id;

                return (
                  <g 
                    key={station.id} 
                    onClick={() => setSelectedStation(station)}
                    className="cursor-pointer group"
                  >
                    {/* Ripple on selected */}
                    {isSelected && (
                      <circle cx={x} cy={y} r="14" fill="#f43f5e" opacity="0.35" className="animate-ping" />
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "9" : "6"}
                      fill={isSelected ? "#f43f5e" : "#fbbf24"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      filter="url(#glow)"
                      className="transition-all group-hover:r-8"
                    />

                    {/* Station Name Label */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fill={isSelected ? "#ffffff" : "#cbd5e1"}
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight={isSelected ? "bold" : "normal"}
                      className="transition-all select-none"
                    >
                      {station.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              {lang === 'hu' ? 'Kattints a sárga/piros pontokra a részletekért' : 'Click markers for regional statistics'}
            </div>
          </div>

          {/* Selected Station Detailed Information Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3 mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold">
                  {selectedStation.region}
                </span>
                <h3 className="text-xl font-bold text-white font-display">
                  {selectedStation.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedStation.lat.toFixed(2)}° É, {selectedStation.lng.toFixed(2)}° K • Tengerszint feletti magasság: {selectedStation.elevationM} m
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                <Thermometer className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="text-[10px] text-slate-400 leading-none">{lang === 'hu' ? 'Felmelegedés mértéke' : 'Warming Delta'}</div>
                  <div className="text-lg font-bold font-mono text-rose-400 leading-tight">
                    +{selectedStation.tempChange.toFixed(1)} °C
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400">{lang === 'hu' ? '1940-es évek átlaga:' : '1940s Average:'}</span>
                <div className="text-base font-bold font-mono text-white mt-0.5">
                  {selectedStation.avgTemp1940s.toFixed(1)} °C
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400">{lang === 'hu' ? '2020-as évek átlaga:' : '2020s Average:'}</span>
                <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  {selectedStation.avgTemp2020s.toFixed(1)} °C
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400">{lang === 'hu' ? 'Hőségnapok (2020s):' : 'Heat Days (2020s):'}</span>
                <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                  {selectedStation.heatWaveDays2020s} nap/év
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400">{lang === 'hu' ? 'Trópusi éjszakák:' : 'Tropical Nights:'}</span>
                <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  {selectedStation.tropicalNights2020s} nap/év
                </div>
              </div>
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              {selectedStation.description}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'hu' ? 'Bezárás' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
