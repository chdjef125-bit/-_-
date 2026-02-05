import { Project, Member, ActivityLog, ArchiveItem, ProcessStep, SiteConfig } from '../types';

// Initial Mock Data
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
  homeHeroImageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop", // Default sketch-style placeholder
  aboutDefinition: "We redefine 'Conspiracy' (작당/Jakdang). It is not a plot for harm, but a plot for creation. It is a collective effort to disturb the stagnant waters of conventional student architecture.",
  aboutDescription: "We operate as a semi-professional studio. Hierarchy exists only in experience, not in speech. Critique is sharp, but intended to sculpt better ideas.",
  contactRecruitText: "We recruit new conspirators every March and September. Check our Instagram for the secret code.",
  contactCollabText: "Open for exhibitions, joint studios, and freelance design commissions."
};

// LocalStorage Keys
const KEYS = {
  PROJECTS: 'jakdang_projects',
  MEMBERS: 'jakdang_members',
  ARCHIVE: 'jakdang_archive',
  ACTIVITIES: 'jakdang_activities',
  PROCESS: 'jakdang_process',
  SITE_CONFIG: 'jakdang_config'
};

// Helper to load or initialize
const loadData = <T,>(key: string, initial: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Storage error", e);
    return initial;
  }
};

export const DataService = {
  getProjects: (): Project[] => loadData(KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (data: Project[]) => localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data)),
  
  getMembers: (): Member[] => loadData(KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMembers: (data: Member[]) => localStorage.setItem(KEYS.MEMBERS, JSON.stringify(data)),
  
  getArchive: (): ArchiveItem[] => loadData(KEYS.ARCHIVE, INITIAL_ARCHIVE),
  saveArchive: (data: ArchiveItem[]) => localStorage.setItem(KEYS.ARCHIVE, JSON.stringify(data)),

  getActivities: (): ActivityLog[] => loadData(KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (data: ActivityLog[]) => localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(data)),

  getProcess: (): ProcessStep[] => loadData(KEYS.PROCESS, INITIAL_PROCESS),
  saveProcess: (data: ProcessStep[]) => localStorage.setItem(KEYS.PROCESS, JSON.stringify(data)),

  getSiteConfig: (): SiteConfig => loadData(KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG),
  saveSiteConfig: (data: SiteConfig) => localStorage.setItem(KEYS.SITE_CONFIG, JSON.stringify(data)),
  
  // Utility for ID generation
  generateId: () => Math.random().toString(36).substr(2, 9),
};