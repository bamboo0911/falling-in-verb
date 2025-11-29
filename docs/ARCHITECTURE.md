# Technical Architecture 🏗️

## System Abstract

Falling In Verb is architected as a high-performance, client-side Single Page Application (SPA) that interfaces directly with Firebase services (Auth, Firestore) and the Google Gemini API. The system is designed to operate without a traditional backend server, relying instead on a robust "No-Build" strategy for service integration and a client-side state machine for application flow control.

---

## 1. The "No-Build" Firebase Strategy

### Challenge
Integrating modular Firebase SDKs into a purely client-side ESM environment (like a Vite-less React setup served via CDN) often leads to dependency resolution failures, specifically "Component auth has not been registered" errors.

### Solution: Gstatic Singleton Pattern
We implement a **Global Singleton Strategy** to ensure stability:

1.  **Global Injection**: Official Google Gstatic scripts (`firebase-app-compat.js`, etc.) are loaded via `index.html`, attaching the `firebase` namespace to the global `window` object.
2.  **Namespace Resolution**: The `firebaseConfig.ts` module prioritizes `window.firebase` over package imports, exporting a sanitized instance to the application.
3.  **Benefit**: This guarantees that Auth and Firestore modules share the exact same core instance, eliminating initialization race conditions and ensuring 100% browser compatibility without a build step.

---

## 2. Data Strategy: Client-Side Aggregation

### Challenge: "Index Hell"
Firestore requires composite indexes for every unique combination of `.where()` and `.orderBy()` clauses. A dashboard allowing users to filter by Language, Date, and Status would exponentially increase the number of required indexes, creating a maintenance burden.

### Solution: In-Memory Filtering
We adopt a **Fetch-Then-Filter** pattern for the dashboard:

1.  **Broad Query**: The application requests a time-boxed dataset for the user (e.g., "Last 100 logs"). This requires only a simple `userId + timestamp` index.
2.  **Client Processing**: The `dbService` performs granular filtering (by Language, Verb, etc.) and aggregation (calculating averages) in JavaScript.
3.  **Performance**: Given the typical user volume (<1000 logs/month), client-side processing is instantaneous (sub-millisecond) and significantly reduces database configuration complexity.

---

## 3. Application State Machine

The user experience is strictly controlled by the `AppPhase` enum, ensuring a deterministic flow.

```typescript
enum AppPhase {
  LOGIN,              // 1. Authentication Wall
  DASHBOARD,          // 2. Main Analytics Dashboard
  LANGUAGE_SELECTION, // 3. Language Context Switch
  LOADING_VERB,       // 4. API Request (Blocking)
  CONJUGATION_INPUT,  // 5. Active Practice: Verb Forms
  CONJUGATION_REVIEW, // 6. Feedback & Correction
  LOADING_SENTENCES,  // 7. API Request (Background/Blocking)
  SENTENCE_INPUT,     // 8. Active Practice: Contextual Usage
  SENTENCE_REVIEW     // 9. Final Validation & Persistence
}
```

---

## 4. Double Prefetching Pipeline

To neutralize the inherent latency of Large Language Models (3-5s), the system employs a predictive prefetching mechanism:

### Stage A: Context Prefetch
*   **Trigger**: User loads a Verb.
*   **Action**: Background request for `generateSentences(CurrentVerb)`.
*   **Outcome**: While the user completes the conjugation table (~45s), context sentences are generated and cached. Phase 7 is effectively skipped.

### Stage B: Next-Verb Prefetch
*   **Trigger**: User begins Context Practice.
*   **Action**: Background request for `generateRandomVerb(NextVerb)`.
*   **Outcome**: Upon completing the session, the next verb is already available. Phase 4 is effectively skipped for subsequent cycles.

---

## 5. UI/UX Architecture

*   **Mobile-First Design System**:
    *   **Adaptive Layouts**: Switches between Grid (Desktop) and Tabbed (Mobile) views to accommodate on-screen keyboards.
    *   **Touch Optimization**: Expanded touch targets (44px+) for all interactive elements.
*   **PWA Integration**:
    *   **Service Worker**: Implements `Stale-While-Revalidate` caching for app shell assets.
    *   **Dynamic Iconography**: A runtime script generates iOS-compliant PNG icons from SVGs via HTML5 Canvas, bypassing iOS limitations on SVG home screen icons.
