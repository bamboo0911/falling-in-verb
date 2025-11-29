import { db, firebase } from '../firebaseConfig';
import { Language } from '../types';

const MOCK_VERBS: Record<string, string[]> = {
  pt: ['falar', 'comer', 'ir', 'ser', 'estar', 'ter', 'fazer', 'poder', 'ver', 'dar'],
  es: ['hablar', 'comer', 'ir', 'ser', 'estar', 'tener', 'hacer', 'poder', 'ver', 'dar'],
  fr: ['parler', 'manger', 'aller', 'être', 'avoir', 'faire', 'pouvoir', 'voir', 'donner', 'vouloir'],
  jp: ['食べる', '飲む', '行く', '見る', 'する', '来る', '寝る', '買う', '話す', '聞く']
};

export const seedMockData = async (userId: string, language: Language) => {
  const batch = db.batch();
  const verbs = MOCK_VERBS[language] || MOCK_VERBS.pt;
  const now = new Date();
  
  let totalAdded = 0;
  // Aggregate stats in memory first to minimize writes and conflicts in batch
  const verbAggregates: Record<string, { count: number, accAccuracy: number, lastTime: any }> = {};

  // Generate 50 random sessions
  for (let i = 0; i < 50; i++) {
    // Random date in last 30 days
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    // Random time
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    const timestamp = firebase.firestore.Timestamp.fromDate(date);
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const duration = Math.floor(Math.random() * 60) + 10; // 10-70s
    
    // Bias towards success but include failures
    const accuracy = Math.random() > 0.2 ? 0.7 + (Math.random() * 0.3) : Math.random() * 0.6;
    
    const totalQuestions = 20; 
    const mistakes = Math.floor((1 - accuracy) * totalQuestions);

    // 1. Create Log
    const logRef = db.collection('learning_logs').doc();
    batch.set(logRef, {
      userId,
      timestamp,
      language,
      verb,
      duration,
      totalQuestions,
      mistakes,
      accuracy
    });

    totalAdded++;
    
    if (!verbAggregates[verb]) {
      verbAggregates[verb] = { count: 0, accAccuracy: 0, lastTime: timestamp };
    }
    const v = verbAggregates[verb];
    v.count++;
    v.accAccuracy += accuracy;
    if (timestamp > v.lastTime) v.lastTime = timestamp;
  }

  // 2. Update User Profile (Atomic Increment)
  const userRef = db.collection('users').doc(userId);
  batch.update(userRef, {
    totalVerbsCompleted: firebase.firestore.FieldValue.increment(totalAdded),
    lastActiveAt: firebase.firestore.Timestamp.now(),
    unlockedLanguages: firebase.firestore.FieldValue.arrayUnion(language)
  });

  // 3. Update Verb Stats (Atomic Increments)
  Object.keys(verbAggregates).forEach(verb => {
    const data = verbAggregates[verb];
    const ref = userRef.collection('verb_stats').doc(verb);
    batch.set(ref, {
      verb,
      language,
      count: firebase.firestore.FieldValue.increment(data.count),
      accumulatedAccuracy: firebase.firestore.FieldValue.increment(data.accAccuracy),
      lastPracticed: data.lastTime
    }, { merge: true });
  });

  await batch.commit();
};