import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Play, BookOpen, TrendingUp } from 'lucide-react';

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
        getStarted: 'Get Started'
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
        getStarted: '開始'
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
        getStarted: '始める'
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
        getStarted: 'Começar'
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
        getStarted: 'Empezar'
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
        getStarted: 'Commencer'
    }
};

const EXAMPLE_DATA: Record<Language, any> = {
    pt: {
        verb: 'amar',
        group: '-ar',
        meaning: 'to love',
        conjugation: { pronoun: 'Eu', form: 'amo' },
        sentence: { start: 'Eu', word: 'amo', end: 'café.', translation: 'I love coffee.' }
    },
    es: {
        verb: 'amar',
        group: '-ar',
        meaning: 'to love',
        conjugation: { pronoun: 'Yo', form: 'amo' },
        sentence: { start: 'Yo', word: 'amo', end: 'el café.', translation: 'I love coffee.' }
    },
    fr: {
        verb: 'aimer',
        group: '-er',
        meaning: 'to love',
        conjugation: { pronoun: 'J\'', form: 'aime' },
        sentence: { start: 'J\'', word: 'aime', end: 'le café.', translation: 'I love coffee.' }
    },
    jp: {
        verb: '食べる',
        group: 'Ichidan',
        meaning: 'to eat',
        conjugation: { pronoun: 'Plain', form: '食べる' },
        sentence: { start: '私は寿司を', word: '食べる', end: '。', translation: 'I eat sushi.' }
    }
};

export const Tutorial: React.FC<Props> = ({ onFinish, uiLabels, explanationLanguage, targetLanguage }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);

    const text = TUTORIAL_TEXT[explanationLanguage] || TUTORIAL_TEXT['English'];
    const example = EXAMPLE_DATA[targetLanguage] || EXAMPLE_DATA['pt'];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
            setShowTranslation(false); // Reset translation reveal
        } else {
            onFinish();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
            setShowTranslation(false);
        }
    };

    const slides = [
        {
            id: 'welcome',
            title: text.welcomeTitle,
            body: text.welcomeBody,
            icon: <BookOpen size={64} className="text-rose-500 drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-rose-50 to-white text-rose-500'
        },
        {
            id: 'verb-card',
            title: text.verbTitle,
            body: text.verbBody,
            visual: (
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-rose-100/50 border border-white/50 w-full max-w-xs text-center space-y-3 transform transition-transform hover:scale-105 duration-300">
                    <span className="inline-block px-3 py-1 bg-stone-100/80 text-stone-500 text-[10px] font-bold rounded-full uppercase tracking-wider">{example.group}</span>
                    <h2 className="text-5xl font-black text-stone-700 tracking-tight">{example.verb}</h2>
                    <p className="text-xl text-stone-400 font-medium">{example.meaning}</p>
                </div>
            ),
            color: 'bg-white'
        },
        {
            id: 'conjugation',
            title: text.formsTitle,
            body: text.formsBody,
            visual: (
                <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl shadow-emerald-100/50 border border-white/50 w-full max-w-xs space-y-3">
                    <div className="flex justify-between items-center text-base border-b border-stone-100 pb-2">
                        <span className="font-bold text-stone-400">{example.conjugation.pronoun}</span>
                        <span className="font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg font-bold">{example.conjugation.form}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-stone-100 pb-2 opacity-50">
                        <span className="font-bold text-stone-400">...</span>
                        <span className="font-mono text-stone-300">...</span>
                    </div>
                    <div className="flex justify-between items-center text-sm opacity-30">
                        <span className="font-bold text-stone-400">...</span>
                        <span className="font-mono text-stone-300">...</span>
                    </div>
                </div>
            ),
            color: 'bg-gradient-to-br from-emerald-50 to-white text-emerald-600'
        },
        {
            id: 'context',
            title: text.contextTitle,
            body: text.contextBody,
            visual: (
                <div
                    onClick={() => setShowTranslation(true)}
                    className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-amber-100/50 border border-white/50 w-full max-w-xs text-left space-y-4 cursor-pointer group transition-all hover:shadow-amber-200/50"
                >
                    <div className="flex gap-2 items-center text-xl text-stone-600 flex-wrap font-medium">
                        <span>{example.sentence.start}</span>
                        <span className="font-bold text-rose-500 border-b-2 border-rose-200 px-1">{example.sentence.word}</span>
                        <span>{example.sentence.end}</span>
                    </div>
                    <div className={`transition-all duration-500 ease-out ${showTranslation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        <p className="text-sm text-stone-500 italic font-medium">{example.sentence.translation}</p>
                    </div>
                    {!showTranslation && (
                        <p className="text-[10px] text-stone-300 uppercase tracking-widest font-bold text-center animate-pulse">Tap to reveal</p>
                    )}
                </div>
            ),
            color: 'bg-gradient-to-br from-amber-50 to-white text-amber-600'
        },
        {
            id: 'progress',
            title: text.progressTitle,
            body: text.progressBody,
            icon: <TrendingUp size={64} className="text-blue-500 drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-blue-50 to-white text-blue-500'
        }
    ];

    const current = slides[currentSlide];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 w-full max-w-md mx-auto h-full min-h-[60vh]">

            {/* Slide Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8 text-center">

                {/* Visual Area */}
                <div className="h-56 flex items-center justify-center w-full perspective-1000">
                    {current.visual ? (
                        <div className="animate-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" key={current.id + 'visual'}>
                            {current.visual}
                        </div>
                    ) : (
                        <div className={`w-40 h-40 rounded-[2.5rem] flex items-center justify-center ${current.color} animate-in zoom-in-95 rotate-in-3 duration-700 shadow-2xl shadow-stone-100 ease-out`} key={current.id + 'icon'}>
                            {current.icon}
                        </div>
                    )}
                </div>

                {/* Text Area */}
                <div className="space-y-4 max-w-xs mx-auto">
                    <h2 className="text-3xl font-black text-stone-700 tracking-tight animate-in slide-in-from-bottom-2 fade-in duration-700 delay-100 fill-mode-both" key={current.id + 'title'}>
                        {current.title}
                    </h2>
                    <p className="text-stone-500 text-lg leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200 fill-mode-both" key={current.id + 'body'}>
                        {current.body}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="w-full pt-10 space-y-8">

                {/* Dots */}
                <div className="flex justify-center gap-2">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${idx === currentSlide ? 'w-8 bg-rose-400' : 'w-2 bg-stone-200'}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`p-4 rounded-2xl font-bold text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-all active:scale-95 ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-rose-200 hover:bg-rose-600 hover:shadow-rose-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        {currentSlide === slides.length - 1 ? (
                            <> {text.getStarted} <Play size={20} fill="currentColor" className="group-hover:translate-x-1 transition-transform" /></>
                        ) : (
                            <> {text.next} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
