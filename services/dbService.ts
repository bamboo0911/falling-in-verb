
import { db, firebase } from '../firebaseConfig';
import { Language } from '../types';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any; // firebase.firestore.Timestamp
  lastActiveAt: any;
  totalVerbsCompleted: number;
  currentLanguage: Language;
  unlockedLanguages: Language[];
  instructionLanguage?: string;
  hasCompletedOnboarding?: boolean;
}

export interface LearningLog {
  userId: string;
  timestamp: any;
  language: Language;
  verb: string;
  duration: number; // in seconds
  totalQuestions: number;
  mistakes: number;
  accuracy: number; // 0.0 to 1.0
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  count: number;
  avgAccuracy: number;
  avgDuration: number;
}

export interface VerbStat {
  verb: string;
  count: number;
  avgAccuracy: number;
}

// Simple in-memory cache
const cache = {
  dashboardStats: {} as Record<string, any>,
  verbStats: {} as Record<string, any>,
  recentLogs: {} as Record<string, any>,
  userProfile: {} as Record<string, any>,
};

const clearCache = () => {
  cache.dashboardStats = {};
  cache.verbStats = {};
  cache.recentLogs = {};
  cache.userProfile = {};
};

export const dbService = {
  /**
   * Ensures the user profile exists in Firestore. 
   * Updates lastActiveAt if it exists.
   * RETURNS the profile data so the app can route based on it.
   */
  syncUserProfile: async (user: any, currentLanguage?: Language): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        // New User
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: firebase.firestore.Timestamp.now(),
          lastActiveAt: firebase.firestore.Timestamp.now(),
          totalVerbsCompleted: 0,
          currentLanguage: currentLanguage || 'pt', // Default fallback
          unlockedLanguages: [],
          instructionLanguage: 'English',
          hasCompletedOnboarding: false
        };
        await userRef.set(newProfile);
        return newProfile;
      } else {
        // Existing User
        const data = doc.data() as UserProfile;

        // Migration: Ensure unlockedLanguages exists and is populated if user has history
        const hasHistory = (data?.totalVerbsCompleted || 0) > 0;
        const missingUnlocked = !data?.unlockedLanguages || (data?.unlockedLanguages.length === 0 && hasHistory);

        // If currentLanguage is provided (e.g. from session), update it. Otherwise keep existing.
        const langToUpdate = currentLanguage || data.currentLanguage;

        if (missingUnlocked) {
          // Auto-unlock current language for existing users
          const unlocked = hasHistory && langToUpdate ? [langToUpdate] : [];
          await userRef.update({
            lastActiveAt: firebase.firestore.Timestamp.now(),
            currentLanguage: langToUpdate,
            unlockedLanguages: unlocked
          });
          return { ...data, lastActiveAt: firebase.firestore.Timestamp.now(), currentLanguage: langToUpdate, unlockedLanguages: unlocked };
        } else {
          await userRef.update({
            lastActiveAt: firebase.firestore.Timestamp.now(),
            ...(currentLanguage ? { currentLanguage: currentLanguage } : {})
          });
          return { ...data, lastActiveAt: firebase.firestore.Timestamp.now(), ...(currentLanguage ? { currentLanguage } : {}) };
        }
      }
    } catch (error) {
      console.error("[DB] Error syncing profile:", error);
      return null;
    }
  },

  /**
   * Updates the user's current target language.
   */
  updateUserLanguage: async (userId: string, language: Language): Promise<void> => {
    try {
      await db.collection('users').doc(userId).update({
        currentLanguage: language,
        lastActiveAt: firebase.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error("[DB] Error updating user language:", error);
    }
  },

  /**
   * Updates the user's instruction language.
   */
  updateUserInstructionLanguage: async (userId: string, language: string): Promise<void> => {
    try {
      await db.collection('users').doc(userId).update({
        instructionLanguage: language,
        lastActiveAt: firebase.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error("[DB] Error updating instruction language:", error);
    }
  },

  /**
   * Updates the onboarding status.
   */
  completeOnboarding: async (userId: string): Promise<void> => {
    try {
      await db.collection('users').doc(userId).update({
        hasCompletedOnboarding: true,
        lastActiveAt: firebase.firestore.Timestamp.now()
      });
      // Update cache
      if (cache.userProfile[userId]) {
        cache.userProfile[userId].hasCompletedOnboarding = true;
      }
    } catch (error) {
      console.error("[DB] Error completing onboarding:", error);
    }
  },

  /**
   * Logs a completed learning session and updates aggregates.
   */
  saveSession: async (
    user: any,
    language: Language,
    verb: string,
    duration: number,
    conjugationMistakes: number,
    sentenceMistakes: number,
    totalConjugationQuestions: number,
    totalSentenceQuestions: number = 5
  ) => {
    if (!user) return;

    try {
      const totalQuestions = totalConjugationQuestions + totalSentenceQuestions;
      const totalMistakes = conjugationMistakes + sentenceMistakes;
      // Ensure accuracy doesn't go below 0
      const accuracy = Math.max(0, (totalQuestions - totalMistakes) / totalQuestions);

      const log: LearningLog = {
        userId: user.uid,
        timestamp: firebase.firestore.Timestamp.now(),
        language,
        verb,
        duration,
        totalQuestions,
        mistakes: totalMistakes,
        accuracy
      };

      const batch = db.batch();

      // 1. Create Log Entry
      const logRef = db.collection('learning_logs').doc();
      batch.set(logRef, log);

      // 2. Update User Aggregates
      const userRef = db.collection('users').doc(user.uid);
      batch.update(userRef, {
        totalVerbsCompleted: firebase.firestore.FieldValue.increment(1),
        lastActiveAt: firebase.firestore.Timestamp.now(),
        unlockedLanguages: firebase.firestore.FieldValue.arrayUnion(language),
        currentLanguage: language // Keep track of last practiced
      });

      // 3. Update Verb Statistics (Subcollection) for Word Cloud
      const verbStatRef = userRef.collection('verb_stats').doc(verb);
      batch.set(verbStatRef, {
        verb,
        language,
        count: firebase.firestore.FieldValue.increment(1),
        accumulatedAccuracy: firebase.firestore.FieldValue.increment(accuracy),
        lastPracticed: firebase.firestore.Timestamp.now()
      }, { merge: true });

      await batch.commit();
      console.log(`[DB] Session saved successfully. Accuracy: ${(accuracy * 100).toFixed(1)}%`);

      // Invalidate cache on new data
      clearCache();
    } catch (error) {
      console.error("[DB] Error saving session:", error);
    }
  },

  /**
   * Fetches the full user profile
   */
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    if (cache.userProfile[userId]) {
      return cache.userProfile[userId];
    }
    try {
      const doc = await db.collection('users').doc(userId).get();
      const data = doc.exists ? (doc.data() as UserProfile) : null;
      if (data) cache.userProfile[userId] = data;
      return data;
    } catch (error) {
      console.error("[DB] Error getting user profile:", error);
      return null;
    }
  },

  /**
   * Fetches aggregated stats for the dashboard graphs.
   * STRATEGY: Client-Side Filtering
   * We only query by User + Time (simple index). We filter Language in JS.
   * This avoids "requires an index" errors for every language combination.
   */
  getDashboardStats: async (userId: string, days: number = 7, language?: Language): Promise<{ stats: DailyStat[], totalVerbs: number }> => {
    const cacheKey = `${userId}-${days}-${language || 'all'}`;
    if (cache.dashboardStats[cacheKey]) {
      return cache.dashboardStats[cacheKey];
    }
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);

      // SIMPLIFIED QUERY: Only User + Timestamp
      // No language filter here to avoid composite index requirements
      const query = db.collection('learning_logs')
        .where('userId', '==', userId)
        .where('timestamp', '>=', startDate)
        .orderBy('timestamp', 'asc');

      const logsSnap = await query.get();

      // Prepare grouping structure
      const grouped: Record<string, LearningLog[]> = {};
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Use Local Date string construction to fix timezone off-by-one errors
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;
        grouped[dateStr] = [];
      }

      logsSnap.docs.forEach(doc => {
        const data = doc.data() as LearningLog;

        // --- CLIENT-SIDE FILTERING ---
        if (language && data.language !== language) return;

        // Handle timestamp conversion safely
        const dateObj = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);

        // Use Local Date for grouping
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;

        if (grouped[dateStr]) {
          grouped[dateStr].push(data);
        }
      });

      const stats: DailyStat[] = Object.keys(grouped).sort().map(date => {
        const logs = grouped[date];
        const count = logs.length;
        const avgAccuracy = count > 0 ? logs.reduce((sum, l) => sum + l.accuracy, 0) / count : 0;
        const validDurationLogs = logs.filter(l => l.accuracy >= 0.3);
        const avgDuration = validDurationLogs.length > 0
          ? validDurationLogs.reduce((acc, curr) => acc + curr.duration, 0) / validDurationLogs.length
          : 0;

        return {
          date: date,
          count: logs.length,
          avgAccuracy,
          avgDuration
        };
      });

      let totalVerbs = 0;
      if (language) {
        // If filtered, sum from our calculated stats
        totalVerbs = stats.reduce((sum, day) => sum + day.count, 0);
      } else {
        // If "All", grab from user profile cache for speed
        const userDoc = await db.collection('users').doc(userId).get();
        totalVerbs = userDoc.exists ? (userDoc.data()?.totalVerbsCompleted || 0) : 0;
      }

      const result = { stats: stats.sort((a, b) => a.date.localeCompare(b.date)), totalVerbs };
      cache.dashboardStats[cacheKey] = result;
      return result;
    } catch (error) {
      console.error("[DB] Error fetching dashboard stats.", error);
      return { stats: [], totalVerbs: 0 };
    }
  },

  /**
   * Fetches Word Cloud Data
   * STRATEGY: Fetch all verb stats for user, filter & sort in memory.
   */
  getVerbStats: async (userId: string, language: Language): Promise<VerbStat[]> => {
    const cacheKey = `${userId}-${language || 'all'}`;
    if (cache.verbStats[cacheKey]) {
      return cache.verbStats[cacheKey];
    }
    try {
      // NOTE: This requires the 'verb_stats' subcollection to be allowed in Security Rules
      const statsRef = db.collection('users').doc(userId).collection('verb_stats');
      const snapshot = await statsRef.get();

      const allVerbs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          verb: data.verb,
          language: data.language,
          count: data.count,
          avgAccuracy: data.count > 0 ? data.accumulatedAccuracy / data.count : 0
        };
      });

      // Client-Side Filter & Sort
      const result = allVerbs
        .filter(v => v.language === language)
        .sort((a, b) => b.count - a.count)
        .slice(0, 50); // Top 50 verbs
      cache.verbStats[cacheKey] = result;
      return result;
    } catch (error) {
      console.error("[DB] Error fetching verb stats. Check Security Rules for subcollection.", error);
      return [];
    }
  },

  /**
   * Fetches Recent Activity
   * STRATEGY: Client-Side Filtering
   */
  getRecentLogs: async (userId: string, language?: Language): Promise<LearningLog[]> => {
    const cacheKey = `${userId}-${language || 'all'}`;
    if (cache.recentLogs[cacheKey]) {
      return cache.recentLogs[cacheKey];
    }
    try {
      // Fetch more (100) to ensure we have enough after filtering
      const query = db.collection('learning_logs')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(100);

      const snapshot = await query.get();
      const allLogs = snapshot.docs.map(doc => doc.data() as LearningLog);

      // Client-Side Filter
      const filteredLogs = allLogs.filter(l => !language || l.language === language);
      const result = filteredLogs.slice(0, 20);
      cache.recentLogs[cacheKey] = result;
      return result;
    } catch (error) {
      console.error("[DB] Error fetching recent logs.", error);
      return [];
    }
  }
};
