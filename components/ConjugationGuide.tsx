import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Globe, Clock, Sparkles, User, Type, Zap, ArrowRight, Book } from 'lucide-react';
import { Language } from '../types';
import { CONJUGATION_GUIDES } from '../data/conjugationGuides';

interface Props {
    language: Language;
    explanationLanguage: string;
}

const UI_TEXT: Record<string, any> = {
    'English': {
        title: 'Conjugation Guide',
        subtitle: 'Master the rules of',
        pronouns: 'Pronouns',
        tenses: 'Tenses',
        rules: 'Regular Conjugation Rules'
    },
    'Traditional Chinese': {
        title: '動詞變位指南',
        subtitle: '掌握',
        pronouns: '人稱',
        tenses: '時態',
        rules: '規則動詞變位規則'
    },
    'Japanese': {
        title: '動詞活用ガイド',
        subtitle: 'のルールをマスター',
        pronouns: '人称',
        tenses: '時制',
        rules: '規則動詞活用ルール'
    },
    'Portuguese': {
        title: 'Guia de Conjugação',
        subtitle: 'Domine as regras do',
        pronouns: 'Pronomes',
        tenses: 'Tempos',
        rules: 'Regras de Conjugação Regular'
    },
    'Spanish': {
        title: 'Guía de Conjugación',
        subtitle: 'Domina las reglas del',
        pronouns: 'Pronombres',
        tenses: 'Tiempos',
        rules: 'Reglas de Conjugación Regular'
    },
    'French': {
        title: 'Guide de Conjugaison',
        subtitle: 'Maîtrisez les règles du',
        pronouns: 'Pronoms',
        tenses: 'Temps',
        rules: 'Règles de Conjugaison Régulière'
    }
};


export const ConjugationGuide: React.FC<Props> = ({ language, explanationLanguage }) => {
    const [activeConceptIndex, setActiveConceptIndex] = useState(0);
    const [activeRuleIndex, setActiveRuleIndex] = useState(0);
    const [activeVerbType, setActiveVerbType] = useState<string | null>(null);

    // Touch gesture refs
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const guide = CONJUGATION_GUIDES[language]?.[explanationLanguage] || CONJUGATION_GUIDES[language]?.['English'];
    const ui = UI_TEXT[explanationLanguage] || UI_TEXT['English'];

    // Helper: Extract verb type from rule group name
    const extractVerbType = (group: string): string | null => {
        // Matches "-ar", "-er", "-ir", "-re" at start, or "Verbos -ar" etc.
        const match = group.match(/(?:^|Verbos\s+)(-[a-z]{2})/i);
        return match ? match[1].toLowerCase() : null;
    };

    // Helper: Group rules by verb type
    const groupedRules = useMemo(() => {
        if (!guide?.rules) return {};

        const grouped: Record<string, typeof guide.rules> = {};
        guide.rules.forEach(rule => {
            const type = extractVerbType(rule.group);
            if (type) {
                if (!grouped[type]) grouped[type] = [];
                grouped[type].push(rule);
            }
        });
        return grouped;
    }, [guide?.rules]);

    const isJapanese = language === 'jp';
    const verbTypes = useMemo(() =>
        !isJapanese ? Object.keys(groupedRules).sort() : [],
        [isJapanese, groupedRules]);

    // Get current rules based on language
    const currentRules = isJapanese
        ? (guide?.rules || [])
        : ((activeVerbType && groupedRules[activeVerbType]) || guide?.rules || []);

    // Reset state when language changes
    useEffect(() => {
        setActiveConceptIndex(0);
        setActiveRuleIndex(0);
        // Set default verb type for non-Japanese languages
        if (!isJapanese && verbTypes.length > 0 && !activeVerbType) {
            setActiveVerbType(verbTypes[0]);
        }
    }, [language, explanationLanguage, isJapanese, verbTypes, activeVerbType]);

    // Helper: Get icon for tense
    const getTenseIcon = (meaning: string) => {
        const lower = meaning.toLowerCase();
        let activeIndex = 1; // Default Present (0: Past, 1: Present, 2: Future)

        if (lower.includes('past') || lower.includes('過去') || lower.includes('passado') || lower.includes('pasado') || lower.includes('passé')) {
            activeIndex = 0;
        } else if (lower.includes('future') || lower.includes('未来') || lower.includes('未來') || lower.includes('futuro') || lower.includes('futur')) {
            activeIndex = 2;
        }

        return (
            <div className="relative w-64 h-16 flex items-center justify-center">
                {/* Continuous Arrow Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-stone-300 top-1/2 -translate-y-1/2 rounded-full"></div>
                <ArrowRight className="absolute right-[-6px] top-1/2 -translate-y-1/2 text-stone-300" size={20} />

                {/* Past Point (Left) */}
                <div className="absolute left-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 z-10 ${activeIndex === 0 ? 'bg-lake scale-125 ring-4 ring-lake/20' : 'bg-stone-300'}`} />
                    {activeIndex === 0 && <span className="absolute -top-8 text-xs font-bold text-lake whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">Past</span>}
                </div>

                {/* Present Point (Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 z-10 ${activeIndex === 1 ? 'bg-lake scale-125 ring-4 ring-lake/20' : 'bg-stone-300'}`} />
                    {activeIndex === 1 && <span className="absolute -top-8 text-xs font-bold text-lake whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">Present</span>}
                </div>

                {/* Future Point (Right) */}
                <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 z-10 ${activeIndex === 2 ? 'bg-lake scale-125 ring-4 ring-lake/20' : 'bg-stone-300'}`} />
                    {activeIndex === 2 && <span className="absolute -top-8 text-xs font-bold text-lake whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">Future</span>}
                </div>
            </div>
        );
    };



    if (!guide || guide.pronouns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
                    <Book size={40} className="text-stone-300" />
                </div>
                <h2 className="text-2xl font-bold text-stone-600">{ui.title}</h2>
                <p className="text-stone-400">We are working on the guide for this language.</p>
            </div>
        );
    }

    const activeRule = currentRules?.[activeRuleIndex] || currentRules?.[0];
    const conceptSlides = ['pronouns', ...guide.tenses.map((_, i) => `tense-${i}`)];

    const handleNextConcept = () => setActiveConceptIndex((prev) => (prev + 1) % conceptSlides.length);
    const handlePrevConcept = () => setActiveConceptIndex((prev) => (prev - 1 + conceptSlides.length) % conceptSlides.length);

    const handleNextRule = () => {
        if (currentRules && currentRules.length > 0) {
            setActiveRuleIndex((prev) => (prev + 1) % currentRules.length);
        }
    };
    const handlePrevRule = () => {
        if (currentRules && currentRules.length > 0) {
            setActiveRuleIndex((prev) => (prev - 1 + currentRules.length) % currentRules.length);
        }
    };

    // Keyboard navigation - placed after function definitions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevConcept();
            if (e.key === 'ArrowRight') handleNextConcept();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Touch handlers for concepts
    const onTouchStartConcept = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMoveConcept = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEndConcept = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) handleNextConcept();
        if (isRightSwipe) handlePrevConcept();
    };

    // Touch handlers for rules
    const onTouchStartRule = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMoveRule = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEndRule = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) handleNextRule();
        if (isRightSwipe) handlePrevRule();
    };

    const renderConceptContent = () => {
        const slide = conceptSlides[activeConceptIndex];

        if (slide === 'pronouns') {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl">
                    <div className="flex items-center justify-center gap-3 text-lake mb-4">
                        <Globe size={28} />
                        <h2 className="text-2xl font-bold text-charcoal">{ui.pronouns}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {guide.pronouns.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-mist-dark shadow-sm flex flex-col items-center text-center hover:border-lake transition-colors">
                                <span className="text-lg font-bold text-charcoal">{item.term}</span>
                                <span className="text-sm text-stone-grey">{item.meaning}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (slide.startsWith('tense-')) {
            const tenseIndex = parseInt(slide.split('-')[1]);
            const tense = guide.tenses[tenseIndex];

            if (!tense) return null;

            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-lg flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center gap-3 text-lake mb-2">
                        <Clock size={28} />
                        <h2 className="text-2xl font-bold text-charcoal">{ui.tenses}</h2>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-mist-dark shadow-sm flex flex-col items-center text-center hover:border-lake transition-all w-full relative overflow-hidden">
                        {/* Visual Illustration */}
                        <div className="mb-8 mt-4">
                            {getTenseIcon(tense.meaning)}
                        </div>

                        <span className="text-3xl font-black text-charcoal mb-2">{tense.term}</span>
                        <span className="text-xl text-stone-grey font-medium">{tense.meaning}</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-12 pb-20 animate-in fade-in duration-500">

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-stone-700 tracking-tight">{ui.title}</h1>
                <p className="text-stone-400 font-medium">{ui.subtitle} {language.toUpperCase()}</p>
            </div>

            {/* Concepts Carousel */}
            <section className="relative max-w-5xl mx-auto">
                {/* Navigation - Outside */}
                <button
                    onClick={handlePrevConcept}
                    aria-label="Previous concept"
                    className="absolute top-1/2 -translate-y-1/2 -left-12 md:-left-16 p-2 text-stone-400 hover:text-charcoal transition-colors z-10 hidden md:block"
                >
                    <ChevronLeft size={40} strokeWidth={1.5} />
                </button>
                <button
                    onClick={handleNextConcept}
                    aria-label="Next concept"
                    className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-16 p-2 text-stone-400 hover:text-charcoal transition-colors z-10 hidden md:block"
                >
                    <ChevronRight size={40} strokeWidth={1.5} />
                </button>



                <div
                    className="bg-white/50 backdrop-blur-sm rounded-3xl border border-mist-dark shadow-xl overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col"
                    onTouchStart={onTouchStartConcept}
                    onTouchMove={onTouchMoveConcept}
                    onTouchEnd={onTouchEndConcept}
                >
                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
                        {renderConceptContent()}
                    </div>

                    {/* Dots - Clickable */}
                    <div className="pb-6 flex justify-center gap-2">
                        {conceptSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveConceptIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-70 ${idx === activeConceptIndex ? 'w-6 bg-lake' : 'w-2 bg-stone-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Rules Carousel */}
            <section className="space-y-6 max-w-5xl mx-auto relative">
                <div className="flex items-center gap-3 text-emerald-500">
                    <Type size={24} />
                    <h2 className="text-2xl font-bold">{ui.rules}</h2>
                </div>

                {/* Navigation - Outside */}
                <button
                    onClick={handlePrevRule}
                    aria-label="Previous rule"
                    className="absolute top-[60%] -translate-y-1/2 -left-12 md:-left-16 p-2 text-stone-300 hover:text-stone-500 transition-colors z-10 hidden md:block"
                >
                    <ChevronLeft size={40} strokeWidth={1.5} />
                </button>
                <button
                    onClick={handleNextRule}
                    aria-label="Next rule"
                    className="absolute top-[60%] -translate-y-1/2 -right-12 md:-right-16 p-2 text-stone-300 hover:text-stone-500 transition-colors z-10 hidden md:block"
                >
                    <ChevronRight size={40} strokeWidth={1.5} />
                </button>

                <div
                    className="bg-white rounded-3xl border border-stone-100 shadow-lg overflow-hidden relative"
                    onTouchStart={onTouchStartRule}
                    onTouchMove={onTouchMoveRule}
                    onTouchEnd={onTouchEndRule}
                >

                    {/* Verb Type Tabs (Non-Japanese only) */}
                    {!isJapanese && verbTypes.length > 0 && (
                        <div className="flex gap-2 p-3 sm:p-4 bg-stone-50/50 border-b border-stone-100 overflow-x-auto scrollbar-hide">
                            {verbTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setActiveVerbType(type);
                                        setActiveRuleIndex(0); // Reset to first page
                                    }}
                                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all whitespace-nowrap flex-shrink-0 ${activeVerbType === type
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                        }`}
                                >
                                    {type} Verbs
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Carousel Header */}
                    <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-center items-center">
                        {activeRule && (
                            <div className="text-center">
                                <h3 className="font-bold text-stone-700 text-xl">{activeRule.group}</h3>
                                <span className="text-sm text-stone-400 italic">{activeRule.example}</span>
                            </div>
                        )}
                    </div>

                    {/* Carousel Content */}
                    <div className="p-4 sm:p-6 h-[320px] sm:h-[360px] flex items-center justify-center">
                        {activeRule && activeRule.endings ? (
                            <div className={`grid gap-3 sm:gap-4 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 ${language === 'jp'
                                ? 'grid-cols-1 sm:grid-cols-2'
                                : 'grid-cols-2 md:grid-cols-3'
                                }`} key={activeRuleIndex}>
                                {activeRule.endings.map((ending, eIdx) => (
                                    <div key={eIdx} className="flex flex-col items-center justify-center p-5 bg-stone-50 rounded-xl border border-stone-100 min-h-[100px]">
                                        <span className="text-stone-400 text-sm font-medium mb-1">{ending.person}</span>
                                        <span className="font-mono font-bold text-2xl text-emerald-600">{ending.ending}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-stone-400 text-center">
                                <p>No rules available for this language yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Dots - Clickable */}
                    <div className="pb-4 flex justify-center gap-2">
                        {currentRules.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveRuleIndex(idx)}
                                aria-label={`Go to rule ${idx + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-70 ${idx === activeRuleIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-stone-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};
