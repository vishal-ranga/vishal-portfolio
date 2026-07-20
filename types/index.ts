export interface Project {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  timeframe: string;
  GitHubUrl: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  overview: string;
  problem: string;
  solution: string;
  architecture: string;
  architectureSteps: string[];
  deploymentFlow: string[];
  decisions: { title: string; detail: string }[];
  challenges: { title: string; detail: string }[];
  lessons: string[];
  futureImprovements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  verifyUrl: string;
}

export interface ExperienceItem {
  type: "work" | "education";
  title: string;
  org: string;
  location: string;
  period: string;
  points: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}
