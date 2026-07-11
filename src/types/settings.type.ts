export interface ISettings {
  id: string;
  siteTitle?: string | null;
  tagline?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  resumeLink?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  whatsappNumber?: string | null;
  address?: string | null;
  availability?: string | null;
  experience?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  latestNewsCount?: number;
  createdAt: string;
  updatedAt: string;
}
