import React, { useState } from 'react';
import { VerbData, UserConjugationInput } from '../types';
import { CheckCircleIcon, XCircleIcon, ChevronRight, Check } from 'lucide-react';

interface Props {
  verbData: VerbData;
  userInput: UserConjugationInput;
  onInputChange: (tense: string, person: string, value: string) => void;
  isReviewMode: boolean;
  pronouns: string[];
  tenses: string[];
  tenseLabels: Record<string, string>;
  rowHeaderLabel?: string;
  onFinish?: () => void;
  uiLabels: any; // Accept translations
  isJP?: boolean;
}

export const ConjugationTable: React.FC<Props> = ({
  verbData,
  userInput,
  onInputChange,
  isReviewMode,
  pronouns,
  tenses,
  tenseLabels,
  rowHeaderLabel = "Person",
  onFinish,
  uiLabels,
  isJP: isJPProp
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [jpTab, setJpTab] = useState('Plain'); // Specific state for JP tabs (Plain/Polite)

  const isJP = isJPProp ?? verbData.language === 'jp';

  // Effect to reset to first tab on Review Mode
  React.useEffect(() => {
    if (isReviewMode) {
      console.log("[ConjugationTable] Review mode activated. Resetting tab to start.");
      setActiveTab(0);
      setJpTab('Plain');
      // Scroll to top of the card content to ensure user sees the first answer
      const cardContent = document.getElementById('mobile-card-content');
      if (cardContent) {
        cardContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [isReviewMode]);

  // Effect to scroll to top whenever tab changes
  React.useEffect(() => {
    const cardContent = document.getElementById('mobile-card-content');
    if (cardContent) {
      cardContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab, jpTab]);

  const getFeedbackIcon = (tense: string, person: string) => {
    if (!isReviewMode) return null;
    const userVal = (userInput[tense]?.[person] || "").trim().toLowerCase();
    const correctVal = verbData.tenses[tense]?.[person]?.toLowerCase() || "";

    if (userVal === correctVal) {
      return <CheckCircleIcon className="w-5 h-5 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />;
    }
    return <XCircleIcon className="w-5 h-5 text-rose-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />;
  };

  const getCorrectAnswerDisplay = (tense: string, person: string) => {
    if (!isReviewMode) return null;
    const userVal = (userInput[tense]?.[person] || "").trim().toLowerCase();
    const correctVal = verbData.tenses[tense]?.[person] || "";

    if (userVal !== correctVal.toLowerCase()) {
      return (
        <div className="text-xs text-rose-500 font-bold mt-1.5 px-2 py-1 bg-rose-50 rounded-lg w-fit shadow-sm animate-in fade-in slide-in-from-top-1 border border-rose-100">
          Ans: {correctVal}
        </div>
      );
    }
    return null;
  };

  const getInputClasses = (isCorrect: boolean, isWrong: boolean) => `
    w-full p-2 pr-8 rounded-xl border transition-all outline-none font-medium
    ${isJP ? 'text-xl font-japanese' : 'text-base'} 
    ${isReviewMode && isCorrect ? "border-emerald-200 bg-emerald-50/50 text-emerald-700" : ""}
    ${isReviewMode && isWrong ? "border-rose-200 bg-rose-50/50 text-rose-700" : ""}
    ${!isReviewMode ? "border-stone-200 bg-stone-50/50 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 text-stone-600 placeholder-stone-300" : ""}
  `;

  // Mobile Navigation Logic
  const isLastTab = activeTab === tenses.length - 1;

  const handleMobileNext = () => {
    if (isLastTab) {
      console.log("[ConjugationTable] Mobile FINISH button clicked");
      if (onFinish) onFinish();
    } else {
      console.log("[ConjugationTable] Mobile NEXT tab clicked");
      setActiveTab(prev => prev + 1);
    }
  };

  // --- JAPANESE SPECIFIC LAYOUT (Tabs + Vertical List) ---
  if (isJP) {
    const isJPLastTab = jpTab === 'Polite';

    return (
      <div className="w-full bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {/* JP Toggle Tabs */}
        <div className="flex border-b border-stone-100 bg-stone-50/50 sticky top-0 z-20">
          {pronouns.map(p => (
            <button
              key={p}
              onClick={() => {
                console.log(`[ConjugationTable] JP Tab switched to ${p}`);
                setJpTab(p);
              }}
              className={`flex-1 py-4 text-center font-bold text-lg transition-all relative
                  ${jpTab === p
                  ? 'bg-white text-rose-400 shadow-[0_-2px_0_0_inset] shadow-rose-300'
                  : 'text-stone-400 hover:text-stone-500 hover:bg-stone-50'}
               `}
            >
              {p === 'Plain' ? 'Plain (普通形)' : 'Polite (丁寧形)'}
            </button>
          ))}
        </div>

        {/* Vertical List of Conjugations */}
        <div id="mobile-card-content" className="p-3 sm:p-6 space-y-3 scroll-mt-28">
          {tenses.map((tense, index) => {
            const inputValue = userInput[tense]?.[jpTab] || "";
            const correctVal = verbData.tenses[tense]?.[jpTab] || "";
            const isCorrect = isReviewMode && inputValue.trim().toLowerCase() === correctVal.toLowerCase();
            const isWrong = isReviewMode && !isCorrect;

            return (
              <div key={tense} className="group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                <label className="block text-sm font-bold text-stone-400 mb-1.5 ml-1">
                  {tenseLabels[tense]}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange(tense, jpTab, e.target.value)}
                    disabled={isReviewMode}
                    placeholder={isReviewMode ? "" : "..."}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    className={`w-full p-3 pr-10 rounded-xl border transition-all outline-none font-medium
                          text-lg font-japanese
                          ${isReviewMode && isCorrect ? "border-emerald-200 bg-emerald-50/50 text-emerald-700" : ""}
                          ${isReviewMode && isWrong ? "border-rose-200 bg-rose-50/50 text-rose-700" : ""}
                          ${!isReviewMode ? "border-stone-200 bg-stone-50/50 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 text-stone-600" : ""}
                        `}
                  />
                  {getFeedbackIcon(tense, jpTab)}
                </div>
                {getCorrectAnswerDisplay(tense, jpTab)}
              </div>
            );
          })}

          {/* Mobile Footer Action Button for Japanese (Only show during Input Mode) */}
          {!isReviewMode && (
            <div className="pt-6 pb-2">
              <button
                onClick={() => {
                  if (isJPLastTab) {
                    console.log("[ConjugationTable] JP Mobile FINISH button clicked");
                    if (onFinish) onFinish();
                  } else {
                    console.log("[ConjugationTable] JP Mobile NEXT tab clicked");
                    setJpTab('Polite');
                  }
                }}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95
                   ${isJPLastTab
                    ? 'bg-rose-200 text-rose-900 border border-rose-300 hover:bg-rose-300'
                    : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'}
                 `}
              >
                {isJPLastTab ? (
                  <>{uiLabels.finish} <Check size={20} /></>
                ) : (
                  <>{uiLabels.next}: Polite (丁寧形) <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- WESTERN LANGUAGES LAYOUT (Portuguese / Spanish) ---

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW (Table) ================= */}
      <div className="hidden md:block w-full rounded-3xl shadow-sm border border-stone-100 bg-white overflow-hidden">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-stone-400 bg-stone-50/50 border-b border-stone-100 sticky left-0 z-10 w-32">
                  {rowHeaderLabel}
                </th>
                {tenses.map((tense) => (
                  <th key={tense} className="p-4 text-left text-sm font-bold text-stone-500 bg-stone-50/50 border-b border-stone-100 whitespace-nowrap min-w-[150px]">
                    {tenseLabels[tense] || tense}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pronouns.map((person) => (
                <tr key={person} className="hover:bg-stone-50/30 transition-colors group">
                  <td className="p-3 border-b border-stone-50 font-medium text-rose-400 text-sm sticky left-0 bg-white z-10 group-hover:bg-stone-50/30 transition-colors">
                    {person}
                  </td>
                  {tenses.map((tense) => {
                    const inputValue = userInput[tense]?.[person] || "";
                    const correctVal = verbData.tenses[tense]?.[person] || "";
                    const isCorrect = isReviewMode && inputValue.trim().toLowerCase() === correctVal.toLowerCase();
                    const isWrong = isReviewMode && !isCorrect;

                    return (
                      <td key={`${tense}-${person}`} className="p-3 border-b border-stone-50 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => onInputChange(tense, person, e.target.value)}
                            disabled={isReviewMode}
                            placeholder="..."
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck="false"
                            className={getInputClasses(isCorrect, isWrong)}
                          />
                          {getFeedbackIcon(tense, person)}
                        </div>
                        {getCorrectAnswerDisplay(tense, person)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE VIEW (Tabs + Cards) ================= */}
      <div className="md:hidden bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {/* Mobile Tabs */}
        <div className="flex border-b border-stone-100 bg-stone-50/50 overflow-x-auto scrollbar-hide sticky top-0 z-20">
          {tenses.map((tense, idx) => (
            <button
              key={tense}
              onClick={() => {
                console.log(`[ConjugationTable] Mobile tab clicked: ${tense}`);
                setActiveTab(idx);
              }}
              className={`flex-1 py-4 px-4 text-sm font-bold transition-all relative outline-none touch-manipulation whitespace-nowrap
                ${idx === activeTab ? 'text-rose-500 bg-white shadow-[0_-2px_0_0_inset] shadow-rose-300' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}
              `}
            >
              {tenseLabels[tense] || tense}
            </button>
          ))}
        </div>

        {/* Mobile Content Area */}
        <div id="mobile-card-content" className="p-3 space-y-3 scroll-mt-28">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-stone-600">{tenseLabels[tenses[activeTab]] || tenses[activeTab]}</h4>
            <div className="flex gap-1.5">
              {tenses.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeTab ? 'w-6 bg-rose-300' : 'w-1.5 bg-stone-200'}`} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {pronouns.map((person) => {
              const tense = tenses[activeTab];
              const inputValue = userInput[tense]?.[person] || "";
              const correctVal = verbData.tenses[tense]?.[person] || "";
              const isCorrect = isReviewMode && inputValue.trim().toLowerCase() === correctVal.toLowerCase();
              const isWrong = isReviewMode && !isCorrect;

              return (
                <div key={`${tense}-${person}`} className="space-y-1.5">
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider ml-1">
                    {person}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => onInputChange(tense, person, e.target.value)}
                      disabled={isReviewMode}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      className={`w-full p-3 pr-10 rounded-xl border transition-all outline-none font-medium text-base
                        ${isReviewMode && isCorrect ? "border-emerald-200 bg-emerald-50/50 text-emerald-700" : ""}
                        ${isReviewMode && isWrong ? "border-rose-200 bg-rose-50/50 text-rose-700" : ""}
                        ${!isReviewMode ? "border-stone-200 bg-stone-50/50 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 text-stone-600" : ""}
                      `}
                    />
                    {getFeedbackIcon(tense, person)}
                  </div>
                  {getCorrectAnswerDisplay(tense, person)}
                </div>
              );
            })}
          </div>

          {/* Mobile Footer Action Button (Only show during Input Mode) */}
          {!isReviewMode && (
            <div className="pt-6 pb-2">
              <button
                onClick={handleMobileNext}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95
                   ${isLastTab
                    ? 'bg-rose-200 text-rose-900 border border-rose-300 hover:bg-rose-300'
                    : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'}
                 `}
              >
                {isLastTab ? (
                  <>{uiLabels.finish} <Check size={20} /></>
                ) : (
                  <>{uiLabels.next}: {tenseLabels[tenses[activeTab + 1]] || tenses[activeTab + 1]} <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};