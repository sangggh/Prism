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

const TECH_KEYWORDS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Go",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "CI/CD",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "NoSQL",
  "Redis",
  "GraphQL",
  "REST",
  "Tailwind",
  "Sass",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Terraform",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Swift",
  "Kotlin",
  "Rust",
  "Firebase",
  "Supabase",
  "Prisma",
  "Jest",
  "Vitest",
  "Playwright",
  "Cypress",
  "Figma",
  "Linux",
  "Bash",
  "Machine Learning",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
];

function addSkill(skills: Set<string>, value: unknown) {
  if (typeof value !== "string") return;
  const cleaned = value.trim();
  if (!cleaned || cleaned === "Unknown") return;
  skills.add(cleaned);
}

function addKeywordMatches(skills: Set<string>, text: unknown) {
  if (typeof text !== "string" || !text.trim()) return;
  TECH_KEYWORDS.forEach((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i");
    if (pattern.test(text)) skills.add(keyword);
  });
}

export function extractSkillsFromResume(resume: any) {
  const skills = new Set<string>();

  // Extract from GitHub projects, including languages and text evidence.
  resume.selectedRepos?.forEach((repo: any) => {
    if (repo.languages && Array.isArray(repo.languages)) {
      repo.languages.forEach((lang: string) => addSkill(skills, lang));
    } else {
      addSkill(skills, repo.language);
    }

    addKeywordMatches(skills, repo.name);
    addKeywordMatches(skills, repo.description);
  });

  // Extract from experience descriptions.
  resume.experience?.forEach((exp: any) => {
    addKeywordMatches(skills, exp.position);
    addKeywordMatches(skills, exp.description);
  });

  // Extract from certificates and achievements.
  resume.certificates?.forEach((cert: any) => {
    addSkill(skills, cert.name);
    addKeywordMatches(skills, cert.name);
    addKeywordMatches(skills, cert.description);
    cert.skills?.forEach((skill: string) => addSkill(skills, skill));
  });

  return Array.from(skills);
}
