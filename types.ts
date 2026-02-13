export type PageView = 'home' | 'members' | 'works' | 'activity' | 'archive' | 'contact' | 'admin';

export interface SiteConfig {
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHeroDescription: string;
  homeHeroImageUrl: string; // Used as fallback or specific hero image if needed
  homeGridImages: string[]; // New: Array of images for the dense grid background
  aboutDefinition: string;
  aboutDescription: string;
  contactRecruitText: string;
  contactCollabText: string;
  // Process Section Images
  processResearchImageUrl: string;
  processNarrativeImageUrl: string;
  processMassingImageUrl: string;
  processOutputImageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Academic' | 'Competition' | 'Personal' | 'Team';
  year: string;
  author: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  role: 'Leadership' | 'Member' | 'Alumni';
  cohort: string; // 기수
  philosophy: string;
  imageUrl?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  date: string; // e.g., "2024.03"
  type: 'Workshop' | 'Exhibition' | 'MT' | 'Study' | 'Field Trip';
  description: string;
  imageUrl?: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  type: 'Award' | 'Publication' | 'Exhibition';
  year: string;
  description: string;
  link?: string;
}