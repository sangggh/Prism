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

  const inputClasses = "w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">GitHub Portfolio</h2>
        <p className="text-slate-500 dark:text-slate-400">Import your top projects directly from your GitHub profile.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-2 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Globe size={20} />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Enter GitHub username..."
            className={`${inputClasses} pl-14 border-none shadow-none focus:ring-0 bg-transparent dark:bg-transparent`}
            onKeyDown={(e) => e.key === "Enter" && fetchRepos()}
          />
        </div>
        <button
          onClick={fetchRepos}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-blue-900/20 font-bold disabled:bg-slate-200 dark:disabled:bg-slate-800 flex items-center justify-center gap-2 min-w-[160px]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          Fetch Repos
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-bold flex items-center gap-3"
        >
          <div className="bg-red-100 dark:bg-red-900/40 p-1.5 rounded-full">!</div>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => toggleRepo(repo)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-md"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                    <Code size={18} />
                  </div>
                  {isSelected && (
                    <div className="bg-blue-600 text-white p-1 rounded-full">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
                  {repo.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-8">
                  {repo.description}
                </p>
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <Star size={12} /> {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> {repo.language}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {repos.length === 0 && !loading && !error && (
        <div className="text-center py-16 border-2 border-dashed rounded-3xl text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <Globe size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">Search for your GitHub profile to see your projects.</p>
        </div>
      )}
    </div>
  );
};
