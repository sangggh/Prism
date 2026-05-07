export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
  description?: string;
  category?: string;
  skills?: string[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  languages?: string[]; // All languages used in the repo
  stargazers_count: number;
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: number;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  hasExperience: boolean;
  certificates: Certificate[];
  githubUsername: string;
  selectedRepos: GitHubRepo[];
}

export type ResumeHistory = ResumeData[];
