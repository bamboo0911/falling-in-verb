
import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { VerbData, SentenceProblem, Language, LANGUAGE_CONFIGS } from "../types";
import { COMMON_VERBS_PT } from "../data/verbs_pt";
import { COMMON_VERBS_ES } from "../data/verbs_es";
import { COMMON_VERBS_JP } from "../data/verbs_jp";
import { COMMON_VERBS_FR } from "../data/verbs_fr";

// --- SCHEMA GENERATORS ---

const getVerbSchema = (lang: Language): Schema => {
  const config = LANGUAGE_CONFIGS[lang];
  const pronouns = config.pronouns;
  const tenses = config.tenses;

  // Dynamically build properties for each person (Eu, Você, etc.) OR Politeness Level (Plain, Polite)
  const conjugationProperties: Record<string, any> = {};
  pronouns.forEach(p => {
    conjugationProperties[p] = { type: Type.STRING };
  });

  // Dynamically build properties for each tense
  const tensesProperties: Record<string, any> = {};
  tenses.forEach(t => {
    tensesProperties[t] = {
      type: Type.OBJECT,
      properties: conjugationProperties,
      required: pronouns
    };
  });

  return {
    type: Type.OBJECT,
    properties: {
      verb: { type: Type.STRING, description: "The verb in dictionary/infinitive form" },
      englishMeaning: { type: Type.STRING, description: "Definition of the verb in the requested Instruction Language (e.g., Traditional Chinese if requested)" },
      verbGroup: { type: Type.STRING, description: "Grammatical classification (e.g., 'Godan', 'Ichidan', 'Irregular' for JP; '-ar', '-er' for others)" },
      reading: { type: Type.STRING, description: "Pronunciation guide (Hiragana for JP, null for others)" },
      tenses: {
        type: Type.OBJECT,
        description: `Conjugation table for ${config.name}`,
        properties: tensesProperties,
        required: tenses
      }
    },
    required: ["verb", "englishMeaning", "tenses"]
  };
};

const sentenceSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      fullTranslation: { type: Type.STRING, description: "Full translation of the sentence in the requested Instruction Language" },
      correctAnswer: { type: Type.STRING, description: "The correct conjugated verb form that fits in the blank" },
      tokens: {
        type: Type.ARRAY,
        description: "The sentence split into words/tokens. One token must be marked as the blank.",
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The word or punctuation mark" },
            translation: { type: Type.STRING, description: "Translation of this specific word in the requested Instruction Language" },
            isBlank: { type: Type.BOOLEAN, description: "True if this is the verb to be filled in by user" }
          },
          required: ["text", "translation"]
        }
      }
    },
    required: ["id", "fullTranslation", "correctAnswer", "tokens"]
  }
};

// --- API CALLS ---

export const generateRandomVerb = async (lang: Language, instructionLang: string = 'English'): Promise<VerbData> => {
  console.log(`[Service] generateRandomVerb called for lang: ${lang}, instructionLang: ${instructionLang}`);
  
  let aiClient;
  if (!process.env.API_KEY) {
    console.error("[Service] Missing API_KEY");
    throw new Error("Missing API_KEY environment variable");
  }
  
  try {
     aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } catch (e) {
    console.error("[Service] Failed to initialize Gemini Client", e);
    throw new Error("Failed to initialize Gemini Client");
  }

  const model = "gemini-2.5-flash";
  const config = LANGUAGE_CONFIGS[lang];
  
  // 1. Pick a random verb based on language
  let list;
  if (lang === 'pt') list = COMMON_VERBS_PT;
  else if (lang === 'es') list = COMMON_VERBS_ES;
  else if (lang === 'fr') list = COMMON_VERBS_FR;
  else list = COMMON_VERBS_JP;

  const randomIndex = Math.floor(Math.random() * list.length);
  const selectedVerb = list[randomIndex];
  console.log(`[Service] Selected random verb from local DB: "${selectedVerb}"`);

  // 2. Build prompt based on language details
  const pronounsList = config.pronouns.join(", ");
  const tensesList = config.tenses.join(", ");
  
  let prompt = `
    Provide the meaning and conjugations for the ${config.name} verb: '${selectedVerb}'.
    
    IMPORTANT: Provide the 'englishMeaning' (definition) in **${instructionLang}**.
    
    Required Tenses (Keys): ${tensesList}.
    Required Styles/Persons (Keys within tenses): ${pronounsList}.

    Important: Return the JSON strictly matching the schema.
  `;

  if (lang === 'jp') {
    prompt += `
      Note for Japanese Conjugation Logic:
      - 'verbGroup': Identify as Godan, Ichidan, or Irregular.
      - 'reading': Hiragana only.
      
      Grid Content Rules for '${selectedVerb}':
      1. present (Non-Past):
         - Plain: Dictionary Form (e.g., Taberu)
         - Polite: Masu Form (e.g., Tabemasu)
      
      2. negative (Non-Past Negative):
         - Plain: Nai-Form (e.g., Tabenai)
         - Polite: Masen Form (e.g., Tabemasen)

      3. past (Past Affirmative):
         - Plain: Ta-Form (e.g., Tabeta)
         - Polite: Mashita Form (e.g., Tabemashita)

      4. past_neg (Past Negative):
         - Plain: Nakatta Form (e.g., Tabenakatta)
         - Polite: Masen deshita Form (e.g., Tabemasen deshita)

      5. te_form (Connective):
         - Plain: Te-Form (e.g., Tabete)
         - Polite: Masu-stem + mashite (e.g., Tabemashite). Note: This is formal. If the verb is rarely used in 'mashite' form, provide the polite equivalent appropriate for formal speech.

      6. volitional (Let's / Will):
         - Plain: Volitional Form (e.g., Tabeyou)
         - Polite: Mashou Form (e.g., Tabemashou)

      - Provide answers in standard Japanese (Kanji + Kana where appropriate).
      - Ensure strict alignment with the keys: present, negative, past, past_neg, te_form, volitional.
    `;
  } else if (lang === 'fr') {
    prompt += `
      Note for French Conjugation:
      - For 'Passé Composé', ALWAYS include the auxiliary verb (avoir or être) followed by the past participle.
        Example: "j'ai mangé" or "je suis allé". The user must type both words.
      - Handle "Il/Elle/On" as the standard 3rd person singular conjugation. Provide a single string.
      - Handle "Ils/Elles" as the standard 3rd person plural conjugation. Provide a single string.
      - Handle contracted forms (e.g., "J'aime" instead of "Je aime") if the verb starts with a vowel.
    `;
  } else {
    prompt += `
      For 'Você' or 'Usted', ensure the conjugation matches the 3rd person grammatical form.
      
      CRITICAL FOR SPANISH: 
      The schema expects the exact keys: "${pronounsList}".
      If the key is "Él/Ella/Usted", provide a SINGLE string with the conjugation that applies to all of them (e.g., "come"). Do not return an object.
      If the key is "Ellos/Ellas/Ustedes", provide a SINGLE string (e.g., "comen").
    `;
  }

  try {
    console.log("[Service] Sending request to Gemini API (Verb Generation)...");
    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: getVerbSchema(lang),
        temperature: 0.2, 
      }
    });

    console.log("[Service] Response received from Gemini API");
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    console.log("[Service] Parsing JSON response...");
    const data = JSON.parse(text);
    console.log("[Service] Verb data parsed successfully", data.verb);
    return { ...data, language: lang }; // Inject language into result
  } catch (error) {
    console.error("[Service] Error generating verb:", error);
    throw error;
  }
};

export const generateSentences = async (verb: string, lang: Language, instructionLang: string = 'English'): Promise<SentenceProblem[]> => {
  console.log(`[Service] generateSentences called for verb: "${verb}", lang: ${lang}`);
  
  let aiClient;
  if (!process.env.API_KEY) {
    console.error("[Service] Missing API_KEY");
    throw new Error("Missing API_KEY environment variable");
  }
  
  try {
     aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } catch (e) {
    console.error("[Service] Failed to initialize Gemini Client");
    throw new Error("Failed to initialize Gemini Client");
  }

  const model = "gemini-2.5-flash";
  const config = LANGUAGE_CONFIGS[lang];

  let prompt = `
    Create 5 different sentences in ${config.name} using the verb '${verb}'.
    Use a mix of tenses (${config.tenses.join(', ')}).
    
    For each sentence:
    1. Provide the full translation in **${instructionLang}**.
    2. Break the sentence down into tokens (words/punctuation).
    3. Mark EXACTLY ONE token as the 'isBlank' (this must be the conjugated form of '${verb}').
    4. For each token, provide a context-aware translation in **${instructionLang}**.
  `;

  if (lang === 'jp') {
    prompt += `
      - Use standard Japanese (Kanji + Kana).
      - Ensure the 'correctAnswer' matches exactly how it appears in the full sentence (conjugation).
      - Include a mix of Plain and Polite styles in the sentences.
      - Try to include different forms (Negative, Past, Te-form, Volitional) in the examples.
    `;
  } else if (lang === 'fr') {
    prompt += `
      - CRITICAL FOR FRENCH COMPOUND VERBS: If the verb form is compound (e.g., 'Passé Composé' like "ai mangé", "suis allé"), you MUST treat the entire phrase as a SINGLE token. 
      - The token.text should be "ai mangé" and isBlank should be true. DO NOT split "ai" and "mangé" into separate tokens if it's the target verb.
      - Handle vowel contractions (e.g. l', d', j') correctly. If "J'aime" is the word, the token should be "J'aime".
    `;
  } else {
    prompt += `
      - Ensure the sentences are natural for ${lang === 'pt' ? 'Brazilian' : 'Latin American'} daily life.
    `;
  }

  try {
    console.log("[Service] Sending request to Gemini API (Sentence Generation)...");
    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: sentenceSchema,
        temperature: 0.7,
      }
    });

    console.log("[Service] Response received from Gemini API");
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    console.log("[Service] Parsing Sentence JSON...");
    const sentences = JSON.parse(text) as SentenceProblem[];
    console.log(`[Service] Successfully generated ${sentences.length} sentences`);
    return sentences;
  } catch (error) {
    console.error("[Service] Error generating sentences:", error);
    return [];
  }
};

export const createChatSession = (lang: Language, currentVerb?: string, instructionLang: string = 'English'): Chat => {
  console.log(`[Service] createChatSession called. Lang: ${lang}, Verb: ${currentVerb}`);
  
  let aiClient;
  if (!process.env.API_KEY) {
     console.error("[Service] Missing API_KEY for chat");
     throw new Error("Missing API_KEY");
  }
  
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const config = LANGUAGE_CONFIGS[lang];
  
  const systemInstruction = `
    You are a friendly, patient, and knowledgeable language tutor named "LusoBot" (or "HispanoBot"/"NihongoBot"/"FrancBot" depending on language).
    Your goal is to help the user learn ${config.name}.
    ${currentVerb ? `The user is currently studying the verb "${currentVerb}". Keep the context focused on this verb unless asked otherwise.` : ''}
    
    Guidelines:
    - **Persona**: Encouraging, clear, concise.
    - **Language**: 
      - The user prefers explanations in **${instructionLang}**.
      - If the user writes in English or ${instructionLang}, reply in ${instructionLang} (but use ${config.name} for examples).
      - If the user writes in ${config.name}, reply in simple ${config.name} (A2/B1 level) to encourage immersion where appropriate, but use ${instructionLang} if they seem confused.
    - **Corrections**: If the user makes a grammar or vocabulary mistake, gently correct them in a supportive way before answering.
    - **Formatting**: Use **bold** for key terms or corrections. Use lists for examples.
    ${lang === 'jp' ? '- **Japanese Specific**: Distinguish clearly between Plain and Polite forms. Explain Kanji if necessary.' : ''}
    ${lang === 'fr' ? '- **French Specific**: Pay attention to gender, number agreements, and auxiliary verbs in Passé Composé.' : ''}
  `;

  console.log("[Service] Chat session created");
  return aiClient.chats.create({
    model: 'gemini-2.5-flash', 
    config: { systemInstruction }
  });
};
