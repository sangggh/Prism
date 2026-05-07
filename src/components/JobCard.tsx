import React from "react";
import { Briefcase, MapPin, ExternalLink, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  description: string;
  skills: string[];
  applyLink: string;
}

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onSelect: (job: Job) => void;
  userSkills?: string[];
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onSelect, userSkills = [] }) => {
  const matchingSkills = job.skills.filter(skill => 
    userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()))
  );

  return (
    <motion.div
      layout
      onClick={() => onSelect(job)}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
        isSelected 
          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-100 dark:shadow-none" 
          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Briefcase size={14} /> {job.company}
          </p>
        </div>
        {isSelected && (
          <div className="bg-blue-600 text-white p-1 rounded-full">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
        <span>•</span>
        <span>{job.experience}</span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 italic leading-relaxed">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {job.skills.slice(0, 4).map((skill, i) => {
          const isMatch = userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()));
          return (
            <span 
              key={i} 
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isMatch 
                  ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400" 
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              {skill}
            </span>
          );
        })}
        {job.skills.length > 4 && (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 self-center">
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {job.applyLink && (job.applyLink.includes("linkedin.com/jobs/view") || job.applyLink.includes("linkedin.com/jobs/search")) ? (
          <a 
            href={job.applyLink} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:underline"
          >
            Search on LinkedIn <ExternalLink size={12} />
          </a>
        ) : (
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 cursor-not-allowed opacity-50">
            Link Unavailable
          </span>
        )}
        <ChevronRight size={16} className={`text-slate-400 transition-transform ${isSelected ? "rotate-90 text-blue-600" : ""}`} />
      </div>
    </motion.div>
  );
};
