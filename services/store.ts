import { Project, Member, ActivityLog, AwardItem, SiteConfig } from '../types';
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

// Helper to generate member objects (No Images)
const createMember = (name: string, role: 'OB' | 'YB', index: number): Member => ({
  id: `mem_${role.toLowerCase()}_${index}`,
  name,
  role,
  philosophy: '',
  imageUrl: undefined, // No images as requested
  order: index
});

const obNames = [
  "Jang Youngjun", "Jo Myeonghun", "Lee Taeryong", "Seol Yunhwan", "Kwak Seongman", "Kim Seongwoo", "Seo Deokjun", 
  "Jang Byeongdae", "Lee Wonbin", "Choi Inhyeok", "Kim Daeuk", "Kim Seungjun", "Park Sangjin", "Jeong Yeowon"
];

const ybNames = [
  "Kim Dongjun", "Baek Eunseo", "Yang Gyumin", "Kim Seoyoung", "Kim Hyunmin", "Geum Dongseok", "Ryu Hyeju", 
  "Choi Minwoo", "Park Yena", "Park Jeong-a", "Bae Donggyun", "Bae Junseo", "Baek Jinuk", "Kim Bomin", 
  "Son Hyeokjin", "Shin Jinsu", "Bae Yunju", "Jeong Yunchae", "Lee Seungmin", "Lee Wonseo", "Lee Juhyeong", 
  "Lee Hyerin", "Jeon Yuna", "Jeong Minjae", "Jeong Hyerin", "Jo Yejin", "Jo Jaehee", "Kwak Chaeyun", 
  "Hwang Jiseung", "Kim Gyeongwon", "Park Hogeun", "Choi Jiseong"
];

const INITIAL_MEMBERS: Member[] = [
  ...obNames.map((name, i) => createMember(name, 'OB', i)),
  ...ybNames.map((name, i) => createMember(name, 'YB', i + 100))
];

const INITIAL_ACTIVITIES: ActivityLog[] = [];

const INITIAL_AWARDS: AwardItem[] = [
  // 2024
  { id: 'arc_2024_1', year: '2024', type: 'Award', title: '한국건축문화대전', description: '우수상' },
  { id: 'arc_2024_2', year: '2024', type: 'Award', title: '경북건축대전', description: '우수상' },
  { id: 'arc_2024_3', year: '2024', type: 'Award', title: '경남건축대전', description: '은상' },
  { id: 'arc_2024_4', year: '2024', type: 'Award', title: '부산국제건축문화제', description: '특선' },
  { id: 'arc_2024_5', year: '2024', type: 'Award', title: '도코모모', description: '장려상' },
  { id: 'arc_2024_6', year: '2024', type: 'Award', title: 'KT&G 파빌리온', description: '장려' },
  { id: 'arc_2024_7', year: '2024', type: 'Award', title: '울산건축대전', description: '입선' },

  // 2023
  { id: 'arc_2023_1', year: '2023', type: 'Award', title: '근대도시건축디자인공모전', description: '최우수상' },
  { id: 'arc_2023_2', year: '2023', type: 'Award', title: 'KT&G 상상 블루 파빌리온', description: '우수상' },
  { id: 'arc_2023_3', year: '2023', type: 'Award', title: '제27회 LH 주택 건축대전', description: '장려상' },
  { id: 'arc_2023_4', year: '2023', type: 'Award', title: '한국공간디자인', description: '특선' },
  { id: 'arc_2023_5', year: '2023', type: 'Award', title: '부산국제건축대전', description: '입선' },

  // 2022
  { id: 'arc_2022_1', year: '2022', type: 'Award', title: '한국건축문화대상', description: '최우수상' },
  { id: 'arc_2022_2', year: '2022', type: 'Award', title: '경기건축대전', description: '금상' },
  { id: 'arc_2022_3', year: '2022', type: 'Award', title: '경기도건축문화상', description: '특별상' },
  { id: 'arc_2022_4', year: '2022', type: 'Award', title: '대구 경부선 철도부지 아이디어 공모전', description: '장려상' },
  { id: 'arc_2022_5', year: '2022', type: 'Award', title: '부산국제건축대전', description: '장려상' },
  { id: 'arc_2022_6', year: '2022', type: 'Award', title: '부산국제도시사진전', description: 'Honorable Mention' },
  { id: 'arc_2022_7', year: '2022', type: 'Award', title: '부산국제건축대전', description: '특선' },
  { id: 'arc_2022_8', year: '2022', type: 'Award', title: '대한민국목조건축대전', description: '입선' },
  { id: 'arc_2022_9', year: '2022', type: 'Award', title: '근대도시건축디자인공모전', description: '입선' },
  { id: 'arc_2022_10', year: '2022', type: 'Award', title: '경기건축대전', description: '입선' },
  { id: 'arc_2022_11', year: '2022', type: 'Award', title: '경기도건축문화상', description: '입선' },

  // 2021
  { id: 'arc_2021_1', year: '2021', type: 'Award', title: '근대도시건축디자인공모전', description: '대상' },
  { id: 'arc_2021_2', year: '2021', type: 'Award', title: '부산국제건축디자인워크샵', description: '대상' },
  { id: 'arc_2021_3', year: '2021', type: 'Award', title: '부산국제건축대전', description: '최우수상' },
  { id: 'arc_2021_4', year: '2021', type: 'Award', title: '화성시 동탄도서관 현상설계', description: '2등' },
  { id: 'arc_2021_5', year: '2021', type: 'Award', title: '롯데자이언츠 사직구장 직원오피스 현상설계', description: '2등' },
  { id: 'arc_2021_6', year: '2021', type: 'Award', title: '부산국제건축대전', description: '장려상' },
  { id: 'arc_2021_7', year: '2021', type: 'Award', title: 'Tomorrow busan 메가시티 아이디어 공모전', description: '장려상' },
  { id: 'arc_2021_8', year: '2021', type: 'Award', title: '한국리모델링건축대전', description: '가작' },
  { id: 'arc_2021_9', year: '2021', type: 'Award', title: '계룡장학재단 건축부문', description: '입선' },
  { id: 'arc_2021_10', year: '2021', type: 'Award', title: '한국농촌건축대전', description: '입선' },
  { id: 'arc_2021_11', year: '2021', type: 'Award', title: '차세대 문화공간 공모전', description: '입선' },
  { id: 'arc_2021_12', year: '2021', type: 'Award', title: '통합놀이터 공모전', description: '입선' },

  // 2020
  { id: 'arc_2020_1', year: '2020', type: 'Award', title: '한국건축문화대상', description: '최우수상' },
  { id: 'arc_2020_2', year: '2020', type: 'Award', title: 'BCOME_지역공동체형 주거모델제안 국제공모전', description: '3등' },
  { id: 'arc_2020_3', year: '2020', type: 'Award', title: '경기건축대전', description: '특선' },
  { id: 'arc_2020_4', year: '2020', type: 'Award', title: '남북교류와 미래국토비전 작품공모전', description: '입선' },
  { id: 'arc_2020_5', year: '2020', type: 'Award', title: '부산국제건축대전', description: '입선' },
  { id: 'arc_2020_6', year: '2020', type: 'Award', title: '시흥건축문화대상', description: '입선' },

  // 2019
  { id: 'arc_2019_1', year: '2019', type: 'Award', title: '충남 3.1운동 백년의집 다목적홀 공모전', description: '최우수상' },
  { id: 'arc_2019_2', year: '2019', type: 'Award', title: 'SH 대학생 VE경진대회', description: '장려상' },
  { id: 'arc_2019_3', year: '2019', type: 'Award', title: '울산건축대전 시니어', description: '입선' },

  // 2017
  { id: 'arc_2017_1', year: '2017', type: 'Award', title: 'KT&G 부산 도시재생 공모전', description: '장려상' },
];

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
// Updated to '_v7' to force clear cache/members due to structure change
const KEYS = {
  PROJECTS: 'jakdang_projects_v7',
  MEMBERS: 'jakdang_members_v7',
  AWARDS: 'jakdang_awards_v7',
  ACTIVITIES: 'jakdang_activities_v7',
  SITE_CONFIG: 'jakdang_config_v7'
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
  
  // Custom getMembers to check for stale schema
  getMembers: async () => {
    const members = await fetchData<Member[]>('members', KEYS.MEMBERS, INITIAL_MEMBERS);
    // Safety Check: If DB returns data with old schema (e.g. 'Leadership' or 'Member' roles), fallback to INITIAL_MEMBERS
    // This fixes the issue where an old DB state prevents the new OB/YB list from showing.
    const hasStaleRoles = members.some((m: any) => m.role === 'Leadership' || m.role === 'Member' || m.role === 'Alumni');
    
    if (hasStaleRoles) {
      console.warn("Detected stale member data from DB. Falling back to Initial List.");
      return INITIAL_MEMBERS;
    }
    
    return members;
  },
  
  saveMembers: (data: Member[]) => saveData('members', KEYS.MEMBERS, data),
  
  getAwards: () => fetchData<AwardItem[]>('awards', KEYS.AWARDS, INITIAL_AWARDS),
  saveAwards: (data: AwardItem[]) => saveData('awards', KEYS.AWARDS, data),

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
    await saveData('awards', KEYS.AWARDS, loadLocal(KEYS.AWARDS, INITIAL_AWARDS));
    await saveData('activities', KEYS.ACTIVITIES, loadLocal(KEYS.ACTIVITIES, INITIAL_ACTIVITIES));
    await saveData('config', KEYS.SITE_CONFIG, loadLocal(KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG));
    
    return true;
  }
};