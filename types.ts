
export type Language = 'pt' | 'es' | 'jp' | 'fr';

export enum AppPhase {
  LOGIN = 'LOGIN',
  LANDING = 'LANDING', // Deprecated in favor of DASHBOARD/LANGUAGE_SELECTION, kept for safe transition
  DASHBOARD = 'DASHBOARD',
  LANGUAGE_SELECTION = 'LANGUAGE_SELECTION',
  LOADING_VERB = 'LOADING_VERB',
  CONJUGATION_INPUT = 'CONJUGATION_INPUT',
  CONJUGATION_REVIEW = 'CONJUGATION_REVIEW',
  LOADING_SENTENCES = 'LOADING_SENTENCES',
  SENTENCE_INPUT = 'SENTENCE_INPUT',
  SENTENCE_REVIEW = 'SENTENCE_REVIEW',
}

export interface VerbData {
  verb: string;
  englishMeaning: string;
  language: Language;
  verbGroup?: string; // e.g., "Godan", "Ichidan", "Irregular" or "-ar", "-er"
  reading?: string; // e.g., "taberu" (hiragana) for JP
  tenses: {
    [tenseName: string]: {
      [person: string]: string;
    };
  };
}

export interface WordToken {
  text: string;
  translation: string;
  isBlank?: boolean;
}

export interface SentenceProblem {
  id: number;
  fullTranslation: string;
  tokens: WordToken[];
  correctAnswer: string;
}

export interface UserConjugationInput {
  [tense: string]: {
    [person: string]: string;
  };
}

export interface UserSentenceInput {
  [sentenceId: number]: string;
}

export interface LanguageConfig {
  id: Language;
  name: string;
  flag: string;
  rowHeaderLabel: string; // "Person" for Western, "Style" for Eastern
  pronouns: string[];
  tenses: string[];
  tenseLabels: Record<string, string>;
}

export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  pt: {
    id: 'pt',
    name: 'Portuguese (BR)',
    flag: '🇧🇷',
    rowHeaderLabel: 'Person',
    pronouns: ['Eu', 'Você', 'Ele/Ela', 'Nós', 'Vocês', 'Eles/Elas'],
    tenses: ['Presente', 'Pretérito Perfeito', 'Futuro do Presente'],
    tenseLabels: {
      'Presente': 'Presente',
      'Pretérito Perfeito': 'Passado',
      'Futuro do Presente': 'Futuro'
    }
  },
  es: {
    id: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    rowHeaderLabel: 'Person',
    pronouns: ['Yo', 'Tú', 'Él/Ella/Usted', 'Nosotros', 'Ellos/Ellas/Ustedes'],
    tenses: ['Presente', 'Pretérito Indefinido', 'Futuro Simple'],
    tenseLabels: {
      'Presente': 'Presente',
      'Pretérito Indefinido': 'Pasado',
      'Futuro Simple': 'Futuro'
    }
  },
  jp: {
    id: 'jp',
    name: 'Japanese',
    flag: '🇯🇵',
    rowHeaderLabel: 'Style',
    // These act as the "columns" in the data structure
    pronouns: ['Plain', 'Polite'], 
    // The 6 vertical forms requested
    tenses: ['present', 'negative', 'past', 'past_neg', 'te_form', 'volitional'],
    tenseLabels: {
      'present': 'Non-Past (現在形)',
      'negative': 'Negative (否定形)',
      'past': 'Past (過去形)',
      'past_neg': 'Past Negative (過去否定)',
      'te_form': 'Te-Form (て形)',
      'volitional': 'Volitional (意向形)'
    }
  },
  fr: {
    id: 'fr',
    name: 'French',
    flag: '🇫🇷',
    rowHeaderLabel: 'Person',
    pronouns: ['Je', 'Tu', 'Il/Elle/On', 'Nous', 'Vous', 'Ils/Elles'],
    tenses: ['Présent', 'Passé Composé', 'Futur Simple'],
    tenseLabels: {
      'Présent': 'Présent',
      'Passé Composé': 'Passé',
      'Futur Simple': 'Futur'
    }
  }
};
