import React, { useState } from 'react';
import { SentenceProblem, UserSentenceInput, WordToken } from '../types';
import { CheckIcon, XIcon, InfoIcon } from 'lucide-react';

interface Props {
  sentences: SentenceProblem[];
  userInput: UserSentenceInput;
  onInputChange: (id: number, value: string) => void;
  isReviewMode: boolean;
  uiLabels: any;
}

export const SentenceQuiz: React.FC<Props> = ({ sentences, userInput, onInputChange, isReviewMode, uiLabels }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  React.useEffect(() => {
    if (isReviewMode) {
      console.log("[SentenceQuiz] Review Mode active. Showing correct/incorrect feedback.");
    }
  }, [isReviewMode]);

  const handleTokenClick = (token: WordToken, index: number, sentenceId: number) => {
    if (token.isBlank) return;
    const key = `${sentenceId}-${index}`;
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {sentences.map((sentence) => {
        const userVal = userInput[sentence.id] || "";
        const isCorrect = isReviewMode && userVal.trim().toLowerCase() === sentence.correctAnswer.toLowerCase();
        const isWrong = isReviewMode && !isCorrect;

        return (
          <div key={sentence.id} className="bg-white p-4 md:p-6 rounded-3xl border border-mist-dark shadow-sm transition-shadow">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-3 text-lg leading-loose text-charcoal font-medium">
              {sentence.tokens.map((token, idx) => {
                if (token.isBlank) {
                  return (
                    <div key={idx} className="relative inline-flex flex-col min-w-[120px] md:min-w-[140px] mx-1 -my-1 align-middle">
                      <input
                        type="text"
                        value={userVal}
                        onChange={(e) => onInputChange(sentence.id, e.target.value)}
                        disabled={isReviewMode}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck="false"
                        className={`w-full px-2 py-1.5 border-b-2 outline-none text-center font-bold text-lg rounded-t-lg transition-all
                          ${isReviewMode && isCorrect ? "border-emerald-300 text-emerald-700 bg-emerald-50/30" : ""}
                          ${isReviewMode && isWrong ? "border-rose-300 text-rose-700 bg-mist" : ""}
                          ${!isReviewMode ? "border-mist-dark bg-mist/30 focus:border-rose-dust focus:bg-white text-charcoal placeholder-stone-grey" : ""}
                        `}
                      />
                      {isWrong && (
                        <div className="absolute top-full left-0 w-full text-center mt-1 z-10">
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded shadow-sm border border-emerald-100 animate-in slide-in-from-top-1">
                            {sentence.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                const tooltipKey = `${sentence.id}-${idx}`;
                const showTooltip = activeTooltip === tooltipKey;

                return (
                  <span
                    key={idx}
                    onClick={() => handleTokenClick(token, idx, sentence.id)}
                    className={`
                      relative cursor-pointer rounded px-1 transition-colors select-none
                      ${showTooltip ? 'bg-charcoal text-white' : 'hover:text-lake hover:bg-mist'}
                    `}
                  >
                    {token.text}
                    {showTooltip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-20 animate-in fade-in zoom-in duration-200">
                        {token.translation}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal"></div>
                      </div>
                    )}
                  </span>
                );
              })}
            </div>

            <div className="mt-4 md:mt-6 pt-3 border-t border-mist-dark flex items-start gap-2">
              <div className="mt-0.5 text-stone-grey shrink-0">
                <InfoIcon size={16} />
              </div>
              <p className="text-stone-grey text-sm italic leading-relaxed">{sentence.fullTranslation}</p>
            </div>

            {isCorrect && (
              <div className="mt-2 flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-xl inline-flex animate-in slide-in-from-left-2 border border-emerald-100">
                <CheckIcon size={16} /> {uiLabels.correct}
              </div>
            )}
            {isWrong && (
              <div className="mt-2 flex items-center gap-2 text-rose-500 font-bold text-sm bg-mist px-3 py-1.5 rounded-xl inline-flex animate-in slide-in-from-left-2 border border-mist-dark">
                <XIcon size={16} /> {uiLabels.incorrect}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};