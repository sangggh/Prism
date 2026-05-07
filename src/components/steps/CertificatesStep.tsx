import React from "react";
import { Certificate } from "@/types/resume";
import { Plus, Trash2, Award, Link as LinkIcon } from "lucide-react";
import { generateId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  data: Certificate[];
  onChange: (data: Certificate[]) => void;
}

export const CertificatesStep: React.FC<Props> = ({ data, onChange }) => {
  const addCertificate = () => {
    const newCert: Certificate = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
    };
    onChange([...data, newCert]);
  };

  const removeCertificate = (id: string) => {
    onChange(data.filter((cert) => cert.id !== id));
  };

  const handleChange = (id: string, field: keyof Certificate, value: string) => {
    onChange(
      data.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  const inputClasses = "w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium";
  const labelClasses = "text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Certificates & Achievements</h2>
          <p className="text-slate-500">Showcase your specialized skills and recognitions.</p>
        </div>
        <button
          onClick={addCertificate}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-100"
        >
          <Plus size={18} /> Add Certificate
        </button>
      </div>

      {data.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border-2 border-dashed rounded-3xl text-slate-400 bg-slate-50/50"
        >
          <Award size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">No certificates added yet.</p>
        </motion.div>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {data.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm relative group hover:shadow-md transition-all"
            >
              <button
                onClick={() => removeCertificate(cert.id)}
                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>Certificate Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange(cert.id, "name", e.target.value)}
                    placeholder="e.g. AWS Solutions Architect"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleChange(cert.id, "issuer", e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Date Received</label>
                  <input
                    type="date"
                    value={cert.date}
                    onChange={(e) => handleChange(cert.id, "date", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Verification Link (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon size={16} />
                    </div>
                    <input
                      type="text"
                      value={cert.link || ""}
                      onChange={(e) => handleChange(cert.id, "link", e.target.value)}
                      placeholder="https://verify.cert.com/..."
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <label className={labelClasses}>Short Description (Optional)</label>
                <textarea
                  value={cert.description || ""}
                  onChange={(e) => handleChange(cert.id, "description", e.target.value)}
                  placeholder="Briefly describe the skills or achievement..."
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
