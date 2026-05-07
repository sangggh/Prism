import React from "react";
import { Job, JobCard } from "./JobCard";
import { Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JobsListProps {
  jobs: Job[];
  isLoading: boolean;
  selectedJobId?: string;
  onJobSelect: (job: Job) => void;
  userSkills?: string[];
}

export const JobsList: React.FC<JobsListProps> = ({ 
  jobs, 
  isLoading, 
  selectedJobId, 
  onJobSelect,
  userSkills = []
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fetching LinkedIn Jobs...</p>
      </div>
    );
  }

  // Filter out jobs that don't have a valid LinkedIn URL to maintain quality
  const validJobs = jobs.filter(job => 
    job.applyLink && (job.applyLink.includes("linkedin.com/jobs/view") || job.applyLink.includes("linkedin.com/jobs/search"))
  );

  if (validJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">No verified jobs found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Try filtering again or choosing a different role</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Open Jobs ({validJobs.length})
        </h2>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Direct Apply Available</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {validJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJobId === job.id}
              onSelect={onJobSelect}
              userSkills={userSkills}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
