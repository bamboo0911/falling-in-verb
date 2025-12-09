import { Language } from '../types';

export interface GuideData {
    pronouns: { term: string; meaning: string }[];
    tenses: { term: string; meaning: string }[];
    concepts: {
        formula: { title: string; subtitle: string; subject: string; verb: string; tense: string; result: string };
        motivation: { title: string; subtitle: string; text: string };
    };
    rules: {
        group: string;
        example: string;
        endings: { person: string; ending: string }[];
    }[];
}

export const CONJUGATION_GUIDES: Record<Language, Record<string, GuideData>> = {
    pt: {
        'English': {
            pronouns: [{ term: 'Eu', meaning: 'I' }, { term: 'Você', meaning: 'You' }, { term: 'Ele/Ela', meaning: 'He/She' }, { term: 'Nós', meaning: 'We' }, { term: 'Vocês', meaning: 'You (pl)' }, { term: 'Eles/Elas', meaning: 'They' }],
            tenses: [{ term: 'Presente', meaning: 'Present' }, { term: 'Pretérito', meaning: 'Past' }, { term: 'Futuro', meaning: 'Future' }],
            concepts: { formula: { title: 'The Magic Formula', subtitle: 'Sentence Structure', subject: 'Subject', verb: 'Stem', tense: 'Ending', result: 'Sentence' }, motivation: { title: 'Infinite Power', subtitle: 'Unlock the language', text: 'Master the patterns to express any idea.' } },
            rules: [
                { group: '-ar Verbs (Presente)', example: 'falar', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-a' }, { person: 'Ele/Ela', ending: '-a' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-am' }, { person: 'Eles/Elas', ending: '-am' }] },
                { group: '-ar Verbs (Pretérito)', example: 'falar', endings: [{ person: 'Eu', ending: '-ei' }, { person: 'Você', ending: '-ou' }, { person: 'Ele/Ela', ending: '-ou' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-aram' }, { person: 'Eles/Elas', ending: '-aram' }] },
                { group: '-ar Verbs (Futuro)', example: 'falar', endings: [{ person: 'Eu', ending: '-arei' }, { person: 'Você', ending: '-ará' }, { person: 'Ele/Ela', ending: '-ará' }, { person: 'Nós', ending: '-aremos' }, { person: 'Vocês', ending: '-arão' }, { person: 'Eles/Elas', ending: '-arão' }] },
                { group: '-er Verbs (Presente)', example: 'comer', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Ele/Ela', ending: '-e' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-em' }, { person: 'Eles/Elas', ending: '-em' }] },
                { group: '-er Verbs (Pretérito)', example: 'comer', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-eu' }, { person: 'Ele/Ela', ending: '-eu' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-eram' }, { person: 'Eles/Elas', ending: '-eram' }] },
                { group: '-er Verbs (Futuro)', example: 'comer', endings: [{ person: 'Eu', ending: '-erei' }, { person: 'Você', ending: '-erá' }, { person: 'Ele/Ela', ending: '-erá' }, { person: 'Nós', ending: '-eremos' }, { person: 'Vocês', ending: '-erão' }, { person: 'Eles/Elas', ending: '-erão' }] },
                { group: '-ir Verbs (Presente)', example: 'partir', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Ele/Ela', ending: '-e' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-em' }, { person: 'Eles/Elas', ending: '-em' }] },
                { group: '-ir Verbs (Pretérito)', example: 'partir', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-iu' }, { person: 'Ele/Ela', ending: '-iu' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-iram' }, { person: 'Eles/Elas', ending: '-iram' }] },
                { group: '-ir Verbs (Futuro)', example: 'partir', endings: [{ person: 'Eu', ending: '-irei' }, { person: 'Você', ending: '-irá' }, { person: 'Ele/Ela', ending: '-irá' }, { person: 'Nós', ending: '-iremos' }, { person: 'Vocês', ending: '-irão' }, { person: 'Eles/Elas', ending: '-irão' }] }
            ]
        },
        'Traditional Chinese': {
            pronouns: [{ term: 'Eu', meaning: '我' }, { term: 'Você', meaning: '你' }, { term: 'Ele/Ela', meaning: '他/她' }, { term: 'Nós', meaning: '我們' }, { term: 'Vocês', meaning: '你們' }, { term: 'Eles/Elas', meaning: '他們' }],
            tenses: [{ term: 'Presente', meaning: '現在式' }, { term: 'Pretérito', meaning: '過去式' }, { term: 'Futuro', meaning: '未來式' }],
            concepts: { formula: { title: '魔法公式', subtitle: '句子結構', subject: '主詞', verb: '字根', tense: '字尾', result: '句子' }, motivation: { title: '無限力量', subtitle: '解鎖語言', text: '掌握模式，表達任何想法。' } },
            rules: [
                { group: '-ar 動詞 (現在式)', example: 'falar', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-a' }, { person: 'Ele/Ela', ending: '-a' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-am' }, { person: 'Eles/Elas', ending: '-am' }] },
                { group: '-ar 動詞 (過去式)', example: 'falar', endings: [{ person: 'Eu', ending: '-ei' }, { person: 'Você', ending: '-ou' }, { person: 'Ele/Ela', ending: '-ou' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-aram' }, { person: 'Eles/Elas', ending: '-aram' }] },
                { group: '-ar 動詞 (未來式)', example: 'falar', endings: [{ person: 'Eu', ending: '-arei' }, { person: 'Você', ending: '-ará' }, { person: 'Ele/Ela', ending: '-ará' }, { person: 'Nós', ending: '-aremos' }, { person: 'Vocês', ending: '-arão' }, { person: 'Eles/Elas', ending: '-arão' }] },
                { group: '-er 動詞 (現在式)', example: 'comer', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Ele/Ela', ending: '-e' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-em' }, { person: 'Eles/Elas', ending: '-em' }] },
                { group: '-er 動詞 (過去式)', example: 'comer', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-eu' }, { person: 'Ele/Ela', ending: '-eu' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-eram' }, { person: 'Eles/Elas', ending: '-eram' }] },
                { group: '-er 動詞 (未來式)', example: 'comer', endings: [{ person: 'Eu', ending: '-erei' }, { person: 'Você', ending: '-erá' }, { person: 'Ele/Ela', ending: '-erá' }, { person: 'Nós', ending: '-eremos' }, { person: 'Vocês', ending: '-erão' }, { person: 'Eles/Elas', ending: '-erão' }] },
                { group: '-ir 動詞 (現在式)', example: 'partir', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Ele/Ela', ending: '-e' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-em' }, { person: 'Eles/Elas', ending: '-em' }] },
                { group: '-ir 動詞 (過去式)', example: 'partir', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-iu' }, { person: 'Ele/Ela', ending: '-iu' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-iram' }, { person: 'Eles/Elas', ending: '-iram' }] },
                { group: '-ir 動詞 (未來式)', example: 'partir', endings: [{ person: 'Eu', ending: '-irei' }, { person: 'Você', ending: '-irá' }, { person: 'Ele/Ela', ending: '-irá' }, { person: 'Nós', ending: '-iremos' }, { person: 'Vocês', ending: '-irão' }, { person: 'Eles/Elas', ending: '-irão' }] }
            ]
        },
        'Portuguese': {
            pronouns: [{ term: 'Eu', meaning: 'Eu' }, { term: 'Você', meaning: 'Você' }, { term: 'Ele/Ela', meaning: 'Ele/Ela' }, { term: 'Nós', meaning: 'Nós' }, { term: 'Vocês', meaning: 'Vocês' }, { term: 'Eles/Elas', meaning: 'Eles/Elas' }],
            tenses: [{ term: 'Presente', meaning: 'Presente' }, { term: 'Pretérito', meaning: 'Passado' }, { term: 'Futuro', meaning: 'Futuro' }],
            concepts: { formula: { title: 'A Fórmula Mágica', subtitle: 'Estrutura da Frase', subject: 'Sujeito', verb: 'Radical', tense: 'Terminação', result: 'Frase' }, motivation: { title: 'Poder Infinito', subtitle: 'Desbloqueie o idioma', text: 'Domine os padrões para expressar qualquer ideia.' } },
            rules: [
                { group: 'Verbos -ar (Presente)', example: 'falar', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-a' }, { person: 'Ele/Ela', ending: '-a' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-am' }, { person: 'Eles/Elas', ending: '-am' }] },
                { group: 'Verbos -ar (Pretérito)', example: 'falar', endings: [{ person: 'Eu', ending: '-ei' }, { person: 'Você', ending: '-ou' }, { person: 'Ele/Ela', ending: '-ou' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-aram' }, { person: 'Eles/Elas', ending: '-aram' }] },
                { group: 'Verbos -ar (Futuro)', example: 'falar', endings: [{ person: 'Eu', ending: '-arei' }, { person: 'Você', ending: '-ará' }, { person: 'Ele/Ela', ending: '-ará' }, { person: 'Nós', ending: '-aremos' }, { person: 'Vocês', ending: '-arão' }, { person: 'Eles/Elas', ending: '-arão' }] },
                { group: 'Verbos -er (Presente)', example: 'comer', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Ele/Ela', ending: '-e' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-em' }, { person: 'Eles/Elas', ending: '-em' }] },
                { group: 'Verbos -er (Pretérito)', example: 'comer', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-eu' }, { person: 'Ele/Ela', ending: '-eu' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-eram' }, { person: 'Eles/Elas', ending: '-eram' }] },
                { group: 'Verbos -er (Futuro)', example: 'comer', endings: [{ person: 'Eu', ending: '-erei' }, { person: 'Você', ending: '-erá' }, { person: 'Ele/Ela', ending: '-erá' }, { person: 'Nós', ending: '-eremos' }, { person: 'Vocês', ending: '-erão' }, { person: 'Eles/Elas', ending: '-erão' }] },
                { group: 'Verbos -ir (Presente)', example: 'partir', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Ele/Ela', ending: '-e' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-em' }, { person: 'Eles/Elas', ending: '-em' }] },
                { group: 'Verbos -ir (Pretérito)', example: 'partir', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-iu' }, { person: 'Ele/Ela', ending: '-iu' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-iram' }, { person: 'Eles/Elas', ending: '-iram' }] },
                { group: 'Verbos -ir (Futuro)', example: 'partir', endings: [{ person: 'Eu', ending: '-irei' }, { person: 'Você', ending: '-irá' }, { person: 'Ele/Ela', ending: '-irá' }, { person: 'Nós', ending: '-iremos' }, { person: 'Vocês', ending: '-irão' }, { person: 'Eles/Elas', ending: '-irão' }] }
            ]
        },
        'Spanish': {
            pronouns: [{ term: 'Eu', meaning: 'Yo' }, { term: 'Você', meaning: 'Tú' }, { term: 'Ele/Ela', meaning: 'Él/Ella' }, { term: 'Nós', meaning: 'Nosotros' }, { term: 'Vocês', meaning: 'Vosotros' }, { term: 'Eles/Elas', meaning: 'Ellos' }],
            tenses: [{ term: 'Presente', meaning: 'Presente' }, { term: 'Pretérito', meaning: 'Pasado' }, { term: 'Futuro', meaning: 'Futuro' }],
            concepts: { formula: { title: 'La Fórmula Mágica', subtitle: 'Estructura de la frase', subject: 'Sujeto', verb: 'Raíz', tense: 'Terminación', result: 'Frase' }, motivation: { title: 'Poder Infinito', subtitle: 'Desbloquea el idioma', text: 'Domina los patrones para expresar cualquier idea.' } },
            rules: [
                { group: 'Verbos -ar (Presente)', example: 'falar', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-a' }, { person: 'Ele/Ella', ending: '-a' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-am' }, { person: 'Ellos', ending: '-am' }] },
                { group: 'Verbos -ar (Pretérito)', example: 'falar', endings: [{ person: 'Eu', ending: '-ei' }, { person: 'Você', ending: '-ou' }, { person: 'Él/Ella', ending: '-ou' }, { person: 'Nós', ending: '-amos' }, { person: 'Vocês', ending: '-aram' }, { person: 'Ellos', ending: '-aram' }] },
                { group: 'Verbos -ar (Futuro)', example: 'falar', endings: [{ person: 'Eu', ending: '-arei' }, { person: 'Você', ending: '-ará' }, { person: 'Él/Ella', ending: '-ará' }, { person: 'Nós', ending: '-aremos' }, { person: 'Vocês', ending: '-arão' }, { person: 'Ellos', ending: '-arão' }] },
                { group: 'Verbos -er (Presente)', example: 'comer', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-em' }, { person: 'Ellos', ending: '-em' }] },
                { group: 'Verbos -er (Pretérito)', example: 'comer', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-eu' }, { person: 'Él/Ella', ending: '-eu' }, { person: 'Nós', ending: '-emos' }, { person: 'Vocês', ending: '-eram' }, { person: 'Ellos', ending: '-eram' }] },
                { group: 'Verbos -er (Futuro)', example: 'comer', endings: [{ person: 'Eu', ending: '-erei' }, { person: 'Você', ending: '-erá' }, { person: 'Él/Ella', ending: '-erá' }, { person: 'Nós', ending: '-eremos' }, { person: 'Vocês', ending: '-erão' }, { person: 'Ellos', ending: '-erão' }] },
                { group: 'Verbos -ir (Presente)', example: 'partir', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-em' }, { person: 'Ellos', ending: '-em' }] },
                { group: 'Verbos -ir (Pretérito)', example: 'partir', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-iu' }, { person: 'Él/Ella', ending: '-iu' }, { person: 'Nós', ending: '-imos' }, { person: 'Vocês', ending: '-iram' }, { person: 'Ellos', ending: '-iram' }] },
                { group: 'Verbos -ir (Futuro)', example: 'partir', endings: [{ person: 'Eu', ending: '-irei' }, { person: 'Você', ending: '-irá' }, { person: 'Él/Ella', ending: '-irá' }, { person: 'Nós', ending: '-iremos' }, { person: 'Vocês', ending: '-irão' }, { person: 'Ellos', ending: '-irão' }] }
            ]
        },
        'French': {
            pronouns: [{ term: 'Eu', meaning: 'Je' }, { term: 'Você', meaning: 'Tu' }, { term: 'Ele/Ela', meaning: 'Il/Elle' }, { term: 'Nós', meaning: 'Nous' }, { term: 'Vocês', meaning: 'Vous' }, { term: 'Eles/Elas', meaning: 'Ils' }],
            tenses: [{ term: 'Presente', meaning: 'Présent' }, { term: 'Pretérito', meaning: 'Passé' }, { term: 'Futuro', meaning: 'Futur' }],
            concepts: { formula: { title: 'La Formule Magique', subtitle: 'Structure de la phrase', subject: 'Sujet', verb: 'Radical', tense: 'Terminaison', result: 'Phrase' }, motivation: { title: 'Pouvoir Infini', subtitle: 'Débloquez la langue', text: 'Maîtrisez les modèles pour exprimer n\'importe quelle idée.' } },
            rules: [
                { group: 'Verbes en -ar (Présent)', example: 'falar', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-a' }, { person: 'Il/Elle', ending: '-a' }, { person: 'Nós', ending: '-amos' }, { person: 'Vous', ending: '-am' }, { person: 'Ils', ending: '-am' }] },
                { group: 'Verbes en -ar (Passé)', example: 'falar', endings: [{ person: 'Eu', ending: '-ei' }, { person: 'Você', ending: '-ou' }, { person: 'Il/Elle', ending: '-ou' }, { person: 'Nós', ending: '-amos' }, { person: 'Vous', ending: '-aram' }, { person: 'Ils', ending: '-aram' }] },
                { group: 'Verbes en -ar (Futur)', example: 'falar', endings: [{ person: 'Eu', ending: '-arei' }, { person: 'Você', ending: '-ará' }, { person: 'Il/Elle', ending: '-ará' }, { person: 'Nós', ending: '-aremos' }, { person: 'Vous', ending: '-arão' }, { person: 'Ils', ending: '-arão' }] },
                { group: 'Verbes en -er (Présent)', example: 'comer', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nós', ending: '-emos' }, { person: 'Vous', ending: '-em' }, { person: 'Ils', ending: '-em' }] },
                { group: 'Verbes en -er (Passé)', example: 'comer', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-eu' }, { person: 'Il/Elle', ending: '-eu' }, { person: 'Nós', ending: '-emos' }, { person: 'Vous', ending: '-eram' }, { person: 'Ils', ending: '-eram' }] },
                { group: 'Verbes en -er (Futur)', example: 'comer', endings: [{ person: 'Eu', ending: '-erei' }, { person: 'Você', ending: '-erá' }, { person: 'Il/Elle', ending: '-erá' }, { person: 'Nós', ending: '-eremos' }, { person: 'Vous', ending: '-erão' }, { person: 'Ils', ending: '-erão' }] },
                { group: 'Verbes en -ir (Présent)', example: 'partir', endings: [{ person: 'Eu', ending: '-o' }, { person: 'Você', ending: '-e' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nós', ending: '-imos' }, { person: 'Vous', ending: '-em' }, { person: 'Ils', ending: '-em' }] },
                { group: 'Verbes en -ir (Passé)', example: 'partir', endings: [{ person: 'Eu', ending: '-i' }, { person: 'Você', ending: '-iu' }, { person: 'Il/Elle', ending: '-iu' }, { person: 'Nós', ending: '-imos' }, { person: 'Vous', ending: '-iram' }, { person: 'Ils', ending: '-iram' }] },
                { group: 'Verbes en -ir (Futur)', example: 'partir', endings: [{ person: 'Eu', ending: '-irei' }, { person: 'Você', ending: '-irá' }, { person: 'Il/Elle', ending: '-irá' }, { person: 'Nós', ending: '-iremos' }, { person: 'Vous', ending: '-irão' }, { person: 'Ils', ending: '-irão' }] }
            ]
        },
        'Japanese': {
            pronouns: [{ term: 'Eu', meaning: '私' }, { term: 'Você', meaning: 'あなた' }, { term: 'Ele/Ela', meaning: '彼/彼女' }, { term: 'Nós', meaning: '私たち' }, { term: 'Vocês', meaning: 'あなた達' }, { term: 'Eles/Elas', meaning: '彼ら' }],
            tenses: [{ term: 'Presente', meaning: '現在形' }, { term: 'Pretérito', meaning: '過去形' }, { term: 'Futuro', meaning: '未来形' }],
            concepts: { formula: { title: '魔法の公式', subtitle: '文の構造', subject: '主語', verb: '語幹', tense: '語尾', result: '文' }, motivation: { title: '無限の力', subtitle: '言語を解き放つ', text: 'パターンを習得して、あらゆるアイデアを表現しましょう。' } },
            rules: [
                { group: '-ar 動詞 (現在形)', example: 'falar', endings: [{ person: '私', ending: '-o' }, { person: 'あなた', ending: '-a' }, { person: '彼/彼女', ending: '-a' }, { person: '私たち', ending: '-amos' }, { person: 'あなた達', ending: '-am' }, { person: '彼ら', ending: '-am' }] },
                { group: '-ar 動詞 (過去形)', example: 'falar', endings: [{ person: '私', ending: '-ei' }, { person: 'あなた', ending: '-ou' }, { person: '彼/彼女', ending: '-ou' }, { person: '私たち', ending: '-amos' }, { person: 'あなた達', ending: '-aram' }, { person: '彼ら', ending: '-aram' }] },
                { group: '-ar 動詞 (未来形)', example: 'falar', endings: [{ person: '私', ending: '-arei' }, { person: 'あなた', ending: '-ará' }, { person: '彼/彼女', ending: '-ará' }, { person: '私たち', ending: '-aremos' }, { person: 'あなた達', ending: '-arão' }, { person: '彼ら', ending: '-arão' }] },
                { group: '-er 動詞 (現在形)', example: 'comer', endings: [{ person: '私', ending: '-o' }, { person: 'あなた', ending: '-e' }, { person: '彼/彼女', ending: '-e' }, { person: '私たち', ending: '-emos' }, { person: 'あなた達', ending: '-em' }, { person: '彼ら', ending: '-em' }] },
                { group: '-er 動詞 (過去形)', example: 'comer', endings: [{ person: '私', ending: '-i' }, { person: 'あなた', ending: '-eu' }, { person: '彼/彼女', ending: '-eu' }, { person: '私たち', ending: '-emos' }, { person: 'あなた達', ending: '-eram' }, { person: '彼ら', ending: '-eram' }] },
                { group: '-er 動詞 (未来形)', example: 'comer', endings: [{ person: '私', ending: '-erei' }, { person: 'あなた', ending: '-erá' }, { person: '彼/彼女', ending: '-erá' }, { person: '私たち', ending: '-eremos' }, { person: 'あなた達', ending: '-erão' }, { person: '彼ら', ending: '-erão' }] },
                { group: '-ir 動詞 (現在形)', example: 'partir', endings: [{ person: '私', ending: '-o' }, { person: 'あなた', ending: '-e' }, { person: '彼/彼女', ending: '-e' }, { person: '私たち', ending: '-imos' }, { person: 'あなた達', ending: '-em' }, { person: '彼ら', ending: '-em' }] },
                { group: '-ir 動詞 (過去形)', example: 'partir', endings: [{ person: '私', ending: '-i' }, { person: 'あなた', ending: '-iu' }, { person: '彼/彼女', ending: '-iu' }, { person: '私たち', ending: '-imos' }, { person: 'あなた達', ending: '-iram' }, { person: '彼ら', ending: '-iram' }] },
                { group: '-ir 動詞 (未来形)', example: 'partir', endings: [{ person: '私', ending: '-irei' }, { person: 'あなた', ending: '-irá' }, { person: '彼/彼女', ending: '-irá' }, { person: '私たち', ending: '-iremos' }, { person: 'あなた達', ending: '-irão' }, { person: '彼ら', ending: '-irão' }] }
            ]
        }
    },
    es: {
        'English': {
            pronouns: [{ term: 'Yo', meaning: 'I' }, { term: 'Tú', meaning: 'You' }, { term: 'Él/Ella', meaning: 'He/She' }, { term: 'Nosotros', meaning: 'We' }, { term: 'Vosotros', meaning: 'You (pl)' }, { term: 'Ellos/Ellas', meaning: 'They' }],
            tenses: [{ term: 'Presente', meaning: 'Present' }, { term: 'Pretérito', meaning: 'Past' }, { term: 'Futuro', meaning: 'Future' }],
            concepts: { formula: { title: 'The Magic Formula', subtitle: 'Sentence Structure', subject: 'Subject', verb: 'Stem', tense: 'Ending', result: 'Sentence' }, motivation: { title: 'Unlock Spanish', subtitle: 'Master the patterns', text: 'Spanish verbs follow clear patterns.' } },
            rules: [
                { group: '-ar Verbs (Presente)', example: 'hablar', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-as' }, { person: 'Él/Ella', ending: '-a' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-áis' }, { person: 'Ellos', ending: '-an' }] },
                { group: '-ar Verbs (Pretérito)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-aste' }, { person: 'Él/Ella', ending: '-ó' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-asteis' }, { person: 'Ellos', ending: '-aron' }] },
                { group: '-ar Verbs (Futuro)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: '-er Verbs (Presente)', example: 'comer', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-en' }] },
                { group: '-er Verbs (Pretérito)', example: 'comer', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: '-er Verbs (Futuro)', example: 'comer', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: '-ir Verbs (Presente)', example: 'vivir', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-ís' }, { person: 'Ellos', ending: '-en' }] },
                { group: '-ir Verbs (Pretérito)', example: 'vivir', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: '-ir Verbs (Futuro)', example: 'vivir', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] }
            ]
        },
        'Traditional Chinese': {
            pronouns: [{ term: 'Yo', meaning: '我' }, { term: 'Tú', meaning: '你' }, { term: 'Él/Ella', meaning: '他/她' }, { term: 'Nosotros', meaning: '我們' }, { term: 'Vosotros', meaning: '你們' }, { term: 'Ellos/Ellas', meaning: '他們' }],
            tenses: [{ term: 'Presente', meaning: '現在式' }, { term: 'Pretérito', meaning: '過去式' }, { term: 'Futuro', meaning: '未來式' }],
            concepts: { formula: { title: '魔法公式', subtitle: '句子結構', subject: '主詞', verb: '字根', tense: '字尾', result: '句子' }, motivation: { title: '解鎖西班牙語', subtitle: '掌握模式', text: '西班牙語動詞遵循清晰的模式。' } },
            rules: [
                { group: '-ar 動詞 (現在式)', example: 'hablar', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-as' }, { person: 'Él/Ella', ending: '-a' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-áis' }, { person: 'Ellos', ending: '-an' }] },
                { group: '-ar 動詞 (過去式)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-aste' }, { person: 'Él/Ella', ending: '-ó' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-asteis' }, { person: 'Ellos', ending: '-aron' }] },
                { group: '-ar 動詞 (未來式)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: '-er 動詞 (現在式)', example: 'comer', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-en' }] },
                { group: '-er 動詞 (過去式)', example: 'comer', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: '-er 動詞 (未來式)', example: 'comer', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: '-ir 動詞 (現在式)', example: 'vivir', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-ís' }, { person: 'Ellos', ending: '-en' }] },
                { group: '-ir 動詞 (過去式)', example: 'vivir', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: '-ir 動詞 (未來式)', example: 'vivir', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] }
            ]
        },
        'Portuguese': {
            pronouns: [{ term: 'Yo', meaning: 'Eu' }, { term: 'Tú', meaning: 'Você' }, { term: 'Él/Ella', meaning: 'Ele/Ela' }, { term: 'Nosotros', meaning: 'Nós' }, { term: 'Vosotros', meaning: 'Vocês' }, { term: 'Ellos/Ellas', meaning: 'Eles/Elas' }],
            tenses: [{ term: 'Presente', meaning: 'Presente' }, { term: 'Pretérito', meaning: 'Passado' }, { term: 'Futuro', meaning: 'Futuro' }],
            concepts: { formula: { title: 'A Fórmula Mágica', subtitle: 'Estrutura da Frase', subject: 'Sujeito', verb: 'Radical', tense: 'Terminação', result: 'Frase' }, motivation: { title: 'Desbloqueie Espanhol', subtitle: 'Domine os padrões', text: 'Os verbos espanhóis seguem padrões claros.' } },
            rules: [
                { group: 'Verbos -ar (Presente)', example: 'hablar', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-as' }, { person: 'Él/Ella', ending: '-a' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-áis' }, { person: 'Ellos', ending: '-an' }] },
                { group: 'Verbos -ar (Pretérito)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-aste' }, { person: 'Él/Ella', ending: '-ó' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-asteis' }, { person: 'Ellos', ending: '-aron' }] },
                { group: 'Verbos -ar (Futuro)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: 'Verbos -er (Presente)', example: 'comer', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-en' }] },
                { group: 'Verbos -er (Pretérito)', example: 'comer', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: 'Verbos -er (Futuro)', example: 'comer', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: 'Verbos -ir (Presente)', example: 'vivir', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-ís' }, { person: 'Ellos', ending: '-en' }] },
                { group: 'Verbos -ir (Pretérito)', example: 'vivir', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: 'Verbos -ir (Futuro)', example: 'vivir', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] }
            ]
        },
        'Spanish': {
            pronouns: [{ term: 'Yo', meaning: 'Yo' }, { term: 'Tú', meaning: 'Tú' }, { term: 'Él/Ella', meaning: 'Él/Ella' }, { term: 'Nosotros', meaning: 'Nosotros' }, { term: 'Vosotros', meaning: 'Vosotros' }, { term: 'Ellos/Ellas', meaning: 'Ellos/Ellas' }],
            tenses: [{ term: 'Presente', meaning: 'Presente' }, { term: 'Pretérito', meaning: 'Pasado' }, { term: 'Futuro', meaning: 'Futuro' }],
            concepts: { formula: { title: 'La Fórmula Mágica', subtitle: 'Estructura de la frase', subject: 'Sujeto', verb: 'Raíz', tense: 'Terminación', result: 'Frase' }, motivation: { title: 'Desbloquea el Español', subtitle: 'Domina los patrones', text: 'Los verbos españoles siguen patrones claros.' } },
            rules: [
                { group: 'Verbos -ar (Presente)', example: 'hablar', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-as' }, { person: 'Él/Ella', ending: '-a' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-áis' }, { person: 'Ellos', ending: '-an' }] },
                { group: 'Verbos -ar (Pretérito)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-aste' }, { person: 'Él/Ella', ending: '-ó' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-asteis' }, { person: 'Ellos', ending: '-aron' }] },
                { group: 'Verbos -ar (Futuro)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: 'Verbos -er (Presente)', example: 'comer', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-en' }] },
                { group: 'Verbos -er (Pretérito)', example: 'comer', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: 'Verbos -er (Futuro)', example: 'comer', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: 'Verbos -ir (Presente)', example: 'vivir', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-ís' }, { person: 'Ellos', ending: '-en' }] },
                { group: 'Verbos -ir (Pretérito)', example: 'vivir', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: 'Verbos -ir (Futuro)', example: 'vivir', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] }
            ]
        },
        'French': {
            pronouns: [{ term: 'Yo', meaning: 'Je' }, { term: 'Tú', meaning: 'Tu' }, { term: 'Él/Ella', meaning: 'Il/Elle' }, { term: 'Nosotros', meaning: 'Nous' }, { term: 'Vosotros', meaning: 'Vous' }, { term: 'Ellos/Ellas', meaning: 'Ils' }],
            tenses: [{ term: 'Presente', meaning: 'Présent' }, { term: 'Pretérito', meaning: 'Passé' }, { term: 'Futuro', meaning: 'Futur' }],
            concepts: { formula: { title: 'La Formule Magique', subtitle: 'Structure de la phrase', subject: 'Sujet', verb: 'Radical', tense: 'Terminaison', result: 'Phrase' }, motivation: { title: 'Débloquez l\'Espagnol', subtitle: 'Maîtrisez les modèles', text: 'Les verbes espagnols suivent des modèles clairs.' } },
            rules: [
                { group: 'Verbes en -ar (Présent)', example: 'hablar', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-as' }, { person: 'Él/Ella', ending: '-a' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-áis' }, { person: 'Ellos', ending: '-an' }] },
                { group: 'Verbes en -ar (Passé)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-aste' }, { person: 'Él/Ella', ending: '-ó' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-asteis' }, { person: 'Ellos', ending: '-aron' }] },
                { group: 'Verbes en -ar (Futur)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: 'Verbes en -er (Présent)', example: 'comer', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-en' }] },
                { group: 'Verbes en -er (Passé)', example: 'comer', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: 'Verbes en -er (Futur)', example: 'comer', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: 'Verbes en -ir (Présent)', example: 'vivir', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-ís' }, { person: 'Ellos', ending: '-en' }] },
                { group: 'Verbes en -ir (Passé)', example: 'vivir', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: 'Verbes en -ir (Futur)', example: 'vivir', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] }
            ]
        },
        'Japanese': {
            pronouns: [{ term: 'Yo', meaning: '私' }, { term: 'Tú', meaning: 'あなた' }, { term: 'Él/Ella', meaning: '彼/彼女' }, { term: 'Nosotros', meaning: '私たち' }, { term: 'Vosotros', meaning: 'あなた達' }, { term: 'Ellos/Ellas', meaning: '彼ら' }],
            tenses: [{ term: 'Presente', meaning: '現在形' }, { term: 'Pretérito', meaning: '過去形' }, { term: 'Futuro', meaning: '未来形' }],
            concepts: { formula: { title: '魔法の公式', subtitle: '文の構造', subject: '主語', verb: '語幹', tense: '語尾', result: '文' }, motivation: { title: 'スペイン語を解き放つ', subtitle: 'パターンを習得', text: 'スペイン語の動詞は明確なパターンに従います。' } },
            rules: [
                { group: '-ar 動詞 (現在形)', example: 'hablar', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-as' }, { person: 'Él/Ella', ending: '-a' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-áis' }, { person: 'Ellos', ending: '-an' }] },
                { group: '-ar 動詞 (過去形)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-aste' }, { person: 'Él/Ella', ending: '-ó' }, { person: 'Nosotros', ending: '-amos' }, { person: 'Vosotros', ending: '-asteis' }, { person: 'Ellos', ending: '-aron' }] },
                { group: '-ar 動詞 (未来形)', example: 'hablar', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: '-er 動詞 (現在形)', example: 'comer', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-en' }] },
                { group: '-er 動詞 (過去形)', example: 'comer', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: '-er 動詞 (未来形)', example: 'comer', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] },
                { group: '-ir 動詞 (現在形)', example: 'vivir', endings: [{ person: 'Yo', ending: '-o' }, { person: 'Tú', ending: '-es' }, { person: 'Él/Ella', ending: '-e' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-ís' }, { person: 'Ellos', ending: '-en' }] },
                { group: '-ir 動詞 (過去形)', example: 'vivir', endings: [{ person: 'Yo', ending: '-í' }, { person: 'Tú', ending: '-iste' }, { person: 'Él/Ella', ending: '-ió' }, { person: 'Nosotros', ending: '-imos' }, { person: 'Vosotros', ending: '-isteis' }, { person: 'Ellos', ending: '-ieron' }] },
                { group: '-ir 動詞 (未来形)', example: 'vivir', endings: [{ person: 'Yo', ending: '-é' }, { person: 'Tú', ending: '-ás' }, { person: 'Él/Ella', ending: '-á' }, { person: 'Nosotros', ending: '-emos' }, { person: 'Vosotros', ending: '-éis' }, { person: 'Ellos', ending: '-án' }] }
            ]
        }
    },
    fr: {
        'English': {
            pronouns: [{ term: 'Je', meaning: 'I' }, { term: 'Tu', meaning: 'You' }, { term: 'Il/Elle', meaning: 'He/She' }, { term: 'Nous', meaning: 'We' }, { term: 'Vous', meaning: 'You (pl)' }, { term: 'Ils/Elles', meaning: 'They' }],
            tenses: [{ term: 'Présent', meaning: 'Present' }, { term: 'Passé Composé', meaning: 'Past' }, { term: 'Futur', meaning: 'Future' }],
            concepts: { formula: { title: 'The French Code', subtitle: 'Building Blocks', subject: 'Subject', verb: 'Stem', tense: 'Ending', result: 'Sentence' }, motivation: { title: 'Speak with Style', subtitle: 'Art of Conjugation', text: 'French conjugation gives your speech precision.' } },
            rules: [
                { group: '-er Verbs (Présent)', example: 'parler', endings: [{ person: 'Je', ending: '-e' }, { person: 'Tu', ending: '-es' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: '-er Verbs (Passé Composé)', example: 'parler', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-é' }, { person: 'Nous avons', ending: '-é' }, { person: 'Vous avez', ending: '-é' }, { person: 'Ils ont', ending: '-é' }] },
                { group: '-er Verbs (Futur)', example: 'parler', endings: [{ person: 'Je', ending: '-erai' }, { person: 'Tu', ending: '-eras' }, { person: 'Il/Elle', ending: '-era' }, { person: 'Nous', ending: '-erons' }, { person: 'Vous', ending: '-erez' }, { person: 'Ils/Elles', ending: '-eront' }] },
                { group: '-ir Verbs (Présent)', example: 'finir', endings: [{ person: 'Je', ending: '-is' }, { person: 'Tu', ending: '-is' }, { person: 'Il/Elle', ending: '-it' }, { person: 'Nous', ending: '-issons' }, { person: 'Vous', ending: '-issez' }, { person: 'Ils/Elles', ending: '-issent' }] },
                { group: '-ir Verbs (Passé Composé)', example: 'finir', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-i' }, { person: 'Nous avons', ending: '-i' }, { person: 'Vous avez', ending: '-i' }, { person: 'Ils ont', ending: '-i' }] },
                { group: '-ir Verbs (Futur)', example: 'finir', endings: [{ person: 'Je', ending: '-irai' }, { person: 'Tu', ending: '-iras' }, { person: 'Il/Elle', ending: '-ira' }, { person: 'Nous', ending: '-irons' }, { person: 'Vous', ending: '-irez' }, { person: 'Ils/Elles', ending: '-iront' }] },
                { group: '-re Verbs (Présent)', example: 'vendre', endings: [{ person: 'Je', ending: '-s' }, { person: 'Tu', ending: '-s' }, { person: 'Il/Elle', ending: '-' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: '-re Verbs (Passé Composé)', example: 'vendre', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-u' }, { person: 'Nous avons', ending: '-u' }, { person: 'Vous avez', ending: '-u' }, { person: 'Ils ont', ending: '-u' }] },
                { group: '-re Verbs (Futur)', example: 'vendre', endings: [{ person: 'Je', ending: '-rai' }, { person: 'Tu', ending: '-ras' }, { person: 'Il/Elle', ending: '-ra' }, { person: 'Nous', ending: '-rons' }, { person: 'Vous', ending: '-rez' }, { person: 'Ils/Elles', ending: '-ront' }] }
            ]
        },
        'Traditional Chinese': {
            pronouns: [{ term: 'Je', meaning: '我' }, { term: 'Tu', meaning: '你' }, { term: 'Il/Elle', meaning: '他/她' }, { term: 'Nous', meaning: '我們' }, { term: 'Vous', meaning: '你們' }, { term: 'Ils/Elles', meaning: '他們' }],
            tenses: [{ term: 'Présent', meaning: '現在式' }, { term: 'Passé Composé', meaning: '過去式' }, { term: 'Futur', meaning: '未來式' }],
            concepts: { formula: { title: '法語密碼', subtitle: '建構基石', subject: '主詞', verb: '字根', tense: '字尾', result: '句子' }, motivation: { title: '優雅地表達', subtitle: '動詞變化的藝術', text: '法語動詞變化賦予您的語言精確性。' } },
            rules: [
                { group: '-er 動詞 (現在式)', example: 'parler', endings: [{ person: 'Je', ending: '-e' }, { person: 'Tu', ending: '-es' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: '-er 動詞 (複合過去式)', example: 'parler', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-é' }, { person: 'Nous avons', ending: '-é' }, { person: 'Vous avez', ending: '-é' }, { person: 'Ils ont', ending: '-é' }] },
                { group: '-er 動詞 (未來式)', example: 'parler', endings: [{ person: 'Je', ending: '-erai' }, { person: 'Tu', ending: '-eras' }, { person: 'Il/Elle', ending: '-era' }, { person: 'Nous', ending: '-erons' }, { person: 'Vous', ending: '-erez' }, { person: 'Ils/Elles', ending: '-eront' }] },
                { group: '-ir 動詞 (現在式)', example: 'finir', endings: [{ person: 'Je', ending: '-is' }, { person: 'Tu', ending: '-is' }, { person: 'Il/Elle', ending: '-it' }, { person: 'Nous', ending: '-issons' }, { person: 'Vous', ending: '-issez' }, { person: 'Ils/Elles', ending: '-issent' }] },
                { group: '-ir 動詞 (複合過去式)', example: 'finir', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-i' }, { person: 'Nous avons', ending: '-i' }, { person: 'Vous avez', ending: '-i' }, { person: 'Ils ont', ending: '-i' }] },
                { group: '-ir 動詞 (未來式)', example: 'finir', endings: [{ person: 'Je', ending: '-irai' }, { person: 'Tu', ending: '-iras' }, { person: 'Il/Elle', ending: '-ira' }, { person: 'Nous', ending: '-irons' }, { person: 'Vous', ending: '-irez' }, { person: 'Ils/Elles', ending: '-iront' }] },
                { group: '-re 動詞 (現在式)', example: 'vendre', endings: [{ person: 'Je', ending: '-s' }, { person: 'Tu', ending: '-s' }, { person: 'Il/Elle', ending: '-' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: '-re 動詞 (複合過去式)', example: 'vendre', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-u' }, { person: 'Nous avons', ending: '-u' }, { person: 'Vous avez', ending: '-u' }, { person: 'Ils ont', ending: '-u' }] },
                { group: '-re 動詞 (未來式)', example: 'vendre', endings: [{ person: 'Je', ending: '-rai' }, { person: 'Tu', ending: '-ras' }, { person: 'Il/Elle', ending: '-ra' }, { person: 'Nous', ending: '-rons' }, { person: 'Vous', ending: '-rez' }, { person: 'Ils/Elles', ending: '-ront' }] }
            ]
        },
        'Portuguese': {
            pronouns: [{ term: 'Je', meaning: 'Eu' }, { term: 'Tu', meaning: 'Você' }, { term: 'Il/Elle', meaning: 'Ele/Ela' }, { term: 'Nous', meaning: 'Nós' }, { term: 'Vous', meaning: 'Vocês' }, { term: 'Ils/Elles', meaning: 'Eles/Elas' }],
            tenses: [{ term: 'Présent', meaning: 'Presente' }, { term: 'Passé Composé', meaning: 'Passado' }, { term: 'Futur', meaning: 'Futuro' }],
            concepts: { formula: { title: 'O Código Francês', subtitle: 'Blocos de Construção', subject: 'Sujeito', verb: 'Radical', tense: 'Terminação', result: 'Frase' }, motivation: { title: 'Fale com Estilo', subtitle: 'A Arte da Conjugação', text: 'A conjugação francesa dá precisão à sua fala.' } },
            rules: [
                { group: 'Verbos -er (Presente)', example: 'parler', endings: [{ person: 'Je', ending: '-e' }, { person: 'Tu', ending: '-es' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: 'Verbos -er (Passado Composto)', example: 'parler', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-é' }, { person: 'Nous avons', ending: '-é' }, { person: 'Vous avez', ending: '-é' }, { person: 'Ils ont', ending: '-é' }] },
                { group: 'Verbos -er (Futuro)', example: 'parler', endings: [{ person: 'Je', ending: '-erai' }, { person: 'Tu', ending: '-eras' }, { person: 'Il/Elle', ending: '-era' }, { person: 'Nous', ending: '-erons' }, { person: 'Vous', ending: '-erez' }, { person: 'Ils/Elles', ending: '-eront' }] },
                { group: 'Verbos -ir (Presente)', example: 'finir', endings: [{ person: 'Je', ending: '-is' }, { person: 'Tu', ending: '-is' }, { person: 'Il/Elle', ending: '-it' }, { person: 'Nous', ending: '-issons' }, { person: 'Vous', ending: '-issez' }, { person: 'Ils/Elles', ending: '-issent' }] },
                { group: 'Verbos -ir (Passado Composto)', example: 'finir', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-i' }, { person: 'Nous avons', ending: '-i' }, { person: 'Vous avez', ending: '-i' }, { person: 'Ils ont', ending: '-i' }] },
                { group: 'Verbos -ir (Futuro)', example: 'finir', endings: [{ person: 'Je', ending: '-irai' }, { person: 'Tu', ending: '-iras' }, { person: 'Il/Elle', ending: '-ira' }, { person: 'Nous', ending: '-irons' }, { person: 'Vous', ending: '-irez' }, { person: 'Ils/Elles', ending: '-iront' }] },
                { group: 'Verbos -re (Presente)', example: 'vendre', endings: [{ person: 'Je', ending: '-s' }, { person: 'Tu', ending: '-s' }, { person: 'Il/Elle', ending: '-' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: 'Verbos -re (Passado Composto)', example: 'vendre', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-u' }, { person: 'Nous avons', ending: '-u' }, { person: 'Vous avez', ending: '-u' }, { person: 'Ils ont', ending: '-u' }] },
                { group: 'Verbos -re (Futuro)', example: 'vendre', endings: [{ person: 'Je', ending: '-rai' }, { person: 'Tu', ending: '-ras' }, { person: 'Il/Elle', ending: '-ra' }, { person: 'Nous', ending: '-rons' }, { person: 'Vous', ending: '-rez' }, { person: 'Ils/Elles', ending: '-ront' }] }
            ]
        },
        'Spanish': {
            pronouns: [{ term: 'Je', meaning: 'Yo' }, { term: 'Tu', meaning: 'Tú' }, { term: 'Il/Elle', meaning: 'Él/Ella' }, { term: 'Nous', meaning: 'Nosotros' }, { term: 'Vous', meaning: 'Vosotros' }, { term: 'Ils/Elles', meaning: 'Ellos' }],
            tenses: [{ term: 'Présent', meaning: 'Presente' }, { term: 'Passé Composé', meaning: 'Pasado' }, { term: 'Futur', meaning: 'Futuro' }],
            concepts: { formula: { title: 'El Código Francés', subtitle: 'Bloques de Construcción', subject: 'Sujeto', verb: 'Raíz', tense: 'Terminación', result: 'Frase' }, motivation: { title: 'Habla con Estilo', subtitle: 'El Arte de la Conjugación', text: 'La conjugación francesa da precisión a tu habla.' } },
            rules: [
                { group: 'Verbos -er (Presente)', example: 'parler', endings: [{ person: 'Je', ending: '-e' }, { person: 'Tu', ending: '-es' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: 'Verbos -er (Pasado Compuesto)', example: 'parler', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-é' }, { person: 'Nous avons', ending: '-é' }, { person: 'Vous avez', ending: '-é' }, { person: 'Ils ont', ending: '-é' }] },
                { group: 'Verbos -er (Futuro)', example: 'parler', endings: [{ person: 'Je', ending: '-erai' }, { person: 'Tu', ending: '-eras' }, { person: 'Il/Elle', ending: '-era' }, { person: 'Nous', ending: '-erons' }, { person: 'Vous', ending: '-erez' }, { person: 'Ils/Elles', ending: '-eront' }] },
                { group: 'Verbos -ir (Presente)', example: 'finir', endings: [{ person: 'Je', ending: '-is' }, { person: 'Tu', ending: '-is' }, { person: 'Il/Elle', ending: '-it' }, { person: 'Nous', ending: '-issons' }, { person: 'Vous', ending: '-issez' }, { person: 'Ils/Elles', ending: '-issent' }] },
                { group: 'Verbos -ir (Pasado Compuesto)', example: 'finir', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-i' }, { person: 'Nous avons', ending: '-i' }, { person: 'Vous avez', ending: '-i' }, { person: 'Ils ont', ending: '-i' }] },
                { group: 'Verbos -ir (Futuro)', example: 'finir', endings: [{ person: 'Je', ending: '-irai' }, { person: 'Tu', ending: '-iras' }, { person: 'Il/Elle', ending: '-ira' }, { person: 'Nous', ending: '-irons' }, { person: 'Vous', ending: '-irez' }, { person: 'Ils/Elles', ending: '-iront' }] },
                { group: 'Verbos -re (Presente)', example: 'vendre', endings: [{ person: 'Je', ending: '-s' }, { person: 'Tu', ending: '-s' }, { person: 'Il/Elle', ending: '-' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: 'Verbos -re (Pasado Compuesto)', example: 'vendre', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-u' }, { person: 'Nous avons', ending: '-u' }, { person: 'Vous avez', ending: '-u' }, { person: 'Ils ont', ending: '-u' }] },
                { group: 'Verbos -re (Futuro)', example: 'vendre', endings: [{ person: 'Je', ending: '-rai' }, { person: 'Tu', ending: '-ras' }, { person: 'Il/Elle', ending: '-ra' }, { person: 'Nous', ending: '-rons' }, { person: 'Vous', ending: '-rez' }, { person: 'Ils/Elles', ending: '-ront' }] }
            ]
        },
        'French': {
            pronouns: [{ term: 'Je', meaning: 'Je' }, { term: 'Tu', meaning: 'Tu' }, { term: 'Il/Elle', meaning: 'Il/Elle' }, { term: 'Nous', meaning: 'Nous' }, { term: 'Vous', meaning: 'Vous' }, { term: 'Ils/Elles', meaning: 'Ils/Elles' }],
            tenses: [{ term: 'Présent', meaning: 'Présent' }, { term: 'Passé Composé', meaning: 'Passé' }, { term: 'Futur', meaning: 'Futur' }],
            concepts: { formula: { title: 'Le Code Français', subtitle: 'Blocs de Construction', subject: 'Sujet', verb: 'Radical', tense: 'Terminaison', result: 'Phrase' }, motivation: { title: 'Parlez avec Style', subtitle: 'L\'Art de la Conjugaison', text: 'La conjugaison française donne de la précision à votre discours.' } },
            rules: [
                { group: 'Verbes en -er (Présent)', example: 'parler', endings: [{ person: 'Je', ending: '-e' }, { person: 'Tu', ending: '-es' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: 'Verbes en -er (Passé Composé)', example: 'parler', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-é' }, { person: 'Nous avons', ending: '-é' }, { person: 'Vous avez', ending: '-é' }, { person: 'Ils ont', ending: '-é' }] },
                { group: 'Verbes en -er (Futur)', example: 'parler', endings: [{ person: 'Je', ending: '-erai' }, { person: 'Tu', ending: '-eras' }, { person: 'Il/Elle', ending: '-era' }, { person: 'Nous', ending: '-erons' }, { person: 'Vous', ending: '-erez' }, { person: 'Ils/Elles', ending: '-eront' }] },
                { group: 'Verbes en -ir (Présent)', example: 'finir', endings: [{ person: 'Je', ending: '-is' }, { person: 'Tu', ending: '-is' }, { person: 'Il/Elle', ending: '-it' }, { person: 'Nous', ending: '-issons' }, { person: 'Vous', ending: '-issez' }, { person: 'Ils/Elles', ending: '-issent' }] },
                { group: 'Verbes en -ir (Passé Composé)', example: 'finir', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-i' }, { person: 'Nous avons', ending: '-i' }, { person: 'Vous avez', ending: '-i' }, { person: 'Ils ont', ending: '-i' }] },
                { group: 'Verbes en -ir (Futur)', example: 'finir', endings: [{ person: 'Je', ending: '-irai' }, { person: 'Tu', ending: '-iras' }, { person: 'Il/Elle', ending: '-ira' }, { person: 'Nous', ending: '-irons' }, { person: 'Vous', ending: '-irez' }, { person: 'Ils/Elles', ending: '-iront' }] },
                { group: 'Verbes en -re (Présent)', example: 'vendre', endings: [{ person: 'Je', ending: '-s' }, { person: 'Tu', ending: '-s' }, { person: 'Il/Elle', ending: '-' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: 'Verbes en -re (Passé Composé)', example: 'vendre', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-u' }, { person: 'Nous avons', ending: '-u' }, { person: 'Vous avez', ending: '-u' }, { person: 'Ils ont', ending: '-u' }] },
                { group: 'Verbes en -re (Futur)', example: 'vendre', endings: [{ person: 'Je', ending: '-rai' }, { person: 'Tu', ending: '-ras' }, { person: 'Il/Elle', ending: '-ra' }, { person: 'Nous', ending: '-rons' }, { person: 'Vous', ending: '-rez' }, { person: 'Ils/Elles', ending: '-ront' }] }
            ]
        },
        'Japanese': {
            pronouns: [{ term: 'Je', meaning: '私' }, { term: 'Tu', meaning: 'あなた' }, { term: 'Il/Elle', meaning: '彼/彼女' }, { term: 'Nous', meaning: '私たち' }, { term: 'Vous', meaning: 'あなた達' }, { term: 'Ils/Elles', meaning: '彼ら' }],
            tenses: [{ term: 'Présent', meaning: '現在形' }, { term: 'Passé Composé', meaning: '過去形' }, { term: 'Futur', meaning: '未来形' }],
            concepts: { formula: { title: 'フランス語のコード', subtitle: '構成要素', subject: '主語', verb: '語幹', tense: '語尾', result: '文' }, motivation: { title: 'スタイルを持って話す', subtitle: '活用の芸術', text: 'フランス語の活用は、スピーチに正確さを与えます。' } },
            rules: [
                { group: '-er 動詞 (現在形)', example: 'parler', endings: [{ person: 'Je', ending: '-e' }, { person: 'Tu', ending: '-es' }, { person: 'Il/Elle', ending: '-e' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: '-er 動詞 (複合過去)', example: 'parler', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-é' }, { person: 'Nous avons', ending: '-é' }, { person: 'Vous avez', ending: '-é' }, { person: 'Ils ont', ending: '-é' }] },
                { group: '-er 動詞 (未来形)', example: 'parler', endings: [{ person: 'Je', ending: '-erai' }, { person: 'Tu', ending: '-eras' }, { person: 'Il/Elle', ending: '-era' }, { person: 'Nous', ending: '-erons' }, { person: 'Vous', ending: '-erez' }, { person: 'Ils/Elles', ending: '-eront' }] },
                { group: '-ir 動詞 (現在形)', example: 'finir', endings: [{ person: 'Je', ending: '-is' }, { person: 'Tu', ending: '-is' }, { person: 'Il/Elle', ending: '-it' }, { person: 'Nous', ending: '-issons' }, { person: 'Vous', ending: '-issez' }, { person: 'Ils/Elles', ending: '-issent' }] },
                { group: '-ir 動詞 (複合過去)', example: 'finir', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-i' }, { person: 'Nous avons', ending: '-i' }, { person: 'Vous avez', ending: '-i' }, { person: 'Ils ont', ending: '-i' }] },
                { group: '-ir 動詞 (未来形)', example: 'finir', endings: [{ person: 'Je', ending: '-irai' }, { person: 'Tu', ending: '-iras' }, { person: 'Il/Elle', ending: '-ira' }, { person: 'Nous', ending: '-irons' }, { person: 'Vous', ending: '-irez' }, { person: 'Ils/Elles', ending: '-iront' }] },
                { group: '-re 動詞 (現在形)', example: 'vendre', endings: [{ person: 'Je', ending: '-s' }, { person: 'Tu', ending: '-s' }, { person: 'Il/Elle', ending: '-' }, { person: 'Nous', ending: '-ons' }, { person: 'Vous', ending: '-ez' }, { person: 'Ils/Elles', ending: '-ent' }] },
                { group: '-re 動詞 (複合過去)', example: 'vendre', endings: [{ person: 'J\'ai/Tu as/Il a', ending: '-u' }, { person: 'Nous avons', ending: '-u' }, { person: 'Vous avez', ending: '-u' }, { person: 'Ils ont', ending: '-u' }] },
                { group: '-re 動詞 (未来形)', example: 'vendre', endings: [{ person: 'Je', ending: '-rai' }, { person: 'Tu', ending: '-ras' }, { person: 'Il/Elle', ending: '-ra' }, { person: 'Nous', ending: '-rons' }, { person: 'Vous', ending: '-rez' }, { person: 'Ils/Elles', ending: '-ront' }] }
            ]
        }
    },
    jp: {
        'English': {
            pronouns: [{ term: 'Watashi', meaning: 'I' }, { term: 'Anata', meaning: 'You' }, { term: 'Kare/Kanojo', meaning: 'He/She' }, { term: 'Watashitachi', meaning: 'We' }, { term: 'Anatatachi', meaning: 'You (pl)' }, { term: 'Karera', meaning: 'They' }],
            tenses: [{ term: 'Non-Past', meaning: 'Present/Future' }, { term: 'Past', meaning: 'Completed' }, { term: 'Te-form', meaning: 'Connecting' }],
            concepts: { formula: { title: 'Japanese Logic', subtitle: 'Agglutination', subject: 'Topic', verb: 'Stem', tense: 'Auxiliary', result: 'Sentence' }, motivation: { title: 'Structured Harmony', subtitle: 'Building Blocks', text: 'Japanese verbs stack endings like building blocks.' } },
            rules: [
                { group: '現在形', example: '書く', endings: [{ person: 'Plain', ending: '-う' }, { person: 'Polite', ending: '-います' }] },
                { group: '否定形', example: '書く', endings: [{ person: 'Plain', ending: '-ない' }, { person: 'Polite', ending: '-いません' }] },
                { group: '過去形', example: '書く', endings: [{ person: 'Plain', ending: '-いた/-んだ' }, { person: 'Polite', ending: '-ました' }] },
                { group: '過去否定', example: '書く', endings: [{ person: 'Plain', ending: '-なかった' }, { person: 'Polite', ending: '-いませんでした' }] },
                { group: 'て形', example: '書く', endings: [{ person: 'Plain', ending: '-いて/-んで' }, { person: 'Polite', ending: '-いてください' }] },
                { group: '意向形', example: '書く', endings: [{ person: 'Plain', ending: '-おう' }, { person: 'Polite', ending: '-いましょう' }] }
            ]
        },
        'Traditional Chinese': {
            pronouns: [{ term: 'Watashi', meaning: '我' }, { term: 'Anata', meaning: '你' }, { term: 'Kare/Kanojo', meaning: '他/她' }, { term: 'Watashitachi', meaning: '我們' }, { term: 'Anatatachi', meaning: '你們' }, { term: 'Karera', meaning: '他們' }],
            tenses: [{ term: 'Non-Past', meaning: '非過去式' }, { term: 'Past', meaning: '過去式' }, { term: 'Te-form', meaning: 'Te形' }],
            concepts: { formula: { title: '日語邏輯', subtitle: '黏著語', subject: '主題', verb: '語幹', tense: '助動詞', result: '句子' }, motivation: { title: '結構的和諧', subtitle: '積木堆疊', text: '日語動詞像積木一樣堆疊字尾。' } },
            rules: [
                { group: '現在形', example: '書く', endings: [{ person: '常體', ending: '-う' }, { person: '敬體', ending: '-います' }] },
                { group: '否定形', example: '書く', endings: [{ person: '常體', ending: '-ない' }, { person: '敬體', ending: '-いません' }] },
                { group: '過去形', example: '書く', endings: [{ person: '常體', ending: '-いた/-んだ' }, { person: '敬體', ending: '-ました' }] },
                { group: '過去否定', example: '書く', endings: [{ person: '常體', ending: '-なかった' }, { person: '敬體', ending: '-いませんでした' }] },
                { group: 'て形', example: '書く', endings: [{ person: '常體', ending: '-いて/-んで' }, { person: '敬體', ending: '-いてください' }] },
                { group: '意向形', example: '書く', endings: [{ person: '常體', ending: '-おう' }, { person: '敬體', ending: '-いましょう' }] }
            ]
        },
        'Portuguese': {
            pronouns: [{ term: 'Watashi', meaning: 'Eu' }, { term: 'Anata', meaning: 'Você' }, { term: 'Kare/Kanojo', meaning: 'Ele/Ela' }, { term: 'Watashitachi', meaning: 'Nós' }, { term: 'Anatatachi', meaning: 'Vocês' }, { term: 'Karera', meaning: 'Eles/Elas' }],
            tenses: [{ term: 'Non-Past', meaning: 'Não-Passado' }, { term: 'Past', meaning: 'Passado' }, { term: 'Te-form', meaning: 'Forma Te' }],
            concepts: { formula: { title: 'Lógica Japonesa', subtitle: 'Aglutinação', subject: 'Tópico', verb: 'Radical', tense: 'Auxiliar', result: 'Frase' }, motivation: { title: 'Harmonia Estruturada', subtitle: 'Blocos de Construção', text: 'Os verbos japoneses empilham terminações como blocos.' } },
            rules: [
                { group: '現在形', example: '書く', endings: [{ person: 'Simples', ending: '-う' }, { person: 'Polido', ending: '-います' }] },
                { group: '否定形', example: '書く', endings: [{ person: 'Simples', ending: '-ない' }, { person: 'Polido', ending: '-いません' }] },
                { group: '過去形', example: '書く', endings: [{ person: 'Simples', ending: '-いた/-んだ' }, { person: 'Polido', ending: '-ました' }] },
                { group: '過去否定', example: '書く', endings: [{ person: 'Simples', ending: '-なかった' }, { person: 'Polido', ending: '-いませんでした' }] },
                { group: 'て形', example: '書く', endings: [{ person: 'Simples', ending: '-いて/-んで' }, { person: 'Polido', ending: '-いてください' }] },
                { group: '意向形', example: '書く', endings: [{ person: 'Simples', ending: '-おう' }, { person: 'Polido', ending: '-いましょう' }] }
            ]
        },
        'Spanish': {
            pronouns: [{ term: 'Watashi', meaning: 'Yo' }, { term: 'Anata', meaning: 'Tú' }, { term: 'Kare/Kanojo', meaning: 'Él/Ella' }, { term: 'Watashitachi', meaning: 'Nosotros' }, { term: 'Anatatachi', meaning: 'Vosotros' }, { term: 'Karera', meaning: 'Ellos/Ellas' }],
            tenses: [{ term: 'Non-Past', meaning: 'No-Pasado' }, { term: 'Past', meaning: 'Pasado' }, { term: 'Te-form', meaning: 'Forma Te' }],
            concepts: { formula: { title: 'Lógica Japonesa', subtitle: 'Aglutinación', subject: 'Tópico', verb: 'Raíz', tense: 'Auxiliar', result: 'Frase' }, motivation: { title: 'Armonía Estructurada', subtitle: 'Bloques de Construcción', text: 'Los verbos japoneses apilan terminaciones como bloques.' } },
            rules: [
                { group: '現在形', example: '書く', endings: [{ person: 'Simple', ending: '-う' }, { person: 'Cortés', ending: '-います' }] },
                { group: '否定形', example: '書く', endings: [{ person: 'Simple', ending: '-ない' }, { person: 'Cortés', ending: '-いません' }] },
                { group: '過去形', example: '書く', endings: [{ person: 'Simple', ending: '-いた/-んだ' }, { person: 'Cortés', ending: '-ました' }] },
                { group: '過去否定', example: '書く', endings: [{ person: 'Simple', ending: '-なかった' }, { person: 'Cortés', ending: '-いませんでした' }] },
                { group: 'て形', example: '書く', endings: [{ person: 'Simple', ending: '-いて/-んで' }, { person: 'Cortés', ending: '-いてください' }] },
                { group: '意向形', example: '書く', endings: [{ person: 'Simple', ending: '-おう' }, { person: 'Cortés', ending: '-いましょう' }] }
            ]
        },
        'French': {
            pronouns: [{ term: 'Watashi', meaning: 'Je' }, { term: 'Anata', meaning: 'Tu' }, { term: 'Kare/Kanojo', meaning: 'Il/Elle' }, { term: 'Watashitachi', meaning: 'Nous' }, { term: 'Anatatachi', meaning: 'Vous' }, { term: 'Karera', meaning: 'Ils/Elles' }],
            tenses: [{ term: 'Non-Past', meaning: 'Non-Passé' }, { term: 'Past', meaning: 'Passé' }, { term: 'Te-form', meaning: 'Forme Te' }],
            concepts: { formula: { title: 'Logique Japonaise', subtitle: 'Agglutination', subject: 'Thème', verb: 'Radical', tense: 'Auxiliaire', result: 'Phrase' }, motivation: { title: 'Harmonie Structurée', subtitle: 'Blocs de Construction', text: 'Les verbes japonais empilent les terminaisons comme des blocs.' } },
            rules: [
                { group: '現在形', example: '書く', endings: [{ person: 'Simple', ending: '-う' }, { person: 'Poli', ending: '-います' }] },
                { group: '否定形', example: '書く', endings: [{ person: 'Simple', ending: '-ない' }, { person: 'Poli', ending: '-いません' }] },
                { group: '過去形', example: '書く', endings: [{ person: 'Simple', ending: '-いた/-んだ' }, { person: 'Poli', ending: '-ました' }] },
                { group: '過去否定', example: '書く', endings: [{ person: 'Simple', ending: '-なかった' }, { person: 'Poli', ending: '-いませんでした' }] },
                { group: 'て形', example: '書く', endings: [{ person: 'Simple', ending: '-いて/-んで' }, { person: 'Poli', ending: '-いてください' }] },
                { group: '意向形', example: '書く', endings: [{ person: 'Simple', ending: '-おう' }, { person: 'Poli', ending: '-いましょう' }] }
            ]
        },
        'Japanese': {
            pronouns: [{ term: '私', meaning: '私' }, { term: 'あなた', meaning: 'あなた' }, { term: '彼/彼女', meaning: '彼/彼女' }, { term: '私たち', meaning: '私たち' }, { term: 'あなた達', meaning: 'あなた達' }, { term: '彼ら', meaning: '彼ら' }],
            tenses: [{ term: '非過去', meaning: '非過去形' }, { term: '過去', meaning: '過去形' }, { term: 'て形', meaning: 'て形' }],
            concepts: { formula: { title: '日本語の論理', subtitle: '膠着語', subject: '主題', verb: '語幹', tense: '助動詞', result: '文' }, motivation: { title: '構造的な調和', subtitle: '積み木', text: '日本語の動詞は積み木のように語尾を積み重ねます。' } },
            rules: [
                { group: '現在形', example: '書く', endings: [{ person: '常体', ending: '-う' }, { person: '敬体', ending: '-います' }] },
                { group: '否定形', example: '書く', endings: [{ person: '常体', ending: '-ない' }, { person: '敬体', ending: '-いません' }] },
                { group: '過去形', example: '書く', endings: [{ person: '常体', ending: '-いた/-んだ' }, { person: '敬体', ending: '-ました' }] },
                { group: '過去否定', example: '書く', endings: [{ person: '常体', ending: '-なかった' }, { person: '敬体', ending: '-いませんでした' }] },
                { group: 'て形', example: '書く', endings: [{ person: '常体', ending: '-いて/-んで' }, { person: '敬体', ending: '-いてください' }] },
                { group: '意向形', example: '書く', endings: [{ person: '常体', ending: '-おう' }, { person: '敬体', ending: '-いましょう' }] }
            ]
        }
    }
};
