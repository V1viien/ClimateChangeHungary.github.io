import { useState, useEffect, useRef, useMemo } from 'react';
import { YearlyClimateData } from '../types';
import { HUNGARY_CLIMATE_DATA } from '../data/climateData';

export function useClimateData() {
  const [data, setData] = useState<YearlyClimateData[]>(HUNGARY_CLIMATE_DATA);
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 0.5x, 1x, 2x, 4x
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<number>(1940);
  const [rangeEnd, setRangeEnd] = useState<number>(1970);
  const [compareStart, setCompareStart] = useState<number>(1995);
  const [compareEnd, setCompareEnd] = useState<number>(2026);

  // Active chart series toggles
  const [showRawTemp, setShowRawTemp] = useState<boolean>(false);
  const [showAnomaly, setShowAnomaly] = useState<boolean>(true);
  const [showMovingAvg5y, setShowMovingAvg5y] = useState<boolean>(true);
  const [showMovingAvg10y, setShowMovingAvg10y] = useState<boolean>(false);
  const [showTrendline, setShowTrendline] = useState<boolean>(true);
  const [showDroughtOverlay, setShowDroughtOverlay] = useState<boolean>(true);

  const timerRef = useRef<number | null>(null);

  const minYear = data.length > 0 ? data[0].year : 1940;
  const maxYear = data.length > 0 ? data[data.length - 1].year : 2025;

  // Selected year data point
  const currentDataPoint = useMemo(() => {
    return data.find(d => d.year === currentYear) || data[data.length - 1];
  }, [data, currentYear]);

  // Sliced data up to current year (for progressive playback) or all data with highlight
  const dataUpToCurrentYear = useMemo(() => {
    return data.filter(d => d.year <= currentYear);
  }, [data, currentYear]);

  // Range A data & stats
  const rangeAData = useMemo(() => {
    return data.filter(d => d.year >= rangeStart && d.year <= rangeEnd);
  }, [data, rangeStart, rangeEnd]);

  // Range B (Comparison) data & stats
  const rangeBData = useMemo(() => {
    return data.filter(d => d.year >= compareStart && d.year <= compareEnd);
  }, [data, compareStart, compareEnd]);

  // Range A aggregates
  const rangeAStats = useMemo(() => {
    if (rangeAData.length === 0) return null;
    const avgTemp = rangeAData.reduce((acc, d) => acc + d.temp, 0) / rangeAData.length;
    const avgPrecip = rangeAData.reduce((acc, d) => acc + d.precipitation, 0) / rangeAData.length;
    const avgHeat = rangeAData.reduce((acc, d) => acc + d.heatWaveDays, 0) / rangeAData.length;
    const avgTropical = rangeAData.reduce((acc, d) => acc + d.tropicalNights, 0) / rangeAData.length;
    const avgFrost = rangeAData.reduce((acc, d) => acc + d.frostDays, 0) / rangeAData.length;
    return { avgTemp, avgPrecip, avgHeat, avgTropical, avgFrost };
  }, [rangeAData]);

  // Range B aggregates
  const rangeBStats = useMemo(() => {
    if (rangeBData.length === 0) return null;
    const avgTemp = rangeBData.reduce((acc, d) => acc + d.temp, 0) / rangeBData.length;
    const avgPrecip = rangeBData.reduce((acc, d) => acc + d.precipitation, 0) / rangeBData.length;
    const avgHeat = rangeBData.reduce((acc, d) => acc + d.heatWaveDays, 0) / rangeBData.length;
    const avgTropical = rangeBData.reduce((acc, d) => acc + d.tropicalNights, 0) / rangeBData.length;
    const avgFrost = rangeBData.reduce((acc, d) => acc + d.frostDays, 0) / rangeBData.length;
    return { avgTemp, avgPrecip, avgHeat, avgTropical, avgFrost };
  }, [rangeBData]);

  // All-time records in dataset
  const records = useMemo(() => {
    let hottest = data[0];
    let coldest = data[0];
    let driest = data[0];
    let wettest = data[0];
    let mostHeatDays = data[0];
    let mostFrostDays = data[0];

    data.forEach(d => {
      if (d.temp > hottest.temp) hottest = d;
      if (d.temp < coldest.temp) coldest = d;
      if (d.precipitation < driest.precipitation) driest = d;
      if (d.precipitation > wettest.precipitation) wettest = d;
      if (d.heatWaveDays > mostHeatDays.heatWaveDays) mostHeatDays = d;
      if (d.frostDays > mostFrostDays.frostDays) mostFrostDays = d;
    });

    return { hottest, coldest, driest, wettest, mostHeatDays, mostFrostDays };
  }, [data]);

  // Handle Play / Pause animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(80, Math.floor(400 / playSpeed));
    timerRef.current = window.setInterval(() => {
      setCurrentYear(prev => {
        if (prev >= maxYear) {
          setIsPlaying(false);
          return maxYear;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed, maxYear]);

  const togglePlay = () => {
    if (currentYear >= maxYear) {
      setCurrentYear(minYear);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const stepYear = (delta: number) => {
    setIsPlaying(false);
    setCurrentYear(prev => Math.min(maxYear, Math.max(minYear, prev + delta)));
  };

  const resetData = () => {
    setData(HUNGARY_CLIMATE_DATA);
    setCurrentYear(2024);
    setIsPlaying(false);
  };

  return {
    data,
    setData,
    currentYear,
    setCurrentYear,
    currentDataPoint,
    dataUpToCurrentYear,
    minYear,
    maxYear,
    isPlaying,
    setIsPlaying,
    playSpeed,
    setPlaySpeed,
    togglePlay,
    stepYear,
    isRangeMode,
    setIsRangeMode,
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    compareStart,
    setCompareStart,
    compareEnd,
    setCompareEnd,
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
    currentData: currentDataPoint,
    selectYear: (year: number) => {
      setIsPlaying(false);
      setCurrentYear(year);
    },
    changeSpeed: setPlaySpeed,
    toggleRangeMode: () => setIsRangeMode(prev => !prev),
    changeRangeStart: setRangeStart,
    changeRangeEnd: setRangeEnd,
    changeCompareStart: setCompareStart,
    changeCompareEnd: setCompareEnd,
    loadCustomData: (newData: YearlyClimateData[]) => {
      setData(newData);
      if (newData.length > 0) {
        setCurrentYear(newData[newData.length - 1].year);
      }
    },
    resetToDefaultData: resetData,
    resetData,
  };
}
