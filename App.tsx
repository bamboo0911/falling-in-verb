import React, { useState, useEffect, useRef } from 'react';
import {
  AppPhase,
  VerbData,
  SentenceProblem,
  UserConjugationInput,
  UserSentenceInput,
  Language,
  LANGUAGE_CONFIGS
} from './types';
import { generateRandomVerb, generateSentences } from './services/geminiService';
import { ConjugationTable } from './components/ConjugationTable';
import { SentenceQuiz } from './components/SentenceQuiz';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Logo } from './components/Logo';
import { BookOpen, ArrowRight, RefreshCw, CheckCircle, GraduationCap, RotateCw, AlertCircle, WifiOff, ChevronDown, XCircle, Timer, Play, LogOut, User as UserIcon, LogIn, Globe, Settings as SettingsIcon, LayoutDashboard, Home, BrainCircuit, BookText, ClipboardList } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { dbService } from './services/dbService';
import { ProfileDashboard } from './components/ProfileDashboard';
import { Settings } from './components/Settings';
import { Tutorial } from './components/Tutorial';

const INSTRUCTION_LANGUAGES = [
  { id: 'English', label: 'English', flag: '🇺🇸' },
  { id: 'Traditional Chinese', label: '繁體中文', flag: '🇹🇼' },
  { id: 'Portuguese', label: 'Português', flag: '🇧🇷' },
  { id: 'Spanish', label: 'Español', flag: '🇪🇸' },
  { id: 'Japanese', label: '日本語', flag: '🇯🇵' },
  { id: 'French', label: 'Français', flag: '🇫🇷' },
];

const TARGET_LANGUAGE_NAMES: Record<string, Record<Language, string>> = {
  'English': { pt: 'Portuguese (BR)', es: 'Spanish', fr: 'French', jp: 'Japanese' },
  'Traditional Chinese': { pt: '葡萄牙語 (BR)', es: '西班牙語', fr: '法語', jp: '日語' },
  'Japanese': { pt: 'ポルトガル語 (BR)', es: 'スペイン語', fr: 'フランス語', jp: '日本語' },
  'Portuguese': { pt: 'Português (BR)', es: 'Espanhol', fr: 'Francês', jp: 'Japonês' },
  'Spanish': { pt: 'Portugués (BR)', es: 'Español', fr: 'Francés', jp: 'Japonés' },
  'French': { pt: 'Portugais (BR)', es: 'Espagnol', fr: 'Français', jp: 'Japonais' },
};

const UI_TEXT: Record<string, any> = {
  'English': {
    landingTitle: 'Pick a Language',
    landingSubtitle: 'Pick a language to start.',
    loadingFinding: 'Finding a lovely verb...',
    loadingSentences: 'Dreaming up sentences...',
    verbOfMoment: 'Verb of the moment',
    section1Header: 'Conjugations',
    section1HeaderJP: 'Forms & Politeness',
    complete: 'Complete',
    mistakes: 'Mistakes',
    checkAnswers: 'Check Answers',
    finish: 'Finish',
    next: 'Next',
    startContext: 'Start Context Practice',
    section2Header: 'Context Challenge',
    contextInstructions: 'Fill in the blanks with the correct form of',
    tapWord: 'Tap on any other word to see its translation.',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    nextVerb: 'Next Verb',
    nextVerbAction: 'Next Verb',
    sessionComplete: 'Session Complete',
    time: 'Time',
    part1: 'Part 1',
    part2: 'Part 2',
    connectionFailed: 'Connection Failed',
    tryAgain: 'Try Again',
    skipVerb: 'Skip this verb',
    letsGo: "Let's Go!",
    loginGoogle: 'Sign in with Google',
    guest: 'Continue as Guest',
    welcome: 'Welcome',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    loginMarketing: 'Save your progress and track your journey.',
    loginTitle: 'Master Verbs',
    changeLanguage: 'Add/Change Language',
    tabTutorial: 'Tutorial',
    tabHome: 'Home',
    tabQuiz: 'Quiz',
    tabSettings: 'Settings',
    tutorialComingSoon: 'Lessons Coming Soon',
    tutorialDesc: 'Structured lessons and grammar guides are under construction.',
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your preferences',
    targetLanguage: 'Target Language',
    explanationLanguage: 'Explanation Language',
    yourProgress: 'Your Progress',
    trackJourney: 'Track your learning journey',
    select: 'Select',
    locked: 'Locked',
    loadingStats: 'Loading stats...',
    noData: 'No Data Yet',
    noDataDesc: 'Complete your first verb practice to visualize your progress here.',
    days: 'Days',
    total: 'Total',
    recentAccuracy: 'Recent Accuracy',
    swipeNavigate: 'Swipe to navigate',
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No recent activity.',
    perfect: 'Perfect',
    err: 'err',
    startPractice: 'Start Practice',
    accuracyTrend: 'Accuracy Trend',
    dailyVolume: 'Daily Volume',
    avgTime: 'Avg. Time per Verb',
    vocabMastery: 'Vocabulary Mastery',
    verbs: 'Verbs'
  },
  'Traditional Chinese': {
    landingTitle: '選擇語言',
    landingSubtitle: '選擇一種語言開始。',
    loadingFinding: '正在尋找動詞...',
    loadingSentences: '正在發想例句...',
    verbOfMoment: '當前動詞',
    section1Header: '動詞變化',
    section1HeaderJP: '型態與禮貌體',
    complete: '完成',
    mistakes: '個錯誤',
    checkAnswers: '檢查答案',
    finish: '完成',
    next: '下一步',
    startContext: '開始情境練習',
    section2Header: '情境挑戰',
    contextInstructions: '填入正確的動詞形式：',
    tapWord: '點擊其他單字可查看翻譯。',
    correct: '正確！',
    incorrect: '不正確',
    nextVerb: '下一個動詞',
    nextVerbAction: '下一個動詞',
    sessionComplete: '練習完成',
    time: '時間',
    part1: '第一部分',
    part2: '第二部分',
    connectionFailed: '連線失敗',
    tryAgain: '重試',
    skipVerb: '跳過此動詞',
    letsGo: "開始！",
    loginGoogle: '使用 Google 登入',
    guest: '以訪客身份繼續',
    welcome: '歡迎',
    signOut: '登出',
    signIn: '登入',
    loginMarketing: '登入以儲存您的學習進度。',
    loginTitle: '精通動詞變化',
    changeLanguage: '新增/更換語言',
    tabTutorial: '教學',
    tabHome: '首頁',
    tabQuiz: '測驗',
    tabSettings: '設定',
    tutorialComingSoon: '教學內容敬請期待',
    tutorialDesc: '結構化的課程與文法指南正在建置中。',
    settingsTitle: '設定',
    settingsSubtitle: '管理您的偏好設定',
    targetLanguage: '目標語言',
    explanationLanguage: '解說語言',
    yourProgress: '您的進度',
    trackJourney: '追蹤您的學習歷程',
    select: '選擇',
    locked: '未解鎖',
    loadingStats: '載入統計數據...',
    noData: '尚無數據',
    noDataDesc: '完成第一次動詞練習以在此查看您的進度。',
    days: '天',
    total: '總計',
    recentAccuracy: '近期準確率',
    swipeNavigate: '滑動以切換',
    recentActivity: '近期活動',
    noRecentActivity: '無近期活動。',
    perfect: '完美',
    err: '錯',
    startPractice: '開始練習',
    accuracyTrend: '準確率趨勢',
    dailyVolume: '每日練習量',
    avgTime: '平均每詞時間',
    vocabMastery: '詞彙掌握度',
    verbs: '動詞'
  },
  'Portuguese': {
    landingTitle: 'Escolha um Idioma',
    landingSubtitle: 'Escolha um idioma para começar.',
    loadingFinding: 'Procurando um verbo...',
    loadingSentences: 'Criando frases...',
    verbOfMoment: 'Verbo do momento',
    section1Header: 'Conjugações',
    section1HeaderJP: 'Formas e Polidez',
    complete: 'Completo',
    mistakes: 'Erros',
    checkAnswers: 'Verificar',
    finish: 'Terminar',
    next: 'Próximo',
    startContext: 'Praticar Contexto',
    section2Header: 'Desafio de Contexto',
    contextInstructions: 'Preencha as lacunas com a forma correta de',
    tapWord: 'Toque nas palavras para ver a tradução.',
    correct: 'Correto!',
    incorrect: 'Incorreto',
    nextVerb: 'Próximo Verbo',
    nextVerbAction: 'Próximo Verbo',
    sessionComplete: 'Sessão Completa',
    time: 'Tempo',
    part1: 'Parte 1',
    part2: 'Parte 2',
    connectionFailed: 'Falha na Conexão',
    tryAgain: 'Tentar Novamente',
    skipVerb: 'Pular este verbo',
    letsGo: "Vamos lá!",
    loginGoogle: 'Entrar com Google',
    guest: 'Continuar como Convidado',
    welcome: 'Bem-vindo',
    signOut: 'Sair',
    signIn: 'Entrar',
    loginMarketing: 'Salve seu progresso e acompanhe sua jornada.',
    loginTitle: 'Domine os Verbos',
    changeLanguage: 'Mudar Idioma',
    tabTutorial: 'Tutorial',
    tabHome: 'Início',
    tabQuiz: 'Quiz',
    tabSettings: 'Configurações',
    tutorialComingSoon: 'Em breve',
    tutorialDesc: 'Lições estruturadas e guias de gramática estão em construção.',
    settingsTitle: 'Configurações',
    settingsSubtitle: 'Gerencie suas preferências',
    targetLanguage: 'Idioma Alvo',
    explanationLanguage: 'Idioma de Explicação',
    yourProgress: 'Seu Progresso',
    trackJourney: 'Acompanhe sua jornada',
    select: 'Selecionar',
    locked: 'Bloqueado',
    loadingStats: 'Carregando estatísticas...',
    noData: 'Sem Dados',
    noDataDesc: 'Complete sua primeira prática de verbos para visualizar seu progresso aqui.',
    days: 'Dias',
    total: 'Total',
    recentAccuracy: 'Precisão Recente',
    swipeNavigate: 'Deslize para navegar',
    recentActivity: 'Atividade Recente',
    noRecentActivity: 'Nenhuma atividade recente.',
    perfect: 'Perfeito',
    err: 'err',
    startPractice: 'Começar Prática',
    accuracyTrend: 'Tendência de Precisão',
    dailyVolume: 'Volume Diário',
    avgTime: 'Tempo Médio',
    vocabMastery: 'Domínio de Vocabulário',
    verbs: 'Verbos'
  },
  'Spanish': {
    landingTitle: 'Elige un Idioma',
    landingSubtitle: 'Elige un idioma para comenzar.',
    loadingFinding: 'Buscando un verbo...',
    loadingSentences: 'Creando oraciones...',
    verbOfMoment: 'Verbo del momento',
    section1Header: 'Conjugaciones',
    section1HeaderJP: 'Formas y Cortesía',
    complete: 'Completo',
    mistakes: 'Errores',
    checkAnswers: 'Verificar',
    finish: 'Terminar',
    next: 'Siguiente',
    startContext: 'Practicar Contexto',
    section2Header: 'Desafío de Contexto',
    contextInstructions: 'Llena los espacios con la forma correcta de',
    tapWord: 'Toca las palabras para ver la traducción.',
    correct: '¡Correcto!',
    incorrect: 'Incorrecto',
    nextVerb: 'Siguiente Verbo',
    nextVerbAction: 'Siguiente Verbo',
    sessionComplete: 'Sesión Completa',
    time: 'Tiempo',
    part1: 'Parte 1',
    part2: 'Parte 2',
    connectionFailed: 'Fallo de Conexión',
    tryAgain: 'Intentar de Nuevo',
    skipVerb: 'Saltar este verbo',
    letsGo: "¡Vamos!",
    loginGoogle: 'Iniciar sesión con Google',
    guest: 'Continuar como Invitado',
    welcome: 'Bienvenido',
    signOut: 'Cerrar sesión',
    signIn: 'Iniciar sesión',
    loginMarketing: 'Guarda tu progreso y sigue tu viaje.',
    loginTitle: 'Domina los Verbos',
    changeLanguage: 'Cambiar Idioma',
    tabTutorial: 'Tutorial',
    tabHome: 'Inicio',
    tabQuiz: 'Quiz',
    tabSettings: 'Ajustes',
    tutorialComingSoon: 'Próximamente',
    tutorialDesc: 'Lecciones estructuradas y guías de gramática están en construcción.',
    settingsTitle: 'Ajustes',
    settingsSubtitle: 'Gestiona tus preferencias',
    targetLanguage: 'Idioma Objetivo',
    explanationLanguage: 'Idioma de Explicación',
    yourProgress: 'Tu Progreso',
    trackJourney: 'Sigue tu aprendizaje',
    select: 'Seleccionar',
    locked: 'Bloqueado',
    loadingStats: 'Cargando estadísticas...',
    noData: 'Sin Datos',
    noDataDesc: 'Completa tu primera práctica de verbos para ver tu progreso aquí.',
    days: 'Días',
    total: 'Total',
    recentAccuracy: 'Precisión Reciente',
    swipeNavigate: 'Desliza para navegar',
    recentActivity: 'Actividad Reciente',
    noRecentActivity: 'Sin actividad reciente.',
    perfect: 'Perfecto',
    err: 'err',
    startPractice: 'Empezar Práctica',
    accuracyTrend: 'Tendencia de Precisión',
    dailyVolume: 'Volumen Diario',
    avgTime: 'Tiempo Promedio',
    vocabMastery: 'Dominio de Vocabulario',
    verbs: 'Verbos'
  },
  'Japanese': {
    landingTitle: '学習言語の選択',
    landingSubtitle: '学びたい言語を選んでください。',
    loadingFinding: '動詞を読み込み中...',
    loadingSentences: '例文を生成中...',
    verbOfMoment: '今日の動詞',
    section1Header: '活用',
    section1HeaderJP: '活用形',
    complete: '完了',
    mistakes: '誤答数',
    checkAnswers: '答え合わせ',
    finish: '終了',
    next: '次へ',
    startContext: '実践問題へ',
    section2Header: '文脈チャレンジ',
    contextInstructions: '空欄に適切な活用形を入力してください：',
    tapWord: '単語をタップして翻訳を表示',
    correct: '正解！',
    incorrect: '不正解',
    nextVerb: '次の動詞',
    nextVerbAction: '次の動詞',
    sessionComplete: 'セッション完了',
    time: 'タイム',
    part1: 'パート 1',
    part2: 'パート 2',
    connectionFailed: '接続失敗',
    tryAgain: '再試行',
    skipVerb: 'スキップ',
    letsGo: "スタート！",
    loginGoogle: 'Googleでログイン',
    guest: 'ゲストとして利用',
    welcome: 'ようこそ',
    signOut: 'ログアウト',
    signIn: 'ログイン',
    loginMarketing: 'ログインして学習記録を保存しましょう。',
    loginTitle: '動詞マスター',
    changeLanguage: '言語を変更',
    tabTutorial: 'チュートリアル',
    tabHome: 'ホーム',
    tabQuiz: 'クイズ',
    tabSettings: '設定',
    tutorialComingSoon: '近日公開',
    tutorialDesc: '体系的なレッスンと文法ガイドを作成中です。',
    settingsTitle: '設定',
    settingsSubtitle: 'アプリの設定',
    targetLanguage: '学習言語',
    explanationLanguage: '解説言語',
    yourProgress: '学習データ',
    trackJourney: '学習の進捗を確認',
    select: '選択',
    locked: '未解禁',
    loadingStats: 'データを読み込み中...',
    noData: 'データなし',
    noDataDesc: '練習を開始すると、ここにデータが表示されます。',
    days: '日間',
    total: '累計',
    recentAccuracy: '最近の正解率',
    swipeNavigate: 'スワイプで切替',
    recentActivity: '最近の活動',
    noRecentActivity: '履歴がありません。',
    perfect: '全問正解',
    err: '誤',
    startPractice: '練習スタート',
    accuracyTrend: '正解率の推移',
    dailyVolume: '学習量',
    avgTime: '平均回答時間',
    vocabMastery: '語彙の定着度',
    verbs: '語'
  },
  'French': {
    landingTitle: 'Choisissez une langue',
    landingSubtitle: 'Choisissez une langue pour commencer.',
    loadingFinding: 'Recherche d\'un verbe...',
    loadingSentences: 'Création de phrases...',
    verbOfMoment: 'Verbe du moment',
    section1Header: 'Conjugaisons',
    section1HeaderJP: 'Formes et Politesse',
    complete: 'Complet',
    mistakes: 'Erreurs',
    checkAnswers: 'Vérifier',
    finish: 'Terminer',
    next: 'Suivant',
    startContext: 'Pratiquer le contexte',
    section2Header: 'Défi contextuel',
    contextInstructions: 'Remplissez les blancs avec la forme correcte de',
    tapWord: 'Appuyez sur n\'importe quel mot pour voir sa traduction.',
    correct: 'Correct !',
    incorrect: 'Incorrect',
    nextVerb: 'Verbe suivant',
    nextVerbAction: 'Verbe suivant',
    sessionComplete: 'Session terminée',
    time: 'Temps',
    part1: 'Partie 1',
    part2: 'Partie 2',
    connectionFailed: 'Échec de connexion',
    tryAgain: 'Réessayer',
    skipVerb: 'Passer ce verbe',
    letsGo: "C'est parti !",
    loginGoogle: 'Se connecter avec Google',
    guest: 'Continuer en invité',
    welcome: 'Bienvenue',
    signOut: 'Se déconnecter',
    signIn: 'Se connecter',
    loginMarketing: 'Enregistrez vos progrès et suivez votre parcours.',
    loginTitle: 'Maîtrisez les verbes',
    changeLanguage: 'Changer de langue',
    tabTutorial: 'Tutoriel',
    tabHome: 'Accueil',
    tabQuiz: 'Quiz',
    tabSettings: 'Paramètres',
    tutorialComingSoon: 'Bientôt disponible',
    tutorialDesc: 'Des leçons structurées et des guides de grammaire sont en construction.',
    settingsTitle: 'Paramètres',
    settingsSubtitle: 'Gérer vos préférences',
    targetLanguage: 'Langue Cible',
    explanationLanguage: 'Langue d\'Explication',
    yourProgress: 'Votre Progrès',
    trackJourney: 'Suivez votre parcours',
    select: 'Sélectionner',
    locked: 'Verrouillé',
    loadingStats: 'Chargement des statistiques...',
    noData: 'Pas de Données',
    noDataDesc: 'Terminez votre première pratique de verbe pour visualiser vos progrès ici.',
    days: 'Jours',
    total: 'Total',
    recentAccuracy: 'Précision Récente',
    swipeNavigate: 'Glisser pour naviguer',
    recentActivity: 'Activité Récente',
    noRecentActivity: 'Aucune activité récente.',
    perfect: 'Parfait',
    err: 'err',
    startPractice: 'Commencer la Pratique',
    accuracyTrend: 'Tendance de Précision',
    dailyVolume: 'Volume Quotidien',
    avgTime: 'Temps Moyen',
    vocabMastery: 'Maîtrise du Vocabulaire',
    verbs: 'Verbes'
  }
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

// Updated Tab Type
type Tab = 'tutorial' | 'home' | 'quiz' | 'settings';

function AppContent() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();

  // App State
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [language, setLanguage] = useState<Language | null>(null);
  const [instructionLang, setInstructionLang] = useState<string>('Traditional Chinese');
  const [phase, setPhase] = useState<AppPhase>(AppPhase.LOGIN);

  // Learning Data
  const [verbData, setVerbData] = useState<VerbData | null>(null);
  const [sentences, setSentences] = useState<SentenceProblem[]>([]);

  // UI State
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // User Inputs
  const [conjugationInput, setConjugationInput] = useState<UserConjugationInput>({});
  const [sentenceInput, setSentenceInput] = useState<UserSentenceInput>({});

  // Error Calculation
  const [conjugationErrors, setConjugationErrors] = useState<number>(0);
  const [sentenceErrors, setSentenceErrors] = useState<number>(0);

  // Timer States
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownVal, setCountdownVal] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<string | null>(null);

  // Summary Modal State
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Refs for prefetching
  const sentencePromiseRef = useRef<Promise<SentenceProblem[]> | null>(null);
  const nextVerbPromiseRef = useRef<Promise<VerbData> | null>(null);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Helper to get current UI labels
  const ui = UI_TEXT[instructionLang] || UI_TEXT['English'];

  // Auth & Routing Logic
  useEffect(() => {
    const handleAuthChange = async () => {
      if (!authLoading) {
        if (user) {
          // User logged in
          if (phase === AppPhase.LOGIN) {
            const profile = await dbService.syncUserProfile(user);
            setIsGuest(false);

            // Route based on whether they have a current language
            if (profile && profile.currentLanguage) {
              setLanguage(profile.currentLanguage);
              if (profile.instructionLanguage) {
                setInstructionLang(profile.instructionLanguage);
                setActiveTab('home');
                setPhase(AppPhase.DASHBOARD);

                // Check onboarding
                if (!profile.hasCompletedOnboarding) {
                  setShowOnboarding(true);
                }
              } else {
                // Existing user but no instruction language set (migration case)
                setPhase(AppPhase.EXPLANATION_LANGUAGE_SELECTION);
              }
            } else {
              // New user
              setPhase(AppPhase.EXPLANATION_LANGUAGE_SELECTION);
            }
          }
        } else if (!isGuest && phase !== AppPhase.LOGIN) {
          // User logged out
          setPhase(AppPhase.LOGIN);
        }
      }
    };
    handleAuthChange();
  }, [user, authLoading, isGuest, phase]);

  // Scroll to top whenever a new verb is loaded
  useEffect(() => {
    if (verbData) {
      window.scrollTo(0, 0);
    }
  }, [verbData]);

  // --- TIMER & COUNTDOWN LOGIC ---
  useEffect(() => {
    if (!showCountdown) return;
    let timer: any;
    if (countdownVal > 0) {
      timer = setTimeout(() => setCountdownVal((prev) => prev - 1), 1000);
    } else {
      timer = setTimeout(() => {
        setShowCountdown(false);
        setStartTime(Date.now());
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showCountdown, countdownVal]);

  const formatElapsedTime = (start: number) => {
    const end = Date.now();
    const diff = Math.floor((end - start) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Sign in failed:", err);
      if (err.code === 'auth/configuration-not-found') setAuthError("Google Login is not enabled.");
      else if (err.code === 'auth/unauthorized-domain') setAuthError("Domain unauthorized.");
      else setAuthError("Login failed.");
    }
  };

  const handleGuestEntry = () => {
    setIsGuest(true);
    setPhase(AppPhase.EXPLANATION_LANGUAGE_SELECTION);
  };

  const handleHeaderLogoClick = () => {
    if (user || isGuest) {
      setActiveTab('home');
    } else {
      setPhase(AppPhase.LOGIN);
    }
  };

  // --- PREFETCH LOGIC ---
  const prefetchNextVerb = (lang: Language) => {
    nextVerbPromiseRef.current = generateRandomVerb(lang, instructionLang);
  };

  const prefetchSentencesForCurrentVerb = (verb: string, lang: Language) => {
    sentencePromiseRef.current = generateSentences(verb, lang, instructionLang);
  };

  const loadNewVerb = async (lang: Language, isFirstLoad: boolean = false) => {
    if (isFirstLoad) {
      nextVerbPromiseRef.current = null;
      sentencePromiseRef.current = null;
    }

    setPhase(AppPhase.LOADING_VERB);
    setError(null);
    setConjugationInput({});
    setSentenceInput({});
    setSentences([]);
    setConjugationErrors(0);
    setSentenceErrors(0);
    setFinalTime(null);
    setStartTime(null);
    setShowSummaryModal(false);

    // Ensure we are on the Quiz tab when loading a lesson
    setActiveTab('quiz');

    try {
      let data: VerbData;

      if (nextVerbPromiseRef.current && !isFirstLoad) {
        data = await nextVerbPromiseRef.current;
      } else {
        data = await generateRandomVerb(lang, instructionLang);
      }

      setVerbData(data);
      setPhase(AppPhase.CONJUGATION_INPUT);
      setCountdownVal(3);
      setShowCountdown(true);

      prefetchSentencesForCurrentVerb(data.verb, lang);
      prefetchNextVerb(lang);

    } catch (e: any) {
      setError("Something went wrong connecting to the AI.");
      nextVerbPromiseRef.current = null;
      sentencePromiseRef.current = null;
    }
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    if (user) {
      dbService.updateUserLanguage(user.uid, lang);
      // Check if they have completed onboarding
      dbService.getUserProfile(user.uid).then(p => {
        if (p && !p.hasCompletedOnboarding) {
          setShowOnboarding(true);
        }
      });
    } else {
      // Guest: Always show onboarding
      setShowOnboarding(true);
    }
    setActiveTab('home');
    setPhase(AppPhase.DASHBOARD);
  };

  const changeLearningLanguage = (lang: Language) => {
    setLanguage(lang);

    // Clear current quiz data so we don't show old language data
    setVerbData(null);
    setSentences([]);
    nextVerbPromiseRef.current = null;
    sentencePromiseRef.current = null;

    // Persist if logged in
    if (user) {
      dbService.updateUserLanguage(user.uid, lang);
    }
  };

  const handleInstructionLangChange = (lang: string) => {
    setInstructionLang(lang);
    if (user) {
      dbService.updateUserInstructionLanguage(user.uid, lang);
    }
    // Clear current quiz data to force refresh with new instruction language
    setVerbData(null);
    setSentences([]);
    nextVerbPromiseRef.current = null;
    sentencePromiseRef.current = null;
  };

  // --- APP PHASE HANDLING ---

  const handleConjugationChange = (tense: string, person: string, value: string) => {
    setConjugationInput(prev => ({ ...prev, [tense]: { ...prev[tense], [person]: value } }));
  };

  const checkConjugation = () => {
    setPhase(AppPhase.CONJUGATION_REVIEW);
    document.getElementById('conjugation-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let mistakes = 0;
    if (verbData) {
      Object.keys(verbData.tenses).forEach(tense => {
        Object.keys(verbData.tenses[tense]).forEach(person => {
          const userVal = conjugationInput[tense]?.[person]?.trim().toLowerCase() || "";
          const correctVal = verbData.tenses[tense][person].trim().toLowerCase();
          if (userVal !== correctVal) mistakes++;
        });
      });
    }
    setConjugationErrors(mistakes);
  };

  const startSentencePractice = async () => {
    if (!verbData || !language) return;
    setPhase(AppPhase.LOADING_SENTENCES);
    try {
      let generatedSentences: SentenceProblem[];
      if (sentencePromiseRef.current) {
        generatedSentences = await sentencePromiseRef.current;
      } else {
        generatedSentences = await generateSentences(verbData.verb, language, instructionLang);
      }
      if (!generatedSentences || generatedSentences.length === 0) throw new Error("Empty sentences");

      setSentences(generatedSentences);
      setPhase(AppPhase.SENTENCE_INPUT);
      setTimeout(() => document.getElementById('sentence-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (e) {
      setPhase(AppPhase.CONJUGATION_REVIEW);
    }
  };

  const handleSentenceChange = (id: number, value: string) => {
    setSentenceInput(prev => ({ ...prev, [id]: value }));
  };

  const checkSentences = () => {
    setPhase(AppPhase.SENTENCE_REVIEW);

    // Time & Score
    let elapsedSeconds = 0;
    if (startTime) {
      const now = Date.now();
      setFinalTime(formatElapsedTime(startTime));
      elapsedSeconds = Math.floor((now - startTime) / 1000);
    }

    let mistakes = 0;
    sentences.forEach(s => {
      const userVal = sentenceInput[s.id]?.trim().toLowerCase() || "";
      const correctVal = s.correctAnswer.trim().toLowerCase();
      if (userVal !== correctVal) mistakes++;
    });
    setSentenceErrors(mistakes);

    if (user && language && verbData) {
      const config = LANGUAGE_CONFIGS[language];
      const totalQuestions = config.tenses.length * config.pronouns.length;
      dbService.saveSession(user, language, verbData.verb, elapsedSeconds, conjugationErrors, mistakes, totalQuestions, sentences.length);
    }

    setTimeout(() => document.getElementById('sentence-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleNextCycle = () => {
    if (language) loadNewVerb(language);
  };

  const handleSummaryContinue = () => {
    // Return to dashboard (Home) after session
    setShowSummaryModal(false);
    setActiveTab('home');
  };

  const retry = () => {
    if (language) loadNewVerb(language, true);
  };

  // --- RENDERERS ---

  const renderCountdown = () => {
    if (!showCountdown) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="scale-150 transform transition-all duration-300 animate-bounce">
          <span className={`font-black text-rose-300 drop-shadow-sm font-sans ${countdownVal === 0 ? 'text-5xl md:text-6xl' : 'text-8xl'}`}>
            {countdownVal > 0 ? countdownVal : ui.letsGo}
          </span>
        </div>
      </div>
    );
  };

  const renderSummaryModal = () => {
    if (!showSummaryModal || !verbData) return null;
    const currentFlag = language ? LANGUAGE_CONFIGS[language].flag : '✨';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-rose-100 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
          {/* ... Summary Content ... */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-rose-100 shadow-sm">
              <span className="text-3xl filter drop-shadow-sm grayscale-0">{currentFlag}</span>
            </div>
            <p className="text-stone-400 font-bold uppercase tracking-wider text-xs">{ui.sessionComplete}</p>
            <h2 className="text-3xl font-bold text-stone-700">{verbData.verb}</h2>
            <p className="text-rose-400 font-medium">{verbData.englishMeaning}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="col-span-2 bg-stone-50 p-4 rounded-2xl flex items-center justify-between border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500 font-bold text-sm">
                <Timer size={18} /> {ui.time}
              </div>
              <span className="text-xl font-bold text-stone-700">{finalTime || "0:00"}</span>
            </div>
            {/* Stats badges */}
            <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border ${conjugationErrors === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <span className={`text-xs font-bold uppercase ${conjugationErrors === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{ui.part1}</span>
              {conjugationErrors === 0 ? <CheckCircle size={28} className="text-emerald-500" /> : <span className="text-2xl font-bold text-rose-500">-{conjugationErrors}</span>}
            </div>
            <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border ${sentenceErrors === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <span className={`text-xs font-bold uppercase ${sentenceErrors === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{ui.part2}</span>
              {sentenceErrors === 0 ? <CheckCircle size={28} className="text-emerald-500" /> : <span className="text-2xl font-bold text-rose-500">-{sentenceErrors}</span>}
            </div>
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={handleNextCycle}
              className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {ui.nextVerbAction} <Play size={20} fill="currentColor" />
            </button>
            <button
              onClick={handleSummaryContinue}
              className="w-full bg-white text-stone-400 py-2 rounded-xl font-bold text-sm hover:text-stone-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLoginPage = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="space-y-4">
          <div className="w-28 h-28 mx-auto flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
            <Logo className="w-full h-full drop-shadow-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-stone-700 tracking-tight mb-2">{ui.loginTitle}</h1>
            <p className="text-lg text-rose-400 font-medium">{ui.loginMarketing}</p>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <button onClick={handleSignIn} className="w-full bg-white text-stone-600 border border-stone-200 hover:border-rose-200 hover:bg-rose-50 py-4 px-6 rounded-2xl font-bold shadow-lg shadow-rose-50 hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group">
            <GoogleIcon /> <span className="group-hover:text-rose-500 transition-colors">{ui.loginGoogle}</span>
          </button>
          <button onClick={handleGuestEntry} className="text-stone-400 hover:text-stone-600 font-bold text-sm hover:underline underline-offset-4 transition-colors">{ui.guest}</button>
          {authError && <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-2"><AlertCircle size={16} />{authError}</div>}
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <header className="bg-rose-100/80 backdrop-blur-md text-rose-900 py-3 pt-[calc(env(safe-area-inset-top)_+_0.75rem)] md:py-4 px-4 sticky top-0 z-30 border-b border-rose-200/50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleHeaderLogoClick}>
          <Logo className="w-8 h-8 rounded-lg shadow-sm" />
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-rose-900/90">Falling In Verb</h1>
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-2 rounded-full transition-colors ${activeTab === 'settings' ? 'text-rose-500 bg-rose-50' : 'text-rose-900/60 hover:bg-rose-50 hover:text-rose-500'}`}
        >
          <SettingsIcon size={24} />
        </button>
      </div>
    </header>
  );

  const renderLanguageSelection = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto flex items-center justify-center transform rotate-3">
            <Logo className="w-full h-full drop-shadow-xl" />
          </div>
          <h2 className="text-3xl font-bold text-stone-700 tracking-tight">{ui.landingTitle}</h2>
          <p className="text-stone-400 text-lg">{ui.landingSubtitle}</p>
        </div>

        {user && <div className="pb-4 animate-in fade-in slide-in-from-bottom-2"><p className="text-stone-500 font-medium">{ui.welcome}, <span className="text-rose-500 font-bold">{user.displayName}</span>!</p></div>}

        <div className="grid grid-cols-1 gap-4">
          {Object.values(LANGUAGE_CONFIGS).map(conf => {
            const localizedName = TARGET_LANGUAGE_NAMES[instructionLang]?.[conf.id] || conf.name;
            return (
              <button key={conf.id} onClick={() => selectLanguage(conf.id)} className="group relative flex items-center p-5 bg-white border border-rose-100 hover:border-rose-300 rounded-2xl shadow-sm hover:shadow-md hover:shadow-rose-50 transition-all text-left">
                <span className="text-3xl mr-5 group-hover:scale-110 transition-transform opacity-90">{conf.flag}</span>
                <div><h3 className="font-bold text-stone-700 text-lg group-hover:text-rose-500 transition-colors">{localizedName}</h3></div>
                <ArrowRight className="ml-auto text-rose-200 group-hover:text-rose-400 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderExplanationLanguageSelection = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Globe size={40} className="text-rose-400" />
          </div>
          <h1 className="text-3xl font-black text-stone-700 tracking-tight">Explanation Language</h1>
          <p className="text-stone-400 font-medium">Which language should we use to explain things?</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {INSTRUCTION_LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => {
                handleInstructionLangChange(lang.id);
                setPhase(AppPhase.LANGUAGE_SELECTION);
              }}
              className="group relative flex items-center p-4 bg-white border border-stone-200 hover:border-rose-300 rounded-2xl shadow-sm hover:shadow-md hover:shadow-rose-50 transition-all text-left"
            >
              <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">{lang.flag}</span>
              <div>
                <h3 className="font-bold text-stone-700 text-lg group-hover:text-rose-500 transition-colors">{lang.label}</h3>
                <p className="text-xs text-stone-400">{lang.id}</p>
              </div>
              <ArrowRight className="ml-auto text-stone-200 group-hover:text-rose-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboardPage = () => (
    <div className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-6 pb-safe">
      <ProfileDashboard
        variant="page"
        onStart={(lang) => {
          setLanguage(lang);
          // Switch tab to quiz and load the verb
          setActiveTab('quiz');
          loadNewVerb(lang, true);
        }}
        uiLabels={ui}
      />
    </div>
  );

  const renderTutorialPlaceholder = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-2">
        <BookOpen size={48} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-stone-600">{ui.tutorialComingSoon}</h3>
        <p className="text-stone-400 max-w-xs mx-auto leading-relaxed">{ui.tutorialDesc}</p>
      </div>
    </div>
  );

  const renderTutorial = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 h-[80vh]">
        <Tutorial
          onFinish={() => {
            setShowOnboarding(false);
            if (user) {
              dbService.completeOnboarding(user.uid);
            } else {
              localStorage.setItem('hasCompletedOnboarding', 'true');
            }
          }}
          uiLabels={ui}
          explanationLanguage={instructionLang}
          targetLanguage={language}
        />
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 text-center max-w-sm w-full space-y-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
          {error?.includes("Network") ? <WifiOff size={32} /> : <AlertCircle size={32} />}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-stone-700">{ui.connectionFailed}</h3>
          <p className="text-stone-500 text-sm leading-relaxed">{error}</p>
        </div>
        <button onClick={retry} className="w-full bg-rose-200 text-rose-900 py-3 rounded-xl font-bold hover:bg-rose-300 transition-colors">{ui.tryAgain}</button>
      </div>
    </div>
  );

  const renderPracticePage = () => {
    // If no verb loaded yet, show loading or empty state
    if (phase === AppPhase.LOADING_VERB) {
      return <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]"><LoadingSpinner message={ui.loadingFinding} /></div>;
    }

    // If no verb data at all (and not loading), maybe user needs to select language or just start
    if (!language) {
      // This can happen if user clicks "Quiz" tab directly without selecting a language
      return renderLanguageSelection();
    }

    // If language is set but no verb data, we should be loading or showing a start state.
    // Since we handled LOADING_VERB above, this means we are in a state where we should load.
    if (!verbData) {
      // Auto-recover: load a verb if we have a language but no data
      // Use a timeout to avoid render-cycle side-effects
      setTimeout(() => loadNewVerb(language), 0);
      return <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]"><LoadingSpinner message={ui.loadingFinding} /></div>;
    }

    // Otherwise render the practice flow
    const langConfig = LANGUAGE_CONFIGS[language];
    const isConjugationReview = phase !== AppPhase.CONJUGATION_INPUT;
    const showSentences = phase === AppPhase.LOADING_SENTENCES || phase === AppPhase.SENTENCE_INPUT || phase === AppPhase.SENTENCE_REVIEW;

    return (
      <main className={`flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 md:pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-safe pb-24`}>
        <section id="conjugation-card" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rose-100 text-center space-y-3 relative overflow-hidden group">
          <div className="absolute top-4 right-4 z-20">
            <button onClick={handleNextCycle} className="p-3 text-stone-300 hover:text-rose-500 bg-white border border-stone-100 hover:border-rose-200 hover:bg-rose-50 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center gap-2" title={ui.skipVerb}><RotateCw size={20} /></button>
          </div>
          <div className="flex flex-col items-center gap-2 mb-4 relative z-10">
            {verbData.verbGroup && <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold rounded uppercase tracking-wider">{verbData.verbGroup}</span>}
          </div>
          <div className="space-y-1 relative z-10">
            {verbData.reading && verbData.reading !== 'null' && <p className="text-lg text-rose-400 font-medium font-japanese">{verbData.reading}</p>}
            <h2 className="text-4xl md:text-5xl font-bold text-stone-700 tracking-tight lowercase">{verbData.verb}</h2>
          </div>
          <p className="text-xl md:text-2xl text-stone-400 font-light mt-2 relative z-10">{verbData.englishMeaning}</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-stone-600 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs font-bold">1</span>{language === 'jp' ? ui.section1HeaderJP : ui.section1Header}</h3>
            {isConjugationReview && (conjugationErrors === 0 ? <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"><CheckCircle size={14} /> {ui.complete}</span> : <span className="text-rose-500 flex items-center gap-1 text-xs font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100"><XCircle size={14} /> {conjugationErrors} {ui.mistakes}</span>)}
          </div>
          <ConjugationTable verbData={verbData} userInput={conjugationInput} onInputChange={handleConjugationChange} isReviewMode={isConjugationReview} pronouns={langConfig.pronouns} tenses={langConfig.tenses} tenseLabels={langConfig.tenseLabels} rowHeaderLabel={langConfig.rowHeaderLabel} onFinish={checkConjugation} uiLabels={ui} />
          <div className={`justify-end pt-4 pb-2 ${phase === AppPhase.CONJUGATION_INPUT ? 'hidden md:flex' : 'flex'}`}>
            {phase === AppPhase.CONJUGATION_INPUT ? (
              <button onClick={checkConjugation} className="bg-rose-200 text-rose-900 px-8 py-3 rounded-2xl font-bold text-lg border border-rose-300 hover:bg-rose-300 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 shadow-sm">{ui.checkAnswers} <ArrowRight size={20} className="opacity-60" /></button>
            ) : !showSentences ? (
              <button onClick={startSentencePractice} className="w-full md:w-auto justify-center bg-white text-stone-600 px-8 py-3 rounded-2xl font-bold text-lg border border-stone-200 hover:bg-stone-50 hover:border-rose-200 hover:text-rose-500 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 shadow-sm">{ui.startContext} <GraduationCap size={20} className="opacity-60" /></button>
            ) : null}
          </div>
        </section>

        {showSentences && (
          <section id="sentence-section" className="space-y-6 pt-8 border-t border-dashed border-rose-200 animate-in fade-in slide-in-from-bottom-8 duration-700 scroll-mt-24">
            {phase === AppPhase.LOADING_SENTENCES ? <div className="py-12"><LoadingSpinner message={ui.loadingSentences} /></div> : (
              <>
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-bold text-stone-600 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs font-bold">2</span>{ui.section2Header}</h3>
                  {phase === AppPhase.SENTENCE_REVIEW && (sentenceErrors === 0 ? <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"><CheckCircle size={14} /> {ui.complete}</span> : <span className="text-rose-500 flex items-center gap-1 text-xs font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100"><XCircle size={14} /> {sentenceErrors} {ui.mistakes}</span>)}
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-stone-600 text-sm flex gap-3 items-start">
                  <div className="shrink-0 mt-0.5 text-rose-400"><BookOpen size={18} /></div>
                  <div className="space-y-1">
                    <p className="font-medium leading-relaxed">{ui.contextInstructions} <strong className="text-rose-500 bg-rose-50 px-1 rounded">{verbData.verb}</strong></p>
                    <p className="text-stone-400 text-xs">{ui.tapWord}</p>
                  </div>
                </div>
                <SentenceQuiz sentences={sentences} userInput={sentenceInput} onInputChange={handleSentenceChange} isReviewMode={phase === AppPhase.SENTENCE_REVIEW} uiLabels={ui} />
                <div className="flex justify-end pt-4 pb-8">
                  {phase === AppPhase.SENTENCE_INPUT ? (
                    <button onClick={checkSentences} className="w-full md:w-auto justify-center bg-rose-200 text-rose-900 px-8 py-3 rounded-2xl font-bold text-lg border border-rose-300 hover:bg-rose-300 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 shadow-sm">{ui.checkAnswers} <ArrowRight size={20} className="opacity-60" /></button>
                  ) : (
                    <button onClick={() => setShowSummaryModal(true)} className="w-full md:w-auto justify-center bg-white text-stone-600 px-8 py-3 rounded-2xl font-bold text-lg border border-stone-200 hover:bg-stone-50 hover:border-rose-200 hover:text-rose-500 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 shadow-sm">{ui.nextVerb} <RefreshCw size={20} className="opacity-60" /></button>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    );
  };

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-rose-200/50 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('tutorial')}
          className={`flex flex-col items-center gap-1 p-3 transition-colors ${activeTab === 'tutorial' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <BookText size={24} strokeWidth={activeTab === 'tutorial' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{ui.tabTutorial}</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-3 transition-colors ${activeTab === 'home' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{ui.tabHome}</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center gap-1 p-3 transition-colors ${activeTab === 'quiz' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <ClipboardList size={24} strokeWidth={activeTab === 'quiz' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{ui.tabQuiz}</span>
        </button>
      </div>
    </nav>
  );

  const renderContent = () => {
    // Top Level Tabs Switching
    switch (activeTab) {
      case 'home':
        return renderDashboardPage();
      case 'quiz':
        return renderPracticePage();
      case 'tutorial':
        return renderTutorialPlaceholder();
      case 'settings':
        return (
          <Settings
            currentLanguage={language}
            onLanguageChange={changeLearningLanguage}
            instructionLang={instructionLang}
            onInstructionLangChange={handleInstructionLangChange}
            instructionLanguages={INSTRUCTION_LANGUAGES}
            uiLabels={ui}
            isJP={language === 'jp'}
          />
        );
      default:
        return renderDashboardPage();
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><LoadingSpinner message="Starting up..." /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-rose-100 selection:text-rose-900">
      {renderCountdown()}
      {renderSummaryModal()}

      {/* Header is always visible unless on Login/Landing */}
      {(phase !== AppPhase.LOGIN && phase !== AppPhase.LANGUAGE_SELECTION) && renderHeader()}

      {/* Main Content Area */}
      {/* Main Content Area */}
      {(() => {
        switch (phase) {
          case AppPhase.LOGIN:
            return renderLoginPage();
          case AppPhase.EXPLANATION_LANGUAGE_SELECTION:
            return renderExplanationLanguageSelection();
          case AppPhase.LANGUAGE_SELECTION:
            return renderLanguageSelection();
          default:
            return (
              <>
                {renderContent()}
                <BottomNav />
                {showOnboarding && renderTutorial()}
              </>
            );
        }
      })()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}