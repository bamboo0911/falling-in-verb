# Feature Specifications 📋

## 1. Supported Languages & Grammar Logic

### 🇧🇷 Portuguese (Brazil)
-   **Focus**: Daily spoken Brazilian Portuguese.
-   **Structure**: 6 Pronouns (Eu, Você, Ele/Ela, Nós, Vocês, Eles/Elas) x 3 Tenses.

### 🇪🇸 Spanish (Latin America)
-   **Focus**: Latin American usage.
-   **Structure**: 5 Pronouns (Merged 3rd Person: Él/Ella/Usted share a cell) x 3 Tenses.
-   **AI Logic**: Prompts explicitly instruct Gemini to return a single string for merged pronouns.

### 🇫🇷 French
-   **Focus**: Standard French.
-   **Structure**: 6 Pronouns x 3 Tenses.
-   **Grammar Logic**:
    -   **Passé Composé**: The AI generates the auxiliary verb + participle (e.g., "ai mangé") as a **single token**.
    -   **Elision**: Contractions (J'aime, l'école) are treated as atomic units for fill-in-the-blank exercises.

### 🇯🇵 Japanese
-   **Focus**: The "4 Pillars" + Te-Form + Volitional.
-   **Structure**: 2 Styles (Plain, Polite) x 6 Forms (Present, Negative, Past, Past Neg, Te-Form, Volitional).
-   **Display**: Uses a vertical list layout on mobile instead of a horizontal table.

---

## 2. Profile Dashboard 2.0

A data-rich modal accessible via the user avatar.

### UI Interaction (Carousel)
-   **Layout**: A unified slider container displaying one metric at a time.
-   **Navigation**: Left/Right arrows + Dot indicators.
-   **Gestures**: Supports Touch Swipe on mobile devices.

### Progression System (Unlock)
-   **Locked State**: Users only see tabs for languages they have actually practiced.
-   **Empty State**: "Complete your first lesson to visualize progress."
-   **Migration**: Existing users without the unlock flag are auto-migrated upon their next login/sync.

### Charts
1.  **Accuracy Trend**: Line chart of session accuracy over 3/7/30 days.
2.  **Daily Volume**: Bar chart of verbs completed.
3.  **Speed**: Line chart of average seconds per verb.
4.  **Vocabulary Mastery (Word Cloud)**: Visualizes the `verb_stats` subcollection.

---

## 3. Core Learning Loop (Updated)

### Phase A: Authentication (Login)
-   **Dedicated Screen**: Separated from the language selection.
-   **Options**: Google Sign-In (Syncs data) or Guest Mode (Local only).

### Phase B: Language Selection
-   **Instruction Language**: Users can choose to receive explanations in English, Chinese, Portuguese, Spanish, etc.
-   **Action**: Selection triggers the blocking load of the *first* verb.

### Phase C: Conjugation
-   **Mobile UX**: Users navigate tabs (Tenses) and must reach the end to see the "Finish" button.
-   **Feedback**: Instant Green/Red validation visuals.

### Phase D: Context Challenge
-   **Content**: 5 AI-generated sentences.
-   **Interaction**: Click words for translation tooltips.
-   **Completion**: Triggers the `saveSession` database event.

### Phase E: Summary
-   **Modal**: Shows the Verb, Time Elapsed, and XP/Score.
-   **Transition**: "Next Verb" loads the pre-fetched data instantly.
