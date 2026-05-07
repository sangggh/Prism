import React from "react";
import { Experience } from "@/types/resume";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { generateId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  hasExperience: boolean;
  onHasExperienceChange: (val: boolean) => void;
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceStep: React.FC<Props> = ({
  hasExperience,
  onHasExperienceChange,
  data,
  onChange,
}) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange([...data, newExp]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const handleChange = (id: string, field: keyof Experience, value: string) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const togglePresent = (id: string, currentEndDate: string) => {
    const newValue = currentEndDate === "Present" ? "" : "Present";
    handleChange(id, "endDate", newValue);
  };

  const inputClasses = "w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium";
  const labelClasses = "text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Work Experience</h2>
        <p className="text-slate-500 dark:text-slate-400">Highlight your professional background and achievements.</p>
      </div>

      <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Do you have work experience?</span>
        <div className="flex gap-4">
          {[true, false].map((val) => (
            <label key={val.toString()} className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="hasExperience"
                  checked={hasExperience === val}
                  onChange={() => onHasExperienceChange(val)}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-200 dark:border-slate-700 rounded-full checked:border-blue-600 dark:checked:border-blue-500 transition-all"
                />
                <div className="absolute w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
              </div>
              <span className={`text-sm font-bold transition-colors ${hasExperience === val ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
                {val ? "Yes" : "No"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasExperience && (
        <>
          <div className="flex justify-end">
            <button
              onClick={addExperience}
              className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all font-bold shadow-lg shadow-slate-100 dark:shadow-blue-900/20"
            >
              <Plus size={18} /> Add Experience
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {data.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <Briefcase size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Click "Add Experience" to list your roles.</p>
                </motion.div>
              )}

              {data.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 border border-slate-100 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-800 shadow-sm relative group hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-6 right-6 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className={labelClasses}>Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleChange(exp.id, "company", e.target.value)}
                        placeholder="e.g. Google"
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className={labelClasses}>Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleChange(exp.id, "position", e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className={labelClasses}>Start Date</label>
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleChange(exp.id, "startDate", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-end mb-1.5 ml-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">End Date</label>
                        <button
                          onClick={() => togglePresent(exp.id, exp.endDate)}
                          className="flex items-center gap-1.5 group cursor-pointer"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${exp.endDate === "Present" ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600 group-hover:border-blue-400"}`}>
                            {exp.endDate === "Present" && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${exp.endDate === "Present" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>Currently Working</span>
                        </button>
                      </div>
                      <input
                        type={exp.endDate === "Present" ? "text" : "date"}
                        value={exp.endDate}
                        onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                        disabled={exp.endDate === "Present"}
                        className={`${inputClasses} ${exp.endDate === "Present" ? "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400" : ""}`}
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                      <label className={labelClasses}>Responsibilities & Achievements</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleChange(exp.id, "description", e.target.value)}
                        placeholder="• Led a team of 5 developers...&#10;• Optimized database queries by 40%..."
                        rows={4}
                        className={`${inputClasses} resize-none`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
