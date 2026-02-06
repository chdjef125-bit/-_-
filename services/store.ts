import { Project, Member, ActivityLog, ArchiveItem, ProcessStep, SiteConfig } from '../types';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
// TODO: [USER ACTION REQUIRED]
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project.
// 3. Register a web app (</> icon) and copy the SDK setup config.
// 4. Paste the config values below.
// 5. In Firebase Console > Build > Firestore Database > Create Database.
// 6. Set Rules to "Start in test mode" (or allow read/write for development).

const firebaseConfig = {
  apiKey: "AIzaSyBW9qe9dvj4KDCkFzCHQRnV2TFiQt7KDWQ",
  authDomain: "jktest2-66e34.firebaseapp.com",
  projectId: "jktest2-66e34",
  storageBucket: "jktest2-66e34.firebasestorage.app",
  messagingSenderId: "494122010904",
  appId: "1:494122010904:web:4f1034b29bb08ef94d766d",
  measurementId: "G-C3P3PHVST4"
};

// --- INITIALIZATION ---
let db: any = null;
const isFirebaseConfigured = firebaseConfig.apiKey.length > 0;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully.");
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("⚠️ Firebase is NOT configured. Running in LocalStorage (Static) mode. Edit services/store.ts to enable dynamic features.");
}

// --- INITIAL MOCK DATA (Fallback) ---
const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Void in Silence',
    category: 'Competition',
    year: '2023',
    author: 'Kim Min-jun',
    description: 'A contemplative space designed for the busy urban environment, focusing on negative space and auditory exclusion.',
    imageUrl: 'https://picsum.photos/800/600',
    tags: ['Urban', 'Silence', 'Void']
  },
  {
    id: '2',
    title: 'Vertical Alley',
    category: 'Academic',
    year: '2024',
    author: 'Lee So-yeon',
    description: 'Reinterpreting the traditional Korean alleyway into a vertical skyscraper context.',
    imageUrl: 'https://picsum.photos/800/601',
    tags: ['Housing', 'Culture', 'Vertical']
  },
  {
    id: '3',
    title: 'Museum of Shadows',
    category: 'Team',
    year: '2022',
    author: 'Team Alpha',
    description: 'Light is the protagonist, but shadow is the narrator. An exhibition space defined by darkness.',
    imageUrl: 'https://picsum.photos/800/602',
    tags: ['Museum', 'Light', 'Shadow']
  }
];

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Park Ji-sung', role: 'Leadership', cohort: '12th', philosophy: 'Design is editing constraints.', imageUrl: 'https://picsum.photos/200/200' },
  { id: '2', name: 'Choi Yu-jin', role: 'Leadership', cohort: '12th', philosophy: 'Form follows fiction.', imageUrl: 'https://picsum.photos/200/201' },
  { id: '3', name: 'Kang Tae-oh', role: 'Member', cohort: '13th', philosophy: 'Architecture is frozen music.', imageUrl: 'https://picsum.photos/200/202' },
  { id: '4', name: 'Alumni Senior', role: 'Alumni', cohort: '5th', philosophy: 'Now working at OMA.', imageUrl: 'https://picsum.photos/200/203' },
];

const INITIAL_ARCHIVE: ArchiveItem[] = [
  { id: '1', title: 'UAUS Exhibition Best Pavilion', type: 'Award', year: '2023', description: 'Awarded for the "Floating Brick" installation.' },
  { id: '2', title: 'Space Magazine Feature', type: 'Publication', year: '2022', description: 'Student work featured in monthly issue.' },
];

const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: '1', title: 'Spring Membership Training', date: '2024.03', type: 'MT', description: 'Building teamwork through survival games and architectural quizzes in the mountains.', imageUrl: 'https://picsum.photos/600/300' },
  { id: '2', title: 'Naoshima Architecture Tour', date: '2023.11', type: 'Field Trip', description: 'Exploring the works of Tadao Ando. Analyzing light, concrete, and nature.', imageUrl: 'https://picsum.photos/601/300' }
];

const INITIAL_PROCESS: ProcessStep[] = [
  { id: '1', stepNumber: '01', title: 'Site Reading', description: 'We do not just look at the site. We read its history, its invisible lines, and its potential narratives.' },
  { id: '2', stepNumber: '02', title: 'Concept Diagramming', description: 'Translating abstract thoughts into concrete visual logic. Every line must have a reason.' },
  { id: '3', stepNumber: '03', title: 'Mass Study & Critique', description: 'Physical models are mandatory. We destroy and rebuild until the proportions speak.' },
  { id: '4', stepNumber: '04', title: 'Final Documentation', description: 'The project is not done until it is archived. We produce professional-grade panels and books.' }
];

const INITIAL_SITE_CONFIG: SiteConfig = {
  homeHeroTitle: "We don't just design.",
  homeHeroSubtitle: "We Conspire.",
  homeHeroDescription: "건축을 작당합니다. 끊임없이 발전을 모의하는 설계집단, 작당입니다.",
  homeHeroImageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=2070&auto=format&fit=crop", 
  aboutDefinition: "We redefine 'Conspiracy' (작당/Jakdang). It is not a plot for harm, but a plot for creation. It is a collective effort to disturb the stagnant waters of conventional student architecture.",
  aboutDescription: "We operate as a semi-professional studio. Hierarchy exists only in experience, not in speech. Critique is sharp, but intended to sculpt better ideas.",
  contactRecruitText: "We recruit new conspirators every March and September. Check our Instagram for the secret code.",
  contactCollabText: "Open for exhibitions, joint studios, and freelance design commissions."
};

// LocalStorage Keys (Fallback)
const KEYS = {
  PROJECTS: 'jakdang_projects',
  MEMBERS: 'jakdang_members',
  ARCHIVE: 'jakdang_archive',
  ACTIVITIES: 'jakdang_activities',
  PROCESS: 'jakdang_process',
  SITE_CONFIG: 'jakdang_config'
};

// --- DATA SERVICE (ASYNC) ---

const loadLocal = <T,>(key: string, initial: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return initial;
    return JSON.parse(stored);
  } catch (e) {
    return initial;
  }
};

const saveLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generic Fetcher
const fetchData = async <T>(collectionName: string, localKey: string, initial: T): Promise<T> => {
  if (isFirebaseConfigured && db) {
    try {
      if (collectionName === 'config') {
         // Config is a single document
         const docRef = doc(db, 'settings', 'siteConfig');
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) return docSnap.data() as T;
         return initial;
      } else {
         // Arrays are collections
         const querySnapshot = await getDocs(collection(db, collectionName));
         const data: any[] = [];
         querySnapshot.forEach((doc) => {
           data.push(doc.data());
         });
         return data.length > 0 ? (data as unknown as T) : initial;
      }
    } catch (e) {
      console.error(`Error fetching ${collectionName}:`, e);
      return loadLocal(localKey, initial);
    }
  } else {
    // Artificial delay for local storage to simulate async
    return new Promise(resolve => setTimeout(() => resolve(loadLocal(localKey, initial)), 100));
  }
};

// Generic Saver
const saveData = async (collectionName: string, localKey: string, data: any) => {
  // Always save to local for cache/backup
  saveLocal(localKey, data);

  if (isFirebaseConfigured && db) {
    try {
      if (collectionName === 'config') {
        // Save Config Object
        await setDoc(doc(db, 'settings', 'siteConfig'), data);
      } else {
        // Save Collection: Strategy -> Loop and SetDoc by ID
        // Note: In a real app, you might want to handle deletions better. 
        // Here we just upsert everything.
        const items = Array.isArray(data) ? data : [];
        const batchPromises = items.map(item => {
           if(item.id) {
             return setDoc(doc(db, collectionName, item.id), item);
           }
           return Promise.resolve();
        });
        await Promise.all(batchPromises);
      }
      console.log(`Saved ${collectionName} to Cloud.`);
    } catch (e) {
      console.error(`Error saving ${collectionName}:`, e);
      throw e;
    }
  }
};

export const DataService = {
  isConfigured: isFirebaseConfigured,

  getProjects: () => fetchData<Project[]>('projects', KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (data: Project[]) => saveData('projects', KEYS.PROJECTS, data),
  
  getMembers: () => fetchData<Member[]>('members', KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMembers: (data: Member[]) => saveData('members', KEYS.MEMBERS, data),
  
  getArchive: () => fetchData<ArchiveItem[]>('archive', KEYS.ARCHIVE, INITIAL_ARCHIVE),
  saveArchive: (data: ArchiveItem[]) => saveData('archive', KEYS.ARCHIVE, data),

  getActivities: () => fetchData<ActivityLog[]>('activities', KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (data: ActivityLog[]) => saveData('activities', KEYS.ACTIVITIES, data),

  getProcess: () => fetchData<ProcessStep[]>('process', KEYS.PROCESS, INITIAL_PROCESS),
  saveProcess: (data: ProcessStep[]) => saveData('process', KEYS.PROCESS, data),

  getSiteConfig: () => fetchData<SiteConfig>('config', KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG),
  saveSiteConfig: (data: SiteConfig) => saveData('config', KEYS.SITE_CONFIG, data),
  
  // Utility for ID generation
  generateId: () => Math.random().toString(36).substr(2, 9),

  // Migration Tool
  migrateToCloud: async () => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    
    await saveData('projects', KEYS.PROJECTS, loadLocal(KEYS.PROJECTS, INITIAL_PROJECTS));
    await saveData('members', KEYS.MEMBERS, loadLocal(KEYS.MEMBERS, INITIAL_MEMBERS));
    await saveData('archive', KEYS.ARCHIVE, loadLocal(KEYS.ARCHIVE, INITIAL_ARCHIVE));
    await saveData('activities', KEYS.ACTIVITIES, loadLocal(KEYS.ACTIVITIES, INITIAL_ACTIVITIES));
    await saveData('process', KEYS.PROCESS, loadLocal(KEYS.PROCESS, INITIAL_PROCESS));
    await saveData('config', KEYS.SITE_CONFIG, loadLocal(KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG));
    
    return true;
  }
};