# Database & Metrics Plan 📊

## 1. Firestore Schema Design

We utilize a **Dual-Layer + Aggregation** architecture to ensure fast reads for the dashboard while maintaining detailed logs for analysis.

### Collection: `users` (The Dashboard Snapshot)
**Path:** `users/{uid}`
**Purpose:** Stores accumulated stats for instant profile loading.

```typescript
interface UserProfile {
  uid: string;
  // ...Auth fields
  
  // Progression Logic
  totalVerbsCompleted: number;  // The "Big Number" on the dashboard
  lastActiveAt: Timestamp;      // For streak/retention tracking
  
  // Unlock System
  currentLanguage: 'pt' | 'es' | 'jp' | 'fr';
  unlockedLanguages: ['pt', 'fr']; // Dynamic list. Only languages practiced appear in UI.
}
```

### Collection: `learning_logs` (The Timeline)
**Path:** `learning_logs/{logId}`
**Purpose:** Detailed history used to draw the Line/Bar charts.

```typescript
interface LearningLog {
  userId: string;
  timestamp: Timestamp;
  language: string;
  verb: string;
  
  // Performance Data
  duration: number;       // Seconds
  accuracy: number;       // 0.0 - 1.0 (Calculated dynamically)
  mistakes: number;
  totalQuestions: number; // Dynamic denominator
}
```

### Sub-Collection: `verb_stats` (The Word Cloud)
**Path:** `users/{uid}/verb_stats/{verbId}`
**Purpose:** Aggregated stats per word. Used to render the Word Cloud without querying thousands of logs.

```typescript
interface VerbStat {
  verb: "falar";
  language: "pt";
  count: 5;               // How many times practiced (Determines Font Size)
  accumulatedAccuracy: 4.2; // Sum of accuracy scores
  lastPracticed: Timestamp;
}
```
*Note: Average Accuracy (Color) = `accumulatedAccuracy / count`*

---

## 2. Metric Calculation Logic

### A. Dynamic Accuracy Score
Since different languages have different complexity, we cannot use a fixed denominator.

**Formula:**
`Accuracy = (TotalQuestions - Mistakes) / TotalQuestions`

**Where `TotalQuestions` varies by language:**
*   **Portuguese (PT)**: 18 Tense Inputs + 5 Sentences = **23**
*   **Spanish (ES)**: 15 Tense Inputs + 5 Sentences = **20**
*   **French (FR)**: 18 Tense Inputs + 5 Sentences = **23**
*   **Japanese (JP)**: 12 Tense Inputs + 5 Sentences = **17**

This ensures a "90% Accuracy" means the same mastery level regardless of the language.

### B. Word Cloud Visualization
*   **Size (Frequency)**: Normalized between `0.8rem` and `2.0rem` based on the min/max `count` in the user's dataset.
*   **Color (Mastery)**: Based on `Avg Accuracy`:
    *   🔴 **< 20%**: Rose-500 (Critical)
    *   🟠 **20-40%**: Rose-400 (Weak)
    *   ⚪ **40-60%**: Stone-400 (Average)
    *   🟢 **60-80%**: Emerald-400 (Good)
    *   🌳 **> 80%**: Emerald-600 (Mastered)

---

## 3. Data Flow & Atomic Writes

When a user finishes a session, we perform a **Batch Write** to ensure data consistency across all 3 collections.

**Event:** `dbService.saveSession()`

1.  **Create Log**: New document in `learning_logs`.
2.  **Update Profile**:
    *   `totalVerbsCompleted`: `increment(1)`
    *   `lastActiveAt`: `serverTimestamp()`
    *   `unlockedLanguages`: `arrayUnion(currentLang)`
3.  **Update Word Cloud**:
    *   `count`: `increment(1)`
    *   `accumulatedAccuracy`: `increment(sessionAccuracy)`

**Why Batch?**
If the network fails, either everything saves or nothing saves. We never end up with a "Total Count" that doesn't match the actual number of logs.
