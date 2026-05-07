import { useState, useEffect } from "react";
import { ResumeData, ResumeHistory, PersonalInfo, Education, Experience, Certificate, GitHubRepo } from "@/types/resume";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "prism_resumes";

const initialData: ResumeData = {
  id: "",
  title: "My Resume",
  updatedAt: Date.now(),
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
  },
  education: [],
  experience: [],
  hasExperience: false,
  certificates: [],
  githubUsername: "",
  selectedRepos: [],
};

export function useResume() {
  const [resumes, setResumes] = useState<ResumeHistory>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResumes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse resumes from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveResume = (data: ResumeData) => {
    const newResume = {
      ...data,
      id: data.id || generateId(),
      updatedAt: Date.now(),
    };

    const updatedResumes = [...resumes];
    const index = updatedResumes.findIndex((r) => r.id === newResume.id);

    if (index > -1) {
      updatedResumes[index] = newResume;
    } else {
      updatedResumes.push(newResume);
    }

    setResumes(updatedResumes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));
    setCurrentResume(newResume);
  };

  const loadResume = (id: string) => {
    const resume = resumes.find((r) => r.id === id);
    if (resume) {
      setCurrentResume(resume);
    }
  };

  const deleteResume = (id: string) => {
    const updatedResumes = resumes.filter((r) => r.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));
  };

  const resetCurrentResume = () => {
    setCurrentResume({ ...initialData, id: generateId() });
  };

  return {
    resumes,
    currentResume,
    setCurrentResume,
    saveResume,
    loadResume,
    deleteResume,
    resetCurrentResume,
    isLoaded,
  };
}
