# Feature Specifications 📋

## 1. Language Support & Grammar Logic

The application supports four distinct languages, each with tailored grammar logic and AI generation rules.

| Language | Focus Area | Structural Logic | Tense Coverage |
| :--- | :--- | :--- | :--- |
| **Portuguese** 🇧🇷 | Brazilian Daily Usage | 6 Pronouns (Eu...Eles) | Presente, Pretérito Perfeito, Futuro do Presente |
| **Spanish** 🇪🇸 | Latin American | 5 Pronouns (Merged 3rd Person) | Presente, Pretérito Indefinido, Futuro Simple |
| **French** 🇫🇷 | Standard Grammar | 6 Pronouns (Je...Ils) | Présent, Passé Composé, Futur Simple |
| **Japanese** 🇯🇵 | Structural Mastery | 2 Styles (Plain/Polite) x 6 Forms | Non-Past, Negative, Past, Past Neg, Te-Form, Volitional |

### AI Generation Rules
*   **Spanish Merged Pronouns**: The AI is explicitly instructed to return a single string for merged keys (e.g., "Él/Ella/Usted"), ensuring concise data structures.
*   **French Compound Tenses**: *Passé Composé* is generated as a single atomic token (Auxiliary + Participle), e.g., "ai mangé". Elisions (e.g., "J'aime") are treated as single units for fill-in-the-blank exercises.
*   **Japanese Polarity**: The UI renders a specific 6-row vertical layout to accommodate the complexity of Plain vs. Polite forms across multiple tenses.

---

## 2. Profile Dashboard 2.0

A comprehensive, data-rich modal accessible via the user avatar, designed to visualize learning progress.

### Interaction Design
*   **Carousel Navigation**: Unified slider container displaying one metric at a time, navigable via arrows or touch swipe gestures.
*   **Smart Unlock System**:
    *   **Locked State**: Tabs for unpracticed languages are hidden to reduce cognitive load.
    *   **Empty State**: Encouraging prompts ("Complete your first lesson...") replace empty charts.
    *   **Auto-Migration**: Legacy users are automatically migrated to the unlock system upon login.

### Visualization Metrics
1.  **Accuracy Trend**: Line chart tracking session accuracy over 3, 7, and 30-day windows.
2.  **Daily Volume**: Bar chart displaying the number of verbs completed per day.
3.  **Speed Analysis**: Line chart tracking average time-to-completion (seconds per verb).
4.  **Vocabulary Mastery**: A Word Cloud visualization of the `verb_stats` subcollection, highlighting most practiced verbs.

---

## 3. Core Learning Loop

The learning process is divided into five distinct phases to ensure focused practice.

### Phase A: Authentication
*   **Dedicated Interface**: Separated from language selection for security and clarity.
*   **Modes**:
    *   **Google Sign-In**: Enables cloud sync and cross-device progress.
    *   **Guest Mode**: Local-only session for immediate trial.

### Phase B: Context Setup
*   **Language Selection**: User selects the target language.
*   **Instruction Language**: User selects their preferred language for explanations (English, Chinese, etc.).
*   **Trigger**: Selection initiates the blocking load of the first verb.

### Phase C: Conjugation Practice
*   **Interface**: Tabbed input system (Mobile) or Grid (Desktop).
*   **Validation**: Real-time visual feedback (Green/Red) upon submission.
*   **Constraint**: Users must complete all fields to proceed.

### Phase D: Contextual Application
*   **Content**: 5 AI-generated sentences using the target verb.
*   **Interaction**: Fill-in-the-blank mechanics with tooltip translations for every word.
*   **Persistence**: Completion triggers the `saveSession` event, committing data to Firestore.

### Phase E: Session Summary
*   **Feedback**: Modal displaying the Verb, Time Elapsed, and XP earned.
*   **Transition**: "Next Verb" button instantly loads the pre-fetched data for the next cycle.
