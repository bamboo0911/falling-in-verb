# Falling In Verb 🌸

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=flat&logo=firebase)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=google%20gemini&logoColor=white)

**Falling In Verb** is an intelligent, AI-powered Progressive Web App (PWA) engineered to facilitate the mastery of verb conjugations in **Portuguese (Brazil)**, **Spanish (Latin America)**, **Japanese**, and **French**.

By leveraging **Generative AI (Google Gemini)**, the application moves beyond static flashcards to generate infinite, context-aware exercises. This ensures a dynamic learning experience where no two sessions are identical. The platform features a sophisticated "Double Prefetching" pipeline for zero-latency interactions and a user-centric database architecture designed to visualize long-term learning trends.

---

## ✨ Key Features

### 🧠 AI-Driven Learning
-   **Infinite Content Generation**: Utilizes Gemini 2.5 Flash to create real-time verbs and fill-in-the-blank sentence challenges.
-   **Contextual Intelligence**: Generates sentences that reflect natural, daily usage in the target language.

### 🌍 Multi-Language Support
| Language | Focus | Key Characteristics |
| :--- | :--- | :--- |
| **Portuguese** 🇧🇷 | Brazilian Daily Usage | Focus on spoken registers and common idioms. |
| **Spanish** 🇪🇸 | Latin American | Merged 3rd person pronouns for streamlined practice. |
| **Japanese** 🇯🇵 | Structural Mastery | 6-column layout covering Plain/Polite forms across Tense/Polarity. |
| **French** 🇫🇷 | Standard Grammar | rigorous handling of *Passé Composé* and elisions. |

### 📊 Data-Driven Insights
-   **Visual Analytics**: Interactive SVG charts tracking Accuracy, Daily Volume, and Speed.
-   **Long-term Retention**: Firestore-backed logging to visualize progress over 3, 7, or 30-day windows.

### ⚡ Performance Engineering
-   **Zero-Latency Pipeline**: Implements a **Double Prefetching Strategy** that prepares the next learning cycle in the background, eliminating wait times.
-   **Optimized PWA**: Native-like experience with touch-optimized interfaces, offline shell support, and dynamic iOS icon generation.

---

## 🛠 Technology Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS (Custom "Airy Rose" Design System)
-   **AI Core**: Google Gemini API (`gemini-2.5-flash`)
-   **Backend**: Firebase Authentication & Firestore (NoSQL)
    -   *Architecture*: **No-Build Strategy** utilizing Firebase Compat SDK via Gstatic CDN for maximum stability in ESM environments.
-   **Infrastructure**: Single Page Application (SPA) optimized for edge delivery.

---

## 🏗 Architecture Overview

The application follows a unidirectional data flow, orchestrated by a central State Machine (`AppPhase`).

```mermaid
graph TD
    User[User / Client] -->|Auth & Data| Firebase[Firebase (Auth + Firestore)]
    User -->|Interaction| App[React App]
    
    subgraph "Core Logic"
        App -->|State Control| PhaseController[AppPhase Controller]
        App -->|Optimization| Prefetcher[Double Prefetching Pipeline]
        App -->|Analytics| Dashboard[SVG Chart Engine]
    end
    
    subgraph "AI Services"
        Prefetcher -->|Verb Generation| GeminiVerb[Gemini: Verb Schema]
        Prefetcher -->|Context Generation| GeminiSent[Gemini: Sentence Schema]
    end
    
    subgraph "Persistence Layer"
        App -->|Session Logs| DB_Logs[Collection: learning_logs]
        App -->|User Profile| DB_Users[Collection: users]
    end
```

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Google Gemini API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/falling-in-verb.git
    cd falling-in-verb
    ```

2.  **Configure Environment**:
    Create a `.env.local` file in the root directory:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```
    *Note: Firebase configuration is public and handled client-side.*

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Launch Development Server**:
    ```bash
    npm run dev
    ```

---

## 💡 Technical Highlights

### The "No-Build" Firebase Strategy
To resolve compatibility issues between modern ES Modules and CDN-hosted scripts without complex bundler configurations, we employ a **Gstatic Loading Strategy**. This ensures 100% reliability for Auth and Firestore across all browsing environments by leveraging the global singleton provided by Google's CDN.

### Double Prefetching Pipeline
To mitigate LLM latency (typically 3-5 seconds), the application employs a two-stage prefetch:
1.  **Stage A**: Triggers context sentence generation immediately upon verb load.
2.  **Stage B**: Triggers the next verb generation immediately upon starting the current exercise.
**Result**: A seamless, zero-wait user experience.

---

## ⚠️ Troubleshooting

**Dashboard Charts Not Loading?**
Check the Browser Console (F12).
-   **"Missing permissions"**: Update Firestore Security Rules with the provided `firestore.rules`.
-   **"Query requires an index"**: Click the link in the console error to automatically generate the required Composite Index in the Firebase Console.