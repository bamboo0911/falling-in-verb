# Database & Metrics Architecture 📊

## 1. Firestore Schema Design

The database utilizes a **Dual-Layer + Aggregation** architecture to balance high-performance reads for the dashboard with granular logging for detailed analysis.

### Collection: `users` (Snapshot Layer)
**Path:** `users/{uid}`
**Purpose:** Stores high-level accumulated statistics for instant profile loading.

```typescript
interface UserProfile {
  uid: string;
  // ...Auth fields
  
  // Progression Metrics
  totalVerbsCompleted: number;  // Primary dashboard metric
  lastActiveAt: Timestamp;      // Retention tracking
  
  // Unlock System
  currentLanguage: 'pt' | 'es' | 'jp' | 'fr';
  unlockedLanguages: Array<'pt' | 'es' | 'jp' | 'fr'>; // Dynamic visibility
}
```

### Collection: `learning_logs` (Timeline Layer)
**Path:** `learning_logs/{logId}`
**Purpose:** Granular history used to generate time-series visualizations (Line/Bar charts).

```typescript
interface LearningLog {
  userId: string;
  timestamp: Timestamp;
  language: string;
  verb: string;
  
  // Performance Metrics
  duration: number;       // Seconds
  accuracy: number;       // 0.0 - 1.0 (Calculated)
  mistakes: number;
  totalQuestions: number; // Dynamic denominator based on language
}
```

### Sub-Collection: `verb_stats` (Aggregation Layer)
**Path:** `users/{uid}/verb_stats/{verbId}`
**Purpose:** Pre-aggregated statistics per word to enable efficient Word Cloud rendering without expensive queries.

```typescript
interface VerbStat {
  verb: string;         // e.g., "falar"
  language: string;     // e.g., "pt"
  count: number;        // Practice frequency (Determines Font Size)
  accumulatedAccuracy: number; // Sum of accuracy scores
  lastPracticed: Timestamp;
}
```
*Note: Average Accuracy (Color) is calculated as `accumulatedAccuracy / count`.*

---

## 2. Metric Calculation Logic

### A. Dynamic Accuracy Score
To normalize performance across languages with varying complexity, we use a dynamic denominator.

**Formula:**
`Accuracy = (TotalQuestions - Mistakes) / TotalQuestions`

**TotalQuestions Definitions:**
*   **Portuguese (PT)**: 18 Tense Inputs + 5 Sentences = **23**
*   **Spanish (ES)**: 15 Tense Inputs + 5 Sentences = **20**
*   **French (FR)**: 18 Tense Inputs + 5 Sentences = **23**
*   **Japanese (JP)**: 12 Tense Inputs + 5 Sentences = **17**

This normalization ensures that "90% Accuracy" represents an equivalent mastery level regardless of the language structure.

### B. Word Cloud Visualization
*   **Size (Frequency)**: Normalized between `0.8rem` and `2.0rem` based on the user's min/max `count`.
*   **Color (Mastery)**: Derived from `Avg Accuracy`:
    *   🔴 **< 20%**: Critical (Rose-500)
    *   🟠 **20-40%**: Weak (Rose-400)
    *   ⚪ **40-60%**: Average (Stone-400)
    *   🟢 **60-80%**: Good (Emerald-400)
    *   🌳 **> 80%**: Mastered (Emerald-600)

---

## 3. Data Consistency Strategy

To ensure data integrity across the three layers, we utilize **Atomic Batch Writes**.

**Transaction: `dbService.saveSession()`**

1.  **Create Log**: A new document is written to `learning_logs`.
2.  **Update Profile**:
    *   `totalVerbsCompleted`: Incremented by 1.
    *   `lastActiveAt`: Updated to server timestamp.
    *   `unlockedLanguages`: Current language added via `arrayUnion`.
3.  **Update Aggregates**:
    *   `count`: Incremented by 1.
    *   `accumulatedAccuracy`: Incremented by the session accuracy.

**Benefit**: This transactional approach ensures that the "Total Count" displayed on the dashboard always matches the actual number of logs, even in the event of network failure.
