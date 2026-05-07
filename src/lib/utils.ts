import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  if (!dateString) return "";
  if (dateString.toLowerCase() === "present") return "Present";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Present"; // Fallback for invalid dates
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function extractSkillsFromResume(resume: any) {
  const skills = new Set<string>();

  // Extract from GitHub repos
  resume.selectedRepos?.forEach((repo: any) => {
    if (repo.language && repo.language !== "Unknown") {
      skills.add(repo.language);
    }
  });

  // Extract from experience descriptions (simple keyword matching could be better, but let's start simple)
  resume.experience?.forEach((exp: any) => {
    const keywords = exp.description?.match(/\b(React|Node|Python|Go|AWS|Docker|Git|SQL|NoSQL|Tailwind|Sass|TypeScript|JavaScript|HTML|CSS)\b/gi);
    keywords?.forEach((k: string) => skills.add(k));
  });

  // Extract from certificates
  resume.certificates?.forEach((cert: any) => {
    skills.add(cert.name);
  });

  return Array.from(skills);
}
