import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Play, BookOpen, X } from 'lucide-react';

interface Props {
    onFinish: () => void;
    uiLabels: any;
    explanationLanguage: string;
    targetLanguage: Language;
}

type Language = 'pt' | 'es' | 'fr' | 'jp';

const TUTORIAL_TEXT: Record<string, any> = {
    'English': {
        welcomeTitle: 'Master Verb Conjugations',
        welcomeBody: 'Falling in Verb helps you internalize verb forms through focused practice and context.',
        verbTitle: 'Meet Your Verb',
        verbBody: 'Every session focuses on one verb. You\'ll see its meaning and group (e.g., -ar, -er, -ir).',
        formsTitle: 'Build the Forms',
        formsBody: 'Practice conjugating the verb across different pronouns and tenses. Don\'t worry if you make mistakes!',
        contextTitle: 'Use it in Context',
        contextBody: 'Complete sentences to see how the verb fits into real conversations. Tap any word for a translation.',
        progressTitle: 'Watch Your Growth',
        progressBody: 'Track your accuracy and vocabulary mastery in the Dashboard. Consistency is key!',
        next: 'Next',
        getStarted: 'Get Started',
        skip: 'Skip'
    },
    'Traditional Chinese': {
        welcomeTitle: '精通動詞變化',
        welcomeBody: 'Falling in Verb 透過專注練習與情境，幫助您內化動詞變化。',
        verbTitle: '認識您的動詞',
        verbBody: '每次練習專注於一個動詞。您會看到它的意義與類別（如 -ar, -er, -ir）。',
        formsTitle: '建構型態',
        formsBody: '練習針對不同人稱與時態進行動詞變化。犯錯也沒關係！',
        contextTitle: '情境應用',
        contextBody: '完成句子以了解動詞如何在真實對話中應用。點擊單字即可查看翻譯。',
        progressTitle: '追蹤成長',
        progressBody: '在儀表板追蹤您的準確率與單字掌握度。持之以恆是關鍵！',
        next: '下一步',
        getStarted: '開始',
        skip: '跳過'
    },
    'Japanese': {
        welcomeTitle: '動詞活用をマスター',
        welcomeBody: 'Falling in Verbは、集中練習と文脈を通じて動詞の活用を自然に身につけるのをサポートします。',
        verbTitle: '動詞に出会う',
        verbBody: '各セッションは1つの動詞に集中します。意味やグループ（五段、一段など）を確認できます。',
        formsTitle: '形を作る',
        formsBody: '異なる人称や時制で動詞を活用させる練習をします。間違いを恐れずに！',
        contextTitle: '文脈で使う',
        contextBody: '文を完成させて、実際の会話でどう使われるか確認しましょう。単語をタップすると翻訳が表示されます。',
        progressTitle: '成長を記録',
        progressBody: 'ダッシュボードで正答率や語彙の習得度を確認できます。継続こそが力なり！',
        next: '次へ',
        getStarted: '始める',
        skip: 'スキップ'
    },
    'Portuguese': {
        welcomeTitle: 'Domine as Conjugações',
        welcomeBody: 'O Falling in Verb ajuda você a internalizar formas verbais através de prática focada e contexto.',
        verbTitle: 'Conheça seu Verbo',
        verbBody: 'Cada sessão foca em um verbo. Você verá seu significado e grupo (ex: -ar, -er, -ir).',
        formsTitle: 'Construa as Formas',
        formsBody: 'Pratique a conjugação do verbo em diferentes pronomes e tempos. Não se preocupe se errar!',
        contextTitle: 'Use no Contexto',
        contextBody: 'Complete frases para ver como o verbo se encaixa em conversas reais. Toque em qualquer palavra para ver a tradução.',
        progressTitle: 'Acompanhe seu Progresso',
        progressBody: 'Acompanhe sua precisão e domínio do vocabulário no Painel. A consistência é a chave!',
        next: 'Próximo',
        getStarted: 'Começar',
        skip: 'Pular'
    },
    'Spanish': {
        welcomeTitle: 'Domina las Conjugaciones',
        welcomeBody: 'Falling in Verb te ayuda a internalizar las formas verbales mediante práctica enfocada y contexto.',
        verbTitle: 'Conoce tu Verbo',
        verbBody: 'Cada sesión se centra en un verbo. Verás su significado y grupo (ej. -ar, -er, -ir).',
        formsTitle: 'Construye las Formas',
        formsBody: 'Practica la conjugación del verbo en diferentes pronombres y tiempos. ¡No te preocupes si te equivocas!',
        contextTitle: 'Úsalo en Contexto',
        contextBody: 'Completa oraciones para ver cómo encaja el verbo en conversaciones reales. Toca cualquier palabra para ver la traducción.',
        progressTitle: 'Mira tu Crecimiento',
        progressBody: 'Sigue tu precisión y dominio del vocabulario en el Panel. ¡La constancia es clave!',
        next: 'Siguiente',
        getStarted: 'Empezar',
        skip: 'Saltar'
    },
    'French': {
        welcomeTitle: 'Maîtrisez les Conjugaisons',
        welcomeBody: 'Falling in Verb vous aide à internaliser les formes verbales grâce à une pratique ciblée et au contexte.',
        verbTitle: 'Rencontrez votre Verbe',
        verbBody: 'Chaque session se concentre sur un verbe. Vous verrez sa signification et son groupe (ex. -er, -ir).',
        formsTitle: 'Construisez les Formes',
        formsBody: 'Entraînez-vous à conjuguer le verbe avec différents pronoms et temps. Ne vous inquiétez pas si vous faites des erreurs !',
        contextTitle: 'Utilisez-le en Contexte',
        contextBody: 'Complétez des phrases pour voir comment le verbe s\'intègre dans de vraies conversations. Appuyez sur n\'importe quel mot pour voir la traduction.',
        progressTitle: 'Suivez votre Progression',
        progressBody: 'Suivez votre précision et votre maîtrise du vocabulaire dans le tableau de bord. La régularité est la clé !',
        next: 'Suivant',
        getStarted: 'Commencer',
        skip: 'Passer'
    }
};

const TEXT_OVERRIDES: Record<Language, Record<string, any>> = {
    jp: {
        'English': {
            verbBody: 'Every session focuses on one verb. You\'ll see its meaning and group (e.g., Godan, Ichidan).',
            formsBody: 'Practice conjugating the verb across different forms and politeness levels. Don\'t worry if you make mistakes!'
        },
        'Traditional Chinese': {
            verbBody: '每次練習專注於一個動詞。您會看到它的意義與類別（如 五段、一段）。',
            formsBody: '練習針對不同型態與禮貌程度進行動詞變化。犯錯也沒關係！'
        },
        'Japanese': {
            verbBody: '各セッションは1つの動詞に集中します。意味やグループ（五段、一段など）を確認できます。',
            formsBody: '異なる活用形や丁寧さで動詞を活用させる練習をします。間違いを恐れずに！'
        },
        'Portuguese': {
            verbBody: 'Cada sessão foca em um verbo. Você verá seu significado e grupo (ex: Godan, Ichidan).',
            formsBody: 'Pratique a conjugação do verbo em diferentes formas e níveis de polidez. Não se preocupe se errar!'
        },
        'Spanish': {
            verbBody: 'Cada sesión se centra en un verbo. Verás su significado y grupo (ej. Godan, Ichidan).',
            formsBody: 'Practica la conjugación del verbo en diferentes formas y niveles de cortesía. ¡No te preocupes si te equivocas!'
        },
        'French': {
            verbBody: 'Chaque session se concentre sur un verbe. Vous verrez sa signification et son groupe (ex. Godan, Ichidan).',
            formsBody: 'Entraînez-vous à conjuguer le verbe sous différentes formes et niveaux de politesse. Ne vous inquiétez pas si vous faites des erreurs !'
        }
    },
    fr: {
        'English': {
            verbBody: 'Every session focuses on one verb. You\'ll see its meaning and group (e.g., -er, -ir, -re).'
        },
        'Traditional Chinese': {
            verbBody: '每次練習專注於一個動詞。您會看到它的意義與類別（如 -er, -ir, -re）。'
        },
        'Japanese': {
            verbBody: '各セッションは1つの動詞に集中します。意味やグループ（-er, -ir, -reなど）を確認できます。'
        },
        'Portuguese': {
            verbBody: 'Cada sessão foca em um verbo. Você verá seu significado e grupo (ex: -er, -ir, -re).'
        },
        'Spanish': {
            verbBody: 'Cada sesión se centra en un verbo. Verás su significado y grupo (ej. -er, -ir, -re).'
        },
        'French': {
            verbBody: 'Chaque session se concentre sur un verbe. Vous verrez sa signification et son groupe (ex. -er, -ir, -re).'
        }
    },
    pt: {}, es: {}
};

const EXAMPLE_DATA: Record<Language, Record<string, any>> = {
    pt: {
        'English': { meaning: 'to love', translation: 'I love coffee.' },
        'Traditional Chinese': { meaning: '愛', translation: '我愛咖啡。' },
        'Japanese': { meaning: '愛する', translation: '私はコーヒーが好きです。' },
        'Portuguese': { meaning: 'amar', translation: 'Eu amo café.' },
        'Spanish': { meaning: 'amar', translation: 'Amo el café.' },
        'French': { meaning: 'aimer', translation: 'J\'aime le café.' },
        // Common data
        verb: 'amar',
        group: '-ar',
        conjugations: [
            { tense: 'Presente', pronoun: 'Eu', form: 'amo' },
            { tense: 'Passado', pronoun: 'Eu', form: 'amei' },
            { tense: 'Futuro', pronoun: 'Eu', form: 'amarei' }
        ],
        sentence: { start: 'Eu', word: 'amo', end: 'café.' }
    },
    es: {
        'English': { meaning: 'to love', translation: 'I love coffee.' },
        'Traditional Chinese': { meaning: '愛', translation: '我愛咖啡。' },
        'Japanese': { meaning: '愛する', translation: '私はコーヒーが好きです。' },
        'Portuguese': { meaning: 'amar', translation: 'Eu amo café.' },
        'Spanish': { meaning: 'amar', translation: 'Amo el café.' },
        'French': { meaning: 'aimer', translation: 'J\'aime le café.' },
        // Common data
        verb: 'amar',
        group: '-ar',
        conjugations: [
            { tense: 'Presente', pronoun: 'Yo', form: 'amo' },
            { tense: 'Pasado', pronoun: 'Yo', form: 'amé' },
            { tense: 'Futuro', pronoun: 'Yo', form: 'amaré' }
        ],
        sentence: { start: 'Yo', word: 'amo', end: 'el café.' }
    },
    fr: {
        'English': { meaning: 'to love', translation: 'I love coffee.' },
        'Traditional Chinese': { meaning: '愛', translation: '我愛咖啡。' },
        'Japanese': { meaning: '愛する', translation: '私はコーヒーが好きです。' },
        'Portuguese': { meaning: 'amar', translation: 'Eu amo café.' },
        'Spanish': { meaning: 'amar', translation: 'Amo el café.' },
        'French': { meaning: 'aimer', translation: 'J\'aime le café.' },
        // Common data
        verb: 'aimer',
        group: '-er',
        conjugations: [
            { tense: 'Présent', pronoun: 'Je', form: 'aime' },
            { tense: 'Passé', pronoun: 'J\'', form: 'ai aimé' },
            { tense: 'Futur', pronoun: 'J\'', form: 'aimerai' }
        ],
        sentence: { start: 'J\'', word: 'aime', end: 'le café.' }
    },
    jp: {
        'English': { meaning: 'to eat', translation: 'I eat sushi.' },
        'Traditional Chinese': { meaning: '吃', translation: '我吃壽司。' },
        'Japanese': { meaning: '食べる', translation: '私は寿司を食べる。' },
        'Portuguese': { meaning: 'comer', translation: 'Eu como sushi.' },
        'Spanish': { meaning: 'comer', translation: 'Como sushi.' },
        'French': { meaning: 'manger', translation: 'Je mange des sushis.' },
        // Common data
        verb: '食べる',
        group: 'Ichidan',
        conjugations: [
            { tense: '現在形', pronoun: 'Plain', form: '食べる' },
            { tense: '過去形', pronoun: 'Plain', form: '食べた' },
            { tense: 'て形', pronoun: 'Plain', form: '食べて' }
        ],
        sentence: { start: '私は寿司を', word: '食べる', end: '。' }
    }
};

// --- SUB-COMPONENTS ---

const AnimatedChart = () => {
    const [draw, setDraw] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setDraw(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-48 h-48 bg-white rounded-3xl shadow-lg border border-stone-100 flex items-center justify-center overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-5">
                <div className="w-full h-px bg-stone-900"></div>
                <div className="w-full h-px bg-stone-900"></div>
                <div className="w-full h-px bg-stone-900"></div>
                <div className="w-full h-px bg-stone-900"></div>
            </div>

            {/* Line Chart */}
            <svg viewBox="0 0 100 60" className="w-full h-full p-6 overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Area */}
                <path
                    d="M 10,50 L 30,35 L 50,40 L 70,20 L 90,10 L 90,60 L 10,60 Z"
                    fill="url(#chartGradient)"
                    className={`transition-opacity duration-700 ${draw ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Line */}
                <path
                    d="M 10,50 L 30,35 L 50,40 L 70,20 L 90,10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="100"
                    strokeDashoffset={draw ? 0 : 100}
                    className="transition-all duration-[1s] ease-out"
                />
                {/* Data Points */}
                {[
                    { cx: 10, cy: 50, delay: 0 },
                    { cx: 30, cy: 35, delay: 200 },
                    { cx: 50, cy: 40, delay: 400 },
                    { cx: 70, cy: 20, delay: 600 },
                    { cx: 90, cy: 10, delay: 800 }
                ].map((point, i) => (
                    <circle
                        key={i}
                        cx={point.cx}
                        cy={point.cy}
                        r="2.5"
                        fill="white"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        className={`transition-all duration-300 ease-out ${draw ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        style={{ transitionDelay: `${point.delay}ms` }}
                    />
                ))}
            </svg>
        </div>
    );
};

export const Tutorial: React.FC<Props> = ({ onFinish, uiLabels, explanationLanguage, targetLanguage }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);
    const [showConjugation, setShowConjugation] = useState(false);

    // Swipe handling
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    const baseText = TUTORIAL_TEXT[explanationLanguage] || TUTORIAL_TEXT['English'];
    const overrides = TEXT_OVERRIDES[targetLanguage]?.[explanationLanguage] || TEXT_OVERRIDES[targetLanguage]?.['English'] || {};

    const text = {
        ...baseText,
        ...overrides
    };

    const exampleBase = EXAMPLE_DATA[targetLanguage] || EXAMPLE_DATA['pt'];
    const localizedExample = exampleBase[explanationLanguage] || exampleBase['English'];

    const example = {
        ...exampleBase,
        ...localizedExample
    };

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
            setShowTranslation(false);
            setShowConjugation(false);
        } else {
            onFinish();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
            setShowTranslation(false);
            setShowConjugation(false);
        }
    };

    const slides = [
        {
            id: 'welcome',
            title: text.welcomeTitle,
            body: text.welcomeBody,
            visual: (
                <div className="w-40 h-40 rounded-3xl flex items-center justify-center bg-mist text-rose-dust shadow-lg border border-mist-dark">
                    <BookOpen size={64} />
                </div>
            ),
            bgGradient: 'from-mist/30 via-white to-white'
        },
        {
            id: 'verb-card',
            title: text.verbTitle,
            body: text.verbBody,
            visual: (
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 w-full max-w-xs text-center space-y-4">
                    <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{example.group}</span>
                    <h2 className="text-5xl font-bold text-stone-800 tracking-tight">{example.verb}</h2>
                    <p className="text-xl text-stone-500 font-serif italic">{example.meaning}</p>
                </div>
            ),
            bgGradient: 'from-stone-50 via-white to-white'
        },
        {
            id: 'conjugation',
            title: text.formsTitle,
            body: text.formsBody,
            visual: (
                <div
                    onClick={() => setShowConjugation(true)}
                    className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 w-full max-w-xs space-y-3 cursor-pointer active:scale-[0.98] transition-transform duration-200 relative"
                >
                    {(example.conjugations || []).map((conj: any, idx: number) => (
                        <div key={idx} className={`flex justify-between items-center text-base border-b border-stone-100 pb-3 ${idx === (example.conjugations || []).length - 1 ? 'border-b-0 pb-0' : ''}`}>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">{conj.tense}</span>
                                <span className="font-bold text-stone-500">{conj.pronoun}</span>
                            </div>
                            <div className="relative">
                                <span className={`font-mono text-accent-dark bg-accent-light px-3 py-1 rounded-lg font-bold transition-all duration-300 ${showConjugation ? 'opacity-100' : 'opacity-0'}`}>
                                    {conj.form}
                                </span>
                                {!showConjugation && (
                                    <span className="absolute inset-0 flex items-center justify-center text-stone-400 font-mono">?</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {!showConjugation && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-3xl">
                            <p className="text-[10px] text-accent-dark uppercase tracking-widest font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-accent-light">Tap to Reveal</p>
                        </div>
                    )}
                </div>
            ),
            bgGradient: 'from-accent-light/30 via-white to-white'
        },
        {
            id: 'context',
            title: text.contextTitle,
            body: text.contextBody,
            visual: (
                <div
                    onClick={() => setShowTranslation(true)}
                    className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 w-full max-w-xs text-left space-y-6 cursor-pointer active:scale-[0.98] transition-transform duration-200"
                >
                    <div className="flex gap-2 items-center text-xl text-stone-700 flex-wrap font-medium leading-relaxed">
                        <span>{example.sentence.start}</span>
                        <span className={`font-bold text-primary-dark border-b-2 border-primary-light px-1 transition-colors duration-300 ${showTranslation ? 'bg-primary-light' : ''}`}>{example.sentence.word}</span>
                        <span>{example.sentence.end}</span>
                    </div>
                    <div className={`transition-all duration-300 ease-out transform ${showTranslation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        <p className="text-base text-stone-500 italic font-medium border-l-4 border-secondary-light pl-3">{example.translation}</p>
                    </div>
                    {!showTranslation && (
                        <div className="absolute bottom-4 left-0 w-full flex justify-center">
                            <p className="text-[10px] text-secondary-dark uppercase tracking-widest font-bold">Tap to Translate</p>
                        </div>
                    )}
                </div>
            ),
            bgGradient: 'from-secondary-light/30 via-white to-white'
        },
        {
            id: 'progress',
            title: text.progressTitle,
            body: text.progressBody,
            visual: <AnimatedChart />,
            bgGradient: 'from-accent-light/30 via-white to-white'
        }
    ];

    const current = slides[currentSlide];
    const isLastSlide = currentSlide === slides.length - 1;

    return (
        <div
            className={`flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 w-full h-full min-h-[60vh] transition-colors duration-500 bg-gradient-to-b ${current.bgGradient} relative overflow-hidden`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >

            {/* Skip Button */}
            <button
                onClick={onFinish}
                className="absolute top-6 right-6 p-2 text-stone-grey hover:text-charcoal hover:bg-mist rounded-full transition-all z-20"
                title={text.skip}
            >
                <X size={24} />
            </button>

            {/* Slide Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full space-y-10 text-center max-w-md mx-auto z-10">

                {/* Visual Area */}
                <div className="h-64 flex items-center justify-center w-full">
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 ease-out fill-mode-both" key={current.id + 'visual'}>
                        {current.visual}
                    </div>
                </div>

                {/* Text Area */}
                <div className="space-y-4 max-w-xs mx-auto">
                    <h2 className="text-3xl font-bold text-charcoal tracking-tight animate-in slide-in-from-bottom-2 fade-in duration-500 delay-75 fill-mode-both" key={current.id + 'title'}>
                        {current.title}
                    </h2>
                    <p className="text-stone-grey text-lg leading-relaxed animate-in slide-in-from-bottom-3 fade-in duration-500 delay-150 fill-mode-both" key={current.id + 'body'}>
                        {current.body}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="w-full max-w-md mx-auto pt-10 space-y-8 z-10">

                {/* Dots */}
                <div className="flex justify-center gap-3">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ease-out ${idx === currentSlide ? 'w-8 bg-charcoal' : 'w-2 bg-mist'}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`p-4 rounded-2xl font-bold text-stone-grey hover:text-charcoal hover:bg-mist transition-all active:scale-95 ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex-1 bg-charcoal text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-charcoal/90 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="flex items-center gap-2">
                            {isLastSlide ? (
                                <> {text.getStarted} <Play size={20} fill="currentColor" /></>
                            ) : (
                                <> {text.next} <ChevronRight size={20} /></>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
