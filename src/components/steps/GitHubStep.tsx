import React, { useState } from "react";
import { GitHubRepo } from "@/types/resume";
import { Search, Code, Check, Loader2, Star, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  username: string;
  onUsernameChange: (val: string) => void;
  selectedRepos: GitHubRepo[];
  onReposChange: (repos: GitHubRepo[]) => void;
}

export const GitHubStep: React.FC<Props> = ({
  username,
  onUsernameChange,
  selectedRepos,
  onReposChange,
}) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (!response.ok) throw new Error("User not found or API limit reached");
      const data = await response.json();
      const mappedRepos: GitHubRepo[] = data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || "No description provided",
        html_url: repo.html_url,
        language: repo.language || "Unknown",
        stargazers_count: repo.stargazers_count,
      }));
      setRepos(mappedRepos);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRepo = (repo: GitHubRepo) => {
    const isSelected = selectedRepos.some((r) => r.id === repo.id);
    if (isSelected) {
      onReposChange(selectedRepos.filter((r) => r.id !== repo.id));
    } else {
      onReposChange([...selectedRepos, repo]);
    }
  };

  const inputClasses = "w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">GitHub Portfolio</h2>
        <p className="text-slate-500">Import your top projects directly from your GitHub profile.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
            <Globe size={20} />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Enter GitHub username..."
            className={`${inputClasses} pl-14 border-none shadow-none focus:ring-0`}
            onKeyDown={(e) => e.key === "Enter" && fetchRepos()}
          />
        </div>
        <button
          onClick={fetchRepos}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold disabled:bg-slate-200 flex items-center justify-center gap-2 min-w-[160px]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          Fetch Repos
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3"
        >
          <div className="bg-red-100 p-1.5 rounded-full">!</div>
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {repos.map((repo) => {
            const isSelected = selectedRepos.some((r) => r.id === repo.id);
            return (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => toggleRepo(repo)}
                className={`p-6 border rounded-3xl cursor-pointer transition-all relative group ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500 shadow-lg shadow-blue-100"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${isSelected ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
                      <Code size={18} />
                    </div>
                    <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{repo.name}</h3>
                  </div>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-blue-600 text-white rounded-full p-1 shadow-md shadow-blue-200"
                    >
                      <Check size={14} />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                  {repo.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                    {repo.language}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {repo.stargazers_count}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {repos.length === 0 && !loading && !error && (
        <div className="text-center py-16 border-2 border-dashed rounded-3xl text-slate-400 bg-slate-50/50">
          <Globe size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">Search for your GitHub profile to see your projects.</p>
        </div>
      )}
    </div>
  );
};
