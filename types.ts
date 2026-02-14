
export type PageView = 'home' | 'members' | 'works' | 'award' | 'contact' | 'admin';

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
  category: 'Academic' | 'Competition' | 'Personal' | 'Team' | 'Study';
  year: string;
  author: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  role: 'OB' | 'YB'; // Changed from Leadership/Member/Alumni
  // cohort removed
  philosophy: string;
  imageUrl?: string;
  order: number; // For manual ordering
}

// ActivityLog interface removed

export interface AwardItem {
  id: string;
  title: string;
  type: 'Award' | 'Publication' | 'Exhibition';
  year: string;
  description: string;
}