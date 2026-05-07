import React, { useState } from "react";
import { ResumeData } from "@/types/resume";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { EducationStep } from "./steps/EducationStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { CertificatesStep } from "./steps/CertificatesStep";
import { GitHubStep } from "./steps/GitHubStep";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code, 
  ChevronRight, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onSave: () => void;
  onPreview: () => void;
}

const STEPS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "github", label: "GitHub Portfolio", icon: Code },
];

export const FormWizard: React.FC<Props> = ({ data, onChange, onSave, onPreview }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal Info
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          data.personalInfo.fullName.trim().length > 0 &&
          emailRegex.test(data.personalInfo.email) &&
          data.personalInfo.phone.length === 11
        );
      case 1: // Education
        return data.education.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!isStepValid()) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    const commonProps = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3 }
    };

    switch (currentStep) {
      case 0:
        return (
          <motion.div {...commonProps}>
            <PersonalInfoStep
              data={data.personalInfo}
              onChange={(val) => onChange({ ...data, personalInfo: val })}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div {...commonProps}>
            <EducationStep
              data={data.education}
              onChange={(val) => onChange({ ...data, education: val })}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div {...commonProps}>
            <ExperienceStep
              hasExperience={data.hasExperience}
              onHasExperienceChange={(val) => onChange({ ...data, hasExperience: val })}
              data={data.experience}
              onChange={(val) => onChange({ ...data, experience: val })}
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div {...commonProps}>
            <CertificatesStep
              data={data.certificates}
              onChange={(val) => onChange({ ...data, certificates: val })}
            />
          </motion.div>
        );
      case 4:
        return (
          <motion.div {...commonProps}>
            <GitHubStep
              username={data.githubUsername}
              onUsernameChange={(val) => onChange({ ...data, githubUsername: val })}
              selectedRepos={data.selectedRepos}
              onReposChange={(val) => onChange({ ...data, selectedRepos: val })}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  const canGoNext = isStepValid();

  return (
    <div className="flex flex-col gap-8">
      {/* Horizontal Stepper */}
      <div className="flex items-center justify-between relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => {
                // Only allow clicking steps if they are valid or if we are going backwards
                if (index <= currentStep || isStepValid()) {
                  setCurrentStep(index);
                }
              }}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-white text-slate-400 border border-slate-200 group-hover:border-blue-300"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>
              <span
                className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="mt-8 bg-slate-50/50 rounded-2xl p-8 border border-slate-100 min-h-[500px]">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all"
        >
          <ArrowLeft size={20} /> Previous
        </button>
        
        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!canGoNext}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={onPreview}
            disabled={!canGoNext}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Final Review <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
