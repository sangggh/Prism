import React from "react";
import { PersonalInfo } from "@/types/resume";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoStep: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Only allow numbers and max 11 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      onChange({ ...data, [name]: cleaned });
      return;
    }

    onChange({ ...data, [name]: value });
  };

  const inputClasses = "w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium";
  const labelClasses = "text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Personal Information</h2>
        <p className="text-slate-500 dark:text-slate-400">This information will appear at the very top of your resume.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={labelClasses}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="e.g. Alexander Pierce"
            className={inputClasses}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Email Address</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="e.g. alex@example.com"
            className={`${inputClasses} ${data.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'border-red-300 dark:border-red-500 ring-red-50 dark:ring-red-900/20' : ''}`}
            required
          />
          {data.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && (
            <span className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 ml-1">Please enter a valid email address</span>
          )}
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Phone Number (11 digits)</label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="e.g. 09123456789"
            className={`${inputClasses} ${data.phone.length > 0 && data.phone.length !== 11 ? 'border-red-300 dark:border-red-500 ring-red-50 dark:ring-red-900/20' : ''}`}
            required
          />
          {data.phone.length > 0 && data.phone.length !== 11 && (
            <span className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 ml-1">Must be exactly 11 digits</span>
          )}
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Location</label>
          <input
            type="text"
            name="location"
            value={data.location || ""}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>LinkedIn Profile</label>
          <input
            type="text"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            placeholder="linkedin.com/in/username"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>GitHub / Portfolio</label>
          <input
            type="text"
            name="github"
            value={data.github || ""}
            onChange={handleChange}
            placeholder="github.com/username"
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );
};

