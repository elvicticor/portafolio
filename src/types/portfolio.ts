export type ProjectCategory = "frontend" | "backend" | "fullstack";

export interface TimelineItem {
  period: string;
  title: string;
  text: string;
}

export interface FeaturedProject {
  repo: string;
  title: string;
  summary: string;
  highlights: string[];
  tech: string[];
  image?: string;
  demo?: string;
  category: ProjectCategory;
}

export interface PortfolioConfig {
  githubUser: string;
  name: string;
  role: string;
  tagline: string;
  location?: string;
  email: string;
  phone?: string;
  cv: string;
  photo?: string;
  linkedin?: string;
  available: boolean;
  availabilityLabel?: string;
  about: string[];
  skills: Record<string, string[]>;
  dataPipeline: Array<{ label: string; detail: string }>;
  softSkills: string[];
  languages: string[];
  experience: TimelineItem[];
  education: TimelineItem[];
  featured: FeaturedProject[];
  otherDescriptions: Record<string, string>;
  hidden: string[];
}

export interface GithubRepository {
  name: string;
  html_url?: string;
  description?: string | null;
  language?: string | null;
  languages_url?: string;
  languages: Record<string, number>;
  pushed_at: string;
  stargazers_count: number;
  fork?: boolean;
}
