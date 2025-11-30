
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { X, TrendingUp, Clock, Activity, ChevronLeft, ChevronRight, Cloud, History, CheckCircle, XCircle, Lock, Play, ChevronDown } from 'lucide-react';
import { dbService, DailyStat, VerbStat, LearningLog } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { Language, LANGUAGE_CONFIGS } from '../types';


interface Props {
  onClose?: () => void;
  variant?: 'modal' | 'page'; // 'modal' by default
  onStart?: (lang: Language) => void;
  uiLabels: any;
}

export const ProfileDashboard: React.FC<Props> = ({ onClose, variant = 'modal', onStart, uiLabels }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<3 | 7 | 30>(7);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [unlockedLanguages, setUnlockedLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [verbStats, setVerbStats] = useState<VerbStat[]>([]);
  const [recentLogs, setRecentLogs] = useState<LearningLog[]>([]);
  const [totalVerbs, setTotalVerbs] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  // Carousel State
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  // Interactive Chart State
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const isModal = variant === 'modal';

  // Fetch User Profile to get unlocked languages
  useEffect(() => {
    if (user) {
      dbService.getUserProfile(user.uid).then((profile) => {
        if (profile) {
          const unlocked = profile.unlockedLanguages || [];
          setUnlockedLanguages(unlocked);
          if (unlocked.length > 0) {
            // If selectedLanguage isn't set OR it's not in the unlocked list
            if (!selectedLanguage || !unlocked.includes(selectedLanguage)) {
              // Try to use the profile's current language if available
              const preferred = profile.currentLanguage;
              if (unlocked.includes(preferred)) {
                setSelectedLanguage(preferred);
              } else {
                setSelectedLanguage(unlocked[0]);
              }
            }
          } else {
            setSelectedLanguage(null);
          }
        }
      });
    }
  }, [user, totalVerbs]);

  // Fetch Data
  useEffect(() => {
    if (user && selectedLanguage) {
      setLoading(true);
      // Reset interaction state
      setHoveredIndex(null);

      Promise.allSettled([
        dbService.getDashboardStats(user.uid, timeRange, selectedLanguage),
        dbService.getVerbStats(user.uid, selectedLanguage),
        dbService.getRecentLogs(user.uid, selectedLanguage)
      ])
        .then((results) => {
          const dashboardResult = results[0];
          const verbsResult = results[1];
          const logsResult = results[2];

          if (dashboardResult.status === 'fulfilled') {
            setStats(dashboardResult.value.stats);
            setTotalVerbs(dashboardResult.value.totalVerbs);
          }
          if (verbsResult.status === 'fulfilled') {
            setVerbStats(verbsResult.value);
          }
          if (logsResult.status === 'fulfilled') {
            setRecentLogs(logsResult.value);
          }
        })
        .finally(() => setLoading(false));
    } else if (unlockedLanguages.length === 0) {
      setLoading(false);
    }
  }, [user, timeRange, selectedLanguage, unlockedLanguages]);



  const handleStartPractice = () => {
    if (onStart && selectedLanguage) {
      onStart(selectedLanguage);
    }
  };

  // --- CHART HELPERS ---
  const CHART_HEIGHT = 110;
  const CHART_WIDTH = 300;
  const PADDING_TOP = 20;
  const PADDING_BOTTOM = 20;
  const PADDING_LEFT = 35;
  const PADDING_RIGHT = 10;

  const handleChartMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!stats || stats.length < 2) return;

    const svgRect = e.currentTarget.getBoundingClientRect();
    let clientX;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const relativeX = clientX - svgRect.left;
    const chartContentWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
    const xZero = PADDING_LEFT;
    const fraction = Math.max(0, Math.min(1, (relativeX - xZero) / chartContentWidth));
    const index = Math.round(fraction * (stats.length - 1));
    setHoveredIndex(index);
  };

  const handleChartLeave = () => {
    setHoveredIndex(null);
  };

  const getPointCoordinates = (index: number, value: number, maxVal: number) => {
    const x = PADDING_LEFT + (index / (stats.length - 1)) * (CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT);
    const y = CHART_HEIGHT - PADDING_BOTTOM - ((value) / (maxVal)) * (CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM);
    return { x, y };
  };

  const ChartTooltip = ({ x, y, label, subLabel }: { x: number, y: number, label: string, subLabel: string }) => {
    const isRightSide = x > CHART_WIDTH / 2;
    const boxX = isRightSide ? x - 8 : x + 8;
    const boxY = y - 35;

    return (
      <g className="animate-in fade-in zoom-in-95 duration-200">
        <line x1={x} y1={PADDING_TOP} x2={x} y2={CHART_HEIGHT - PADDING_BOTTOM} stroke="#d6d3d1" strokeWidth="1" strokeDasharray="4" />
        <circle cx={x} cy={y} r="4" fill="white" stroke="#f43f5e" strokeWidth="2" />
        <rect
          x={isRightSide ? boxX - 70 : boxX}
          y={boxY}
          width="70"
          height="32"
          rx="6"
          fill="rgba(255, 255, 255, 0.95)"
          stroke="#e5e7eb"
          strokeWidth="1"
          className="drop-shadow-md"
        />
        <text x={isRightSide ? boxX - 35 : boxX + 35} y={boxY + 14} textAnchor="middle" className="text-[10px] font-bold fill-stone-700 pointer-events-none">
          {label}
        </text>
        <text x={isRightSide ? boxX - 35 : boxX + 35} y={boxY + 26} textAnchor="middle" className="text-[9px] font-medium fill-stone-400 pointer-events-none">
          {subLabel}
        </text>
      </g>
    );
  };

  const createLinePath = (data: DailyStat[], valueKey: 'avgAccuracy' | 'avgDuration', maxVal: number) => {
    if (!data || data.length < 2) return "";
    const points = data.map((d, i) => {
      const { x, y } = getPointCoordinates(i, d[valueKey], maxVal);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const createBarPaths = (data: DailyStat[], maxCount: number) => {
    if (!data || data.length === 0) return null;
    const barWidth = (CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT) / data.length * 0.6;
    return data.map((d, i) => {
      const { x, y } = getPointCoordinates(i, d.count, maxCount);
      const barX = x - (barWidth / 2);
      const h = (CHART_HEIGHT - PADDING_BOTTOM) - y;
      const isHovered = hoveredIndex === i;
      return (
        <rect
          key={i}
          x={barX}
          y={y}
          width={barWidth}
          height={h}
          rx={2}
          className={`transition-colors ${isHovered ? 'fill-rose-400' : 'fill-rose-300'}`}
        />
      );
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // --- WORD CLOUD HELPER ---
  const shuffledVerbs = useMemo(() => {
    const shuffled = [...verbStats];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [verbStats]);

  const renderWordCloud = () => {
    if (verbStats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-stone-300">
          <Cloud size={48} className="mb-2 opacity-50" />
          <span className="text-xs">No data available</span>
        </div>
      );
    }

    const maxCount = Math.max(...verbStats.map(v => v.count));
    const minCount = Math.min(...verbStats.map(v => v.count));

    return (
      <div className="flex flex-wrap items-center justify-center gap-0.5 content-center h-full p-1 overflow-hidden">
        {shuffledVerbs.map((v, i) => {
          const sizeRange = maxCount - minCount || 1;
          const normalizedSize = 0.8 + ((v.count - minCount) / sizeRange) * 1.2;
          let colorClass = "text-stone-400";

          if (v.avgAccuracy < 0.2) colorClass = "text-rose-700";
          else if (v.avgAccuracy < 0.4) colorClass = "text-rose-200";
          else if (v.avgAccuracy < 0.6) colorClass = "text-amber-400";
          else if (v.avgAccuracy < 0.8) colorClass = "text-emerald-200";
          else colorClass = "text-emerald-700";

          return (
            <span
              key={v.verb}
              className={`font-bold leading-none ${colorClass} transition-all hover:scale-110 cursor-default`}
              style={{ fontSize: `${normalizedSize}rem` }}
              title={`Practiced: ${v.count}, Acc: ${(v.avgAccuracy * 100).toFixed(0)}%`}
            >
              {v.verb}
            </span>
          );
        })}
      </div>
    );
  };

  // --- CAROUSEL LOGIC ---
  const charts = [
    {
      id: 'accuracy',
      title: uiLabels.accuracyTrend,
      icon: <TrendingUp size={18} className="text-rose-400" />,
      render: () => {
        const maxY = 1.05;
        return (
          <svg
            ref={chartRef}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full h-full overflow-visible touch-none cursor-crosshair"
            onMouseMove={handleChartMove}
            onMouseLeave={handleChartLeave}
            onTouchStart={handleChartMove}
            onTouchMove={handleChartMove}
          >
            <line x1={PADDING_LEFT} y1={PADDING_TOP} x2={CHART_WIDTH - PADDING_RIGHT} y2={PADDING_TOP} stroke="#e5e7eb" strokeDasharray="4" />
            <line x1={PADDING_LEFT} y1={CHART_HEIGHT / 2} x2={CHART_WIDTH - PADDING_RIGHT} y2={CHART_HEIGHT / 2} stroke="#e5e7eb" strokeDasharray="4" />
            <line x1={PADDING_LEFT} y1={CHART_HEIGHT - PADDING_BOTTOM} x2={CHART_WIDTH - PADDING_RIGHT} y2={CHART_HEIGHT - PADDING_BOTTOM} stroke="#e5e7eb" strokeDasharray="4" />

            <text x={PADDING_LEFT - 5} y={PADDING_TOP + 4} className="text-[10px] fill-stone-400 font-medium" textAnchor="end">100%</text>
            <text x={PADDING_LEFT - 5} y={CHART_HEIGHT / 2 + 4} className="text-[10px] fill-stone-300" textAnchor="end">50%</text>
            <text x={PADDING_LEFT - 5} y={CHART_HEIGHT - PADDING_BOTTOM + 4} className="text-[10px] fill-stone-400 font-medium" textAnchor="end">0%</text>

            {stats && stats.length > 0 ? (
              <>
                <path
                  d={createLinePath(stats, 'avgAccuracy', maxY)}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm pointer-events-none"
                />
                {hoveredIndex !== null && stats[hoveredIndex] && (
                  <ChartTooltip
                    {...getPointCoordinates(hoveredIndex, stats[hoveredIndex].avgAccuracy, maxY)}
                    label={`${(stats[hoveredIndex].avgAccuracy * 100).toFixed(0)}%`}
                    subLabel={formatDate(stats[hoveredIndex].date)}
                  />
                )}
              </>
            ) : <text x={(CHART_WIDTH + PADDING_LEFT) / 2} y={CHART_HEIGHT / 2} className="text-[10px] fill-stone-300" textAnchor="middle">No Data</text>}

            <text x={PADDING_LEFT} y={CHART_HEIGHT} className="text-[10px] fill-stone-400" textAnchor="start">{stats.length > 0 ? formatDate(stats[0]?.date) : ''}</text>
            <text x={CHART_WIDTH - PADDING_RIGHT} y={CHART_HEIGHT} className="text-[10px] fill-stone-400" textAnchor="end">{stats.length > 0 ? formatDate(stats[stats.length - 1]?.date) : ''}</text>
          </svg>
        )
      }
    },
    {
      id: 'volume',
      title: uiLabels.dailyVolume,
      icon: <Activity size={18} className="text-rose-400" />,
      render: () => {
        const maxCount = Math.max(...stats.map(d => d.count)) || 5;
        return (
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full h-full overflow-visible touch-none cursor-crosshair"
            onMouseMove={handleChartMove}
            onMouseLeave={handleChartLeave}
            onTouchStart={handleChartMove}
            onTouchMove={handleChartMove}
          >
            <line x1={PADDING_LEFT} y1={PADDING_TOP} x2={CHART_WIDTH - PADDING_RIGHT} y2={PADDING_TOP} stroke="#e5e7eb" strokeDasharray="4" />
            <line x1={PADDING_LEFT} y1={CHART_HEIGHT - PADDING_BOTTOM} x2={CHART_WIDTH - PADDING_RIGHT} y2={CHART_HEIGHT - PADDING_BOTTOM} stroke="#d6d3d1" strokeWidth="1" />

            <text x={PADDING_LEFT - 5} y={PADDING_TOP + 4} className="text-[10px] fill-stone-400 font-medium" textAnchor="end">{maxCount}</text>
            <text x={PADDING_LEFT - 5} y={CHART_HEIGHT - PADDING_BOTTOM + 4} className="text-[10px] fill-stone-400 font-medium" textAnchor="end">0</text>

            {createBarPaths(stats, maxCount)}

            {hoveredIndex !== null && stats[hoveredIndex] && (
              <ChartTooltip
                {...getPointCoordinates(hoveredIndex, stats[hoveredIndex].count, maxCount)}
                label={`${stats[hoveredIndex].count} ${uiLabels.verbs}`}
                subLabel={formatDate(stats[hoveredIndex].date)}
              />
            )}
          </svg>
        );
      }
    },
    {
      id: 'speed',
      title: uiLabels.avgTime,
      icon: <Clock size={18} className="text-rose-400" />,
      render: () => {
        const maxDur = Math.max(...stats.map(d => d.avgDuration)) || 60;
        return (
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full h-full overflow-visible touch-none cursor-crosshair"
            onMouseMove={handleChartMove}
            onMouseLeave={handleChartLeave}
            onTouchStart={handleChartMove}
            onTouchMove={handleChartMove}
          >
            <line x1={PADDING_LEFT} y1={PADDING_TOP} x2={CHART_WIDTH - PADDING_RIGHT} y2={PADDING_TOP} stroke="#e5e7eb" strokeDasharray="4" />
            <line x1={PADDING_LEFT} y1={CHART_HEIGHT / 2} x2={CHART_WIDTH - PADDING_RIGHT} y2={CHART_HEIGHT / 2} stroke="#e5e7eb" strokeDasharray="4" />
            <line x1={PADDING_LEFT} y1={CHART_HEIGHT - PADDING_BOTTOM} x2={CHART_WIDTH - PADDING_RIGHT} y2={CHART_HEIGHT - PADDING_BOTTOM} stroke="#e5e7eb" strokeDasharray="4" />

            <text x={PADDING_LEFT - 5} y={PADDING_TOP + 4} className="text-[10px] fill-stone-400 font-medium" textAnchor="end">{maxDur.toFixed(0)}s</text>
            <text x={PADDING_LEFT - 5} y={CHART_HEIGHT - PADDING_BOTTOM + 4} className="text-[10px] fill-stone-400 font-medium" textAnchor="end">0s</text>

            {stats && stats.length > 0 ? (
              <>
                <path
                  d={createLinePath(stats, 'avgDuration', maxDur)}
                  fill="none"
                  stroke="#a8a29e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  className="pointer-events-none"
                />
                {hoveredIndex !== null && stats[hoveredIndex] && (
                  <ChartTooltip
                    {...getPointCoordinates(hoveredIndex, stats[hoveredIndex].avgDuration, maxDur)}
                    label={`${stats[hoveredIndex].avgDuration.toFixed(0)}s`}
                    subLabel={formatDate(stats[hoveredIndex].date)}
                  />
                )}
              </>
            ) : <text x={(CHART_WIDTH + PADDING_LEFT) / 2} y={CHART_HEIGHT / 2} className="text-[10px] fill-stone-300" textAnchor="middle">No Data</text>}
          </svg>
        );
      }
    },
    {
      id: 'cloud',
      title: uiLabels.vocabMastery,
      icon: <Cloud size={18} className="text-rose-400" />,
      render: () => renderWordCloud()
    }
  ];

  const handleNext = () => {
    setHoveredIndex(null);
    setCurrentChartIndex((prev) => (prev + 1) % charts.length);
  }
  const handlePrev = () => {
    setHoveredIndex(null);
    setCurrentChartIndex((prev) => (prev - 1 + charts.length) % charts.length);
  }

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStart(null);
  };

  // --- RENDER LOGIC BASED ON VARIANT ---

  const containerClasses = isModal
    ? "fixed inset-0 z-50 flex items-center justify-center bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300 p-4"
    : "flex-1 flex flex-col items-center w-full max-w-4xl mx-auto p-0 pb-safe pb-24 animate-in fade-in duration-500";

  const cardClasses = isModal
    ? "bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-rose-100 flex flex-col overflow-hidden max-h-[95vh]"
    : "bg-white/80 backdrop-blur-md rounded-3xl w-full shadow-sm border border-rose-100 flex flex-col overflow-hidden h-full";

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>

        {/* Header */}
        <div className="p-3 border-b border-stone-100 bg-stone-50/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-stone-700">{uiLabels.yourProgress}</h2>
              <p className="text-stone-400 text-xs">{uiLabels.trackJourney}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              {unlockedLanguages.length > 0 ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 py-1 pl-3 pr-2 rounded-lg font-bold text-xs hover:border-rose-200 transition-all shadow-sm"
                  >
                    <span>{selectedLanguage ? LANGUAGE_CONFIGS[selectedLanguage].flag : ''}</span>
                    <span>{selectedLanguage ? LANGUAGE_CONFIGS[selectedLanguage].name : uiLabels.select}</span>
                    <ChevronDown size={14} className={`text-stone-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {unlockedLanguages.map(langId => (
                          <button
                            key={langId}
                            onClick={() => {
                              setSelectedLanguage(langId);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors ${selectedLanguage === langId
                              ? 'bg-rose-50 text-rose-500'
                              : 'text-stone-600 hover:bg-stone-50'
                              }`}
                          >
                            <span className="text-base">{LANGUAGE_CONFIGS[langId].flag}</span>
                            <span>{LANGUAGE_CONFIGS[langId].name}</span>
                            {selectedLanguage === langId && <CheckCircle size={12} className="ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="px-2 py-1 bg-stone-100 rounded-lg text-[10px] text-stone-400 font-medium flex items-center gap-1">
                  <Lock size={12} /> <span>{uiLabels.locked}</span>
                </div>
              )}

              {isModal && onClose && (
                <button onClick={onClose} className="p-1.5 hover:bg-rose-50 rounded-full text-stone-400 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto p-3 bg-white flex flex-col h-full scrollbar-hide ${!isModal ? 'pb-4' : ''}`}>
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[200px]"><LoadingSpinner message={uiLabels.loadingStats} /></div>
          ) : !selectedLanguage ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] space-y-3 text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-rose-200">
                <Activity size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-600">{uiLabels.noData}</h3>
                <p className="text-stone-400 text-xs max-w-[180px] mx-auto">{uiLabels.noDataDesc}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Controls */}
              <div className="flex justify-center bg-stone-100 p-0.5 rounded-lg w-fit mx-auto">
                {[3, 7, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setTimeRange(d as any)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${timeRange === d
                      ? 'bg-white text-rose-500 shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                      }`}
                  >
                    {d} {uiLabels.days}
                  </button>
                ))}
              </div>

              {/* Big Stat Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-rose-50 rounded-xl p-2 border border-rose-100 flex flex-col items-center justify-center text-center">
                  <span className="text-stone-500 text-[9px] font-bold uppercase tracking-wider mb-0.5">{uiLabels.total} {LANGUAGE_CONFIGS[selectedLanguage].name.split(' ')[0]}</span>
                  <span className="text-2xl font-black text-rose-500">{totalVerbs}</span>
                </div>
                <div className="bg-stone-50 rounded-xl p-2 border border-stone-100 flex flex-col items-center justify-center text-center">
                  <span className="text-stone-500 text-[9px] font-bold uppercase tracking-wider mb-0.5">{uiLabels.recentAccuracy}</span>
                  <span className="text-2xl font-black text-stone-600">
                    {stats.length > 0 ? (stats[stats.length - 1]?.avgAccuracy * 100).toFixed(0) : 0}<span className="text-xs text-stone-400">%</span>
                  </span>
                </div>
              </div>

              {/* Chart Carousel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-stone-600 font-bold text-xs px-1">
                  <div className="flex items-center gap-1.5">
                    {charts[currentChartIndex].icon} {charts[currentChartIndex].title}
                  </div>
                  <span className="text-[10px] text-stone-400 font-normal hidden md:inline">{uiLabels.swipeNavigate}</span>
                </div>

                <div
                  className="relative group bg-stone-50 rounded-2xl border border-stone-100 p-2 h-[160px] touch-pan-y"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <button
                    onClick={handlePrev}
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-stone-400 hover:text-rose-500 hover:shadow-md transition-all active:scale-90 flex"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-stone-400 hover:text-rose-500 hover:shadow-md transition-all active:scale-90 flex"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-300" key={currentChartIndex}>
                    {charts[currentChartIndex].render()}
                  </div>
                </div>

                <div className="flex justify-center gap-1.5">
                  {charts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentChartIndex(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${currentChartIndex === idx ? 'w-4 bg-rose-400' : 'w-1 bg-stone-200 hover:bg-stone-300'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-stone-600 font-bold text-xs px-1 mt-2 border-t border-stone-100 pt-2">
                  <History size={14} className="text-rose-400" /> {uiLabels.recentActivity}
                </div>

                <div className="bg-stone-50 rounded-xl border border-stone-100 p-2 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                  <div className="space-y-1.5">
                    {recentLogs.length === 0 ? (
                      <p className="text-center text-[10px] text-stone-300 italic py-2">{uiLabels.noRecentActivity}</p>
                    ) : (
                      recentLogs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white border border-stone-100 rounded-lg shadow-sm hover:border-rose-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{LANGUAGE_CONFIGS[log.language].flag}</span>
                            <div>
                              <p className="font-bold text-stone-700 text-xs">{log.verb}</p>
                              <p className="text-[9px] text-stone-400">{formatRelativeTime(log.timestamp)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {log.accuracy >= 1 ? (
                              <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                                <CheckCircle size={10} /> {uiLabels.perfect}
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                                <XCircle size={10} /> {((1 - log.accuracy) * log.totalQuestions).toFixed(0)} {uiLabels.err}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Start Practice Button */}

            </div>
          )}
        </div>


      </div>

      {/* Start Practice Button (Outside Card) */}
      {!isModal && selectedLanguage && (
        <div className="w-full max-w-lg mt-4 px-4 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <button
            onClick={handleStartPractice}
            className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold text-lg shadow-xl shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play size={24} fill="currentColor" /> {uiLabels.startPractice}
          </button>
        </div>
      )}
    </div>
  );
};
