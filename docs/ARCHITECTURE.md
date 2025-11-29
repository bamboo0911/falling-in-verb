# Technical Architecture 🏗️

## 1. The "No-Build" Firebase Strategy (Critical)

A core architectural challenge in modern web development is using Firebase in a purely client-side environment (like this React App served via ESM) without a complex bundler like Webpack or Vite handling the transpilation.

### The Problem
Importing `firebase/app` via standard ESM CDNs (like `esm.sh`) often results in "Component auth has not been registered" or "Default export not found" errors. This is because the modular SDKs expect a specific build environment to resolve dependencies between the Core, Auth, and Firestore modules.

### The Solution: Gstatic + Compat API
We adopted a robust "No-Build" strategy:

1.  **Global Loading (index.html)**: We load the **official Google Gstatic scripts** via the `importmap`.
    *   `firebase-app-compat.js`
    *   `firebase-auth-compat.js`
    *   `firebase-firestore-compat.js`
    *   *Why Compat?* The "Compat" libraries attach themselves to a global `firebase` namespace, ensuring that Auth and Firestore share the exact same instance of the App core.
2.  **Namespace Resolution (firebaseConfig.ts)**:
    *   We use `import * as firebase` but prioritize `window.firebase` if available.
    *   We export a sanitized `firebase`, `auth`, and `db` instance to the rest of the app.
3.  **Result**: 100% stability across browsers without requiring a Node.js build step for deployment.

---

## 2. Data Strategy: Client-Side Filtering

### The "Index Hell" Problem
Firestore requires specific Composite Indexes for every combination of `.where()` and `.orderBy()`.
*   *Scenario*: To filter by Language ('pt') AND sort by Time ('desc') for a specific User, we need an index: `userId + language + timestamp`.
*   *Issue*: Adding more languages or changing sort direction requires manual index creation in the Firebase Console, causing friction and errors during development.

### The Solution
We moved the filtering logic to the **Client Side (JavaScript)** for the Dashboard.

1.  **Broad Query**: The app asks Firestore: *"Give me the last 100 logs for this User"* (Requires only a basic `userId + timestamp` index).
2.  **In-Memory Filter**: The `dbService` filters the returned array by `language` and `date` in JavaScript.
3.  **Performance Impact**: Negligible. Even active users generate <1000 logs/month. Processing this in the browser takes milliseconds but saves hours of database configuration maintenance.

---

## 3. State Machine (AppPhase)

The entire application flow is controlled by a single enum `AppPhase`.

```typescript
enum AppPhase {
  LOGIN,              // 1. Auth Wall (Guest vs Google)
  LANDING,            // 2. Language Selection (PT/ES/JP/FR)
  LOADING_VERB,       // 3. API Call (Blocking Load)
  CONJUGATION_INPUT,  // 4. User inputs verb forms
  CONJUGATION_REVIEW, // 5. Validation & Correction
  LOADING_SENTENCES,  // 6. API Call (Usually skipped via Prefetch)
  SENTENCE_INPUT,     // 7. Context Challenge
  SENTENCE_REVIEW     // 8. Final Validation -> Save to DB
}
```

---

## 4. Double Prefetching Pipeline

To eliminate the 3-5 second latency typical of LLM applications, we run a parallel execution pipeline:

1.  **Stage A (Verb Load)**:
    *   As soon as the user selects a language or loads a verb...
    *   **Action**: Trigger `generateSentences(CurrentVerb)`.
    *   **Result**: By the time the user finishes the Conjugation Table (approx 45s), the sentences are already waiting in memory. Phase 6 is skipped entirely.

2.  **Stage B (Context Start)**:
    *   As soon as the user starts the Sentence Challenge...
    *   **Action**: Trigger `generateRandomVerb(NextVerb)`.
    *   **Result**: When the user clicks "Next Verb", the new data is instantly swapped in. Phase 3 is skipped.

---

## 5. UI/UX Architecture

*   **Mobile-First Design**:
    *   **Desktop**: Grid layouts for conjugation tables.
    *   **Mobile**: Tabbed Interface (One tense per tab) to accommodate on-screen keyboards.
*   **PWA (Progressive Web App)**:
    *   **Service Worker**: Caches UI assets (`Stale-While-Revalidate`) but bypasses API calls.
    *   **iOS Integration**: Dynamically generates PNG icons from SVGs at runtime to support Apple Home Screen requirements.
