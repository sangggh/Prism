import React from "react";
import { ResumeHistory, ResumeData } from "@/types/resume";
import { Plus, Clock, FileText, Trash2, Edit, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  resumes: ResumeHistory;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const HistoryList: React.FC<Props> = ({
  resumes,
  onLoad,
  onDelete,
  onCreateNew,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-0">
      {resumes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="bg-slate-50 dark:bg-slate-800 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <FileText size={48} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No resumes yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto">Start by creating your first professional resume using our guided builder.</p>
          <button
            onClick={onCreateNew}
            className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 mx-auto transition-colors"
          >
            Create your first resume <ExternalLink size={18} />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {resumes.sort((a, b) => b.updatedAt - a.updatedAt).map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-none transition-all group overflow-hidden flex flex-col h-full"
            >
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner">
                    <FileText size={28} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(resume.id);
                    }}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Delete resume"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {resume.personalInfo.fullName || "Untitled Resume"}
                </h3>
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Calendar size={14} /> 
                    <span>Created {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md">
                      {resume.education.length} Education
                    </span>
                    {resume.hasExperience && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 px-2 py-1 rounded-md">
                        {resume.experience.length} Experience
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                <button
                  onClick={() => onLoad(resume.id)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-600"
                >
                  <Edit size={18} /> Edit Resume
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
