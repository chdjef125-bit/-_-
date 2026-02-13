import { Project, Member, ActivityLog, ArchiveItem, SiteConfig } from '../types';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
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
  console.warn("⚠️ Firebase is NOT configured. Running in LocalStorage (Static) mode.");
}

// --- INITIAL MOCK DATA (Fallback) ---
const INITIAL_PROJECTS: Project[] = [];
const INITIAL_MEMBERS: Member[] = [];
const INITIAL_ARCHIVE: ArchiveItem[] = [];
const INITIAL_ACTIVITIES: ActivityLog[] = [];

const INITIAL_SITE_CONFIG: SiteConfig = {
  homeHeroTitle: "We don't just design.",
  homeHeroSubtitle: "We Conspire.",
  homeHeroDescription: "건축을 작당합니다. 끊임없이 발전을 모의하는 설계집단, 작당입니다.",
  homeHeroImageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=2070&auto=format&fit=crop", 
  homeGridImages: [
    "https://images.unsplash.com/photo-1517581177697-a533188a2072?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517581177697-a533188a2072?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500&auto=format&fit=crop",
  ],
  homeManifestoTitle: "Conspire",
  homeManifestoImageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format&fit=crop", // Pencil Sketch
  aboutDefinition: "We redefine 'Conspiracy' (작당/Jakdang). It is not a plot for harm, but a plot for creation. It is a collective effort to disturb the stagnant waters of conventional student architecture.",
  contactRecruitText: "We recruit new conspirators every March and September. Check our Instagram for the secret code.",
  contactCollabText: "Open for exhibitions, joint studios, and freelance design commissions.",
  contactAddress: "123 Design District, Busan\nSouth Korea 48000",
  contactEmail: "hello@jakdang.com",
  contactInstagram: "instagram.com/jakdang_studio"
};

// LocalStorage Keys (Fallback)
// Updated to '_v3' to force clear cache/members
const KEYS = {
  PROJECTS: 'jakdang_projects_v3',
  MEMBERS: 'jakdang_members_v3',
  ARCHIVE: 'jakdang_archive_v3',
  ACTIVITIES: 'jakdang_activities_v3',
  SITE_CONFIG: 'jakdang_config_v3'
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
         const docRef = doc(db, 'settings', 'siteConfig');
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            // For config, merge with initial to ensure new fields exist even if DB is old
            return { ...initial, ...docSnap.data() } as T;
         }
         return initial;
      } else {
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
    return new Promise(resolve => setTimeout(() => resolve(loadLocal(localKey, initial)), 100));
  }
};

// Generic Saver
const saveData = async (collectionName: string, localKey: string, data: any) => {
  saveLocal(localKey, data);

  if (isFirebaseConfigured && db) {
    try {
      if (collectionName === 'config') {
        await setDoc(doc(db, 'settings', 'siteConfig'), data);
      } else {
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
    await saveData('config', KEYS.SITE_CONFIG, loadLocal(KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG));
    
    return true;
  }
};