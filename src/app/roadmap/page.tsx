"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Map, Lightbulb, Target, Rocket, ArrowRight, Home as HomeIcon } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/ThemeToggle";

const ROADMAP_STEPS = [
  {
    title: "Foundation",
    icon: Lightbulb,
    description: "Master the basics of computer science and your chosen stack.",
    items: ["Data Structures & Algorithms", "Version Control (Git)", "Basic Web/App Design"],
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Specialization",
    icon: Target,
    description: "Deep dive into specific technologies and frameworks.",
    items: ["Advanced React/Next.js", "Backend Systems & Databases", "API Design"],
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Portfolio Building",
    icon: Rocket,
    description: "Create impactful projects to showcase your expertise.",
    items: ["Real-world SaaS apps", "Open Source Contributions", "Technical Writing"],
    color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  },
];

export default function Roadmap() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Roadmap Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-blue-200 dark:shadow-blue-900/20 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-md rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">PRISM</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl transition-all"
          >
            <HomeIcon size={18} /> Home
          </Link>
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Map size={18} /> Roadmap
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Your Career Roadmap</h1>
          <p className="text-slate-50 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Follow these professional milestones to build a resume that stands out in the industry.
          </p>
        </motion.div>

        <div className="space-y-12">
          {ROADMAP_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-8 group"
              >
                {/* Timeline Line */}
                {index !== ROADMAP_STEPS.length - 1 && (
                  <div className="absolute top-16 left-8 w-0.5 h-full bg-slate-200 dark:bg-slate-800" />
                )}

                <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-slate-100 dark:shadow-black/20 ${step.color}`}>
                  <Icon size={32} />
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-xl group-hover:shadow-slate-200/50 dark:group-hover:shadow-black/50 transition-all flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{step.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center p-12 bg-blue-600 rounded-[3rem] text-white shadow-2xl shadow-blue-200"
        >
          <h2 className="text-2xl font-black mb-4">Ready to start building?</h2>
          <p className="text-blue-100 mb-8 opacity-90">Put your skills on paper and land your dream role.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            Create Your Resume Now <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
