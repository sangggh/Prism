import React from "react";
import { Education } from "@/types/resume";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { generateId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationStep: React.FC<Props> = ({ data, onChange }) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
    };
    onChange([...data, newEdu]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const handleChange = (id: string, field: keyof Education, value: string) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Education</h2>
          <p className="text-slate-500">List your academic background and qualifications.</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-100"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      {data.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border-2 border-dashed rounded-3xl text-slate-400 bg-slate-50/50"
        >
          <GraduationCap size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">No education entries added yet.</p>
        </motion.div>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {data.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm relative group hover:shadow-md transition-all"
            >
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>School / University</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleChange(edu.id, "school", e.target.value)}
                    placeholder="e.g. Harvard University"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Degree / Field of Study</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, "degree", e.target.value)}
                    placeholder="e.g. B.S. Computer Science"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Start Date</label>
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => handleChange(edu.id, "startDate", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">End Date</label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={edu.endDate === "Present"}
                        onChange={() => togglePresent(edu.id, edu.endDate)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Currently Studying</span>
                    </label>
                  </div>
                  {edu.endDate === "Present" ? (
                    <div className={`${inputClasses} bg-blue-50 border-blue-200 text-blue-600 flex items-center`}>
                      Present
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleChange(edu.id, "endDate", e.target.value)}
                      className={inputClasses}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <label className={labelClasses}>Description (Optional)</label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => handleChange(edu.id, "description", e.target.value)}
                  placeholder="e.g. Relevant coursework, honors, GPA..."
                  className={`${inputClasses} min-h-[100px] resize-none`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
