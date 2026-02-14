
export type PageView = 'home' | 'members' | 'works' | 'activity' | 'award' | 'contact' | 'admin';

export interface SiteConfig {
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHeroDescription: string;
  homeHeroImageUrl: string; // Used as fallback or specific hero image if needed
  homeGridImages: string[]; // New: Array of images for the dense grid background
  homeManifestoTitle?: string; // New: Editable title for the Manifesto section (default: Conspire)
  homeManifestoImageUrl?: string; // New: Image for the Manifesto section (Sketch)
  aboutDefinition: string;
  contactRecruitText: string;
  contactCollabText: string;
  // New Contact Details
  contactAddress?: string;
  contactEmail?: string;
  contactInstagram?: string;
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

export interface AwardItem {
  id: string;
  title: string;
  type: 'Award' | 'Publication' | 'Exhibition';
  year: string;
  description: string;
}