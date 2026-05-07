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

  const inputClasses = "w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium";
  const labelClasses = "text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Work Experience</h2>
        <p className="text-slate-500">Highlight your professional background and achievements.</p>
      </div>

      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <span className="text-sm font-bold text-slate-700">Do you have work experience?</span>
        <div className="flex gap-4">
          {[true, false].map((val) => (
            <label key={val.toString()} className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="hasExperience"
                  checked={hasExperience === val}
                  onChange={() => onHasExperienceChange(val)}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-blue-600 transition-all"
                />
                <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
              </div>
              <span className={`text-sm font-bold transition-colors ${hasExperience === val ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
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
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-100"
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
                  className="text-center py-16 border-2 border-dashed rounded-3xl text-slate-400 bg-slate-50/50"
                >
                  <Briefcase size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Click "Add Experience" to list your roles.</p>
                </motion.div>
              )}

              {data.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm relative group hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-6 right-6 text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
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
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">End Date</label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={exp.endDate === "Present"}
                            onChange={() => togglePresent(exp.id, exp.endDate)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Currently Working</span>
                        </label>
                      </div>
                      {exp.endDate === "Present" ? (
                        <div className={`${inputClasses} bg-blue-50 border-blue-200 text-blue-600 flex items-center`}>
                          Present
                        </div>
                      ) : (
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                          className={inputClasses}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-6">
                    <label className={labelClasses}>Responsibilities & Achievements</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleChange(exp.id, "description", e.target.value)}
                      placeholder="Describe your impact, key projects, and technologies used..."
                      className={`${inputClasses} min-h-[150px] resize-none`}
                    />
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
