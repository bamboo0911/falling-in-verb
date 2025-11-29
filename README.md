# Falling In Verb 🌸

**Falling In Verb** is an intelligent, AI-powered Progressive Web App (PWA) designed to help users master verb conjugations in **Portuguese (Brazil)**, **Spanish (Latin America)**, **Japanese**, and **French**.

Unlike traditional flashcards, it uses **Generative AI (Google Gemini)** to create infinite, context-aware exercises, ensuring no two sessions are ever the same. It features a "Double Prefetching" pipeline for zero-latency transitions and a "User-Centric" database architecture for tracking learning curves.

---

## ✨ Key Features

-   **Infinite Content**: Real-time generation of verbs and fill-in-the-blank sentences using Gemini 2.5 Flash.
-   **Multi-Language Support**:
    -   🇧🇷 **Portuguese**: Focus on Brazilian daily usage.
    -   🇪🇸 **Spanish**: Latin American focus (merged 3rd person).
    -   🇯🇵 **Japanese**: 6-column structure (Plain/Polite x Tense/Polarity).
    -   🇫🇷 **French**: Standard French grammar (Passé Composé logic).
-   **Data-Driven Insights**:
    -   **Visual Dashboard**: Custom SVG charts tracking Accuracy, Daily Volume, and Speed.
    -   **Long-term Tracking**: Firestore database records every session to visualize progress over 3, 7, or 30 days.
-   **Zero-Latency Flow**: Implements a **Double Prefetching Pipeline** that generates the next learning cycle in the background while the user is practicing.
-   **Mobile-First PWA**:
    -   Optimized touch targets and tabbed interfaces for mobile.
    -   **iOS Optimized**: Dynamic PNG icon generation for Apple home screens.
    -   Offline shell support via Service Workers.
-   **Airy Rose Theme**: A custom-designed, low-saturation "Sakura Mochi" aesthetic for a stress-free learning environment.

---

## 🛠 Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS (Custom "Airy Rose" Palette)
-   **AI Core**: Google Gemini API (`gemini-2.5-flash`)
-   **Backend / DB**: Firebase Authentication & Firestore (NoSQL)
    -   *Implementation*: **Firebase Compat SDK (v8 syntax)** loaded via **Gstatic CDN** to ensure modular stability in a no-build environment.
-   **Infrastructure**: Single Page Application (SPA) served via CDN

---

## 🏗 Architecture Overview

```mermaid
graph TD
    User[User / Client] -->|Auth & Data| Firebase[Firebase (Auth + Firestore)]
    User -->|Practice Interface| App[React App]
    
    subgraph "Frontend Logic"
        App -->|State Machine| PhaseController[AppPhase Controller]
        App -->|Background| Prefetcher[Double Prefetching Pipeline]
        App -->|Visualization| Dashboard[SVG Chart Engine]
    end
    
    subgraph "AI Services"
        Prefetcher -->|Generate Verb| GeminiVerb[Gemini: Verb Schema]
        Prefetcher -->|Generate Sentences| GeminiSent[Gemini: Sentence Schema]
    end
    
    subgraph "Data Storage"
        App -->|Log Session| DB_Logs[Collection: learning_logs]
        App -->|Sync Profile| DB_Users[Collection: users]
    end
```

---

## 🚀 Installation & Setup

1.  **Clone the repository**.
2.  **Environment Variables**:
    *   `API_KEY`: Your Google Gemini API Key.
    *   *Note*: Firebase config is public/client-side (BaaS model).
3.  **Run Locally**:
    ```bash
    npm install
    npm start
    ```

---

## ⚠️ Firebase Troubleshooting

If your Dashboard charts are not loading, check the Browser Console (F12).

1.  **"Missing or insufficient permissions"**:
    -   You need to update your **Firestore Security Rules**.
    -   Copy the content of `firestore.rules` in this project and paste it into the Firebase Console > Build > Firestore Database > Rules.

2.  **"The query requires an index"**:
    -   This is normal for the first run.
    -   Look for a long URL in the console error log.
    -   **Click the link** to automatically create the required Composite Index in Firebase.

---

## 💡 Technical Highlights

### 1. The "No-Build" Firebase Strategy
To resolve conflicts between modern ES Modules and CDN-hosted scripts without a complex bundler:
-   We load the **official Google Gstatic scripts** in `index.html`.
-   We use the **Firebase Compat API** in our TypeScript code to interface with the global singleton.
-   This ensures 100% reliability for Auth and Firestore across all browsers.

### 2. Double Prefetching Pipeline
To eliminate the 3-5 second wait time typical of LLM applications:
1.  **Stage A**: As soon as a verb is loaded, we immediately trigger the generation of **Context Sentences** for that verb.
2.  **Stage B**: Once the user starts the context practice, we immediately trigger the generation of the **Next Random Verb**.
Result: The user never sees a loading spinner after the very first launch.

### 3. iOS PWA Icon Hack
iOS does not support SVG for PWA Home Screen icons. We implemented a runtime script that draws the SVG to an HTML5 Canvas, converts it to a PNG Data URI, and dynamically updates the `<link rel="apple-touch-icon">` tag.