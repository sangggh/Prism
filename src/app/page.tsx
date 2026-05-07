"use client";

import { useState, useRef, useEffect } from "react";
import { useResume } from "@/hooks/useResume";
import { FormWizard } from "@/components/FormWizard";
import { HistoryList } from "@/components/HistoryList";
import { ResumePreview } from "@/components/ResumePreview";
import { Download, ChevronLeft, LayoutDashboard, FilePlus, Loader2, Save, Eye, Share2, Map, Home as HomeIcon } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

type ViewState = "history" | "editor" | "review";

export default function Home() {
  const {
    resumes,
    currentResume,
    setCurrentResume,
    saveResume,
    loadResume,
    deleteResume,
    resetCurrentResume,
    isLoaded,
  } = useResume();

  const [view, setView] = useState<ViewState>("history");
  const [isExporting, setIsExporting] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleLoadResume = (id: string) => {
    loadResume(id);
    setView("editor");
  };

  const handleCreateNew = () => {
    resetCurrentResume();
    setView("editor");
  };

  const handleSave = () => {
    saveResume(currentResume);
  };

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);

    try {
      const element = resumeRef.current;
      
      // High-quality canvas options
      const canvas = await html2canvas(element, {
        scale: 3, // Increased scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794, // Fixed width in pixels for A4 (210mm @ 96dpi)
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      const fileName = `${currentResume.personalInfo.fullName?.trim().replace(/\s+/g, '-') || "my"}-resume.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg animate-pulse">Initializing Prism...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <button 
          onClick={() => setView("history")}
          className="flex items-center gap-3 group"
        >
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-blue-200 dark:shadow-blue-900/20 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-md rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">PRISM</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("history")}
            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
              view === "history" 
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <HomeIcon size={18} /> Home
          </button>
          <Link
            href="/roadmap"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl transition-all"
          >
            <Map size={18} /> Roadmap
          </Link>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        <AnimatePresence mode="wait">
          {view === "history" ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Resumes</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and edit your professional profiles</p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FilePlus size={20} />
                  Create New Resume
                </button>
              </div>
              <HistoryList
                resumes={resumes}
                onLoad={handleLoadResume}
                onDelete={deleteResume}
                onCreateNew={handleCreateNew}
              />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-8rem)]"
            >
              {/* Editor Header */}
              <div className="h-20 px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setView("history")}
                    className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentResume.personalInfo.fullName || "Untitled Resume"}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                      Live Editor
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                  >
                    <Save size={18} /> Save Progress
                  </button>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-sm hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Form */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar dark:bg-slate-900">
                  <div className="max-w-3xl mx-auto">
                    <FormWizard
                      data={currentResume}
                      onChange={setCurrentResume}
                      onSave={handleSave}
                    />
                  </div>
                </div>

                {/* Right Side: Preview */}
                <div className="hidden xl:block w-[550px] bg-slate-50 dark:bg-slate-800/50 border-l border-slate-100 dark:border-slate-800 overflow-y-auto p-10 custom-scrollbar">
                  <div className="sticky top-0">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Eye size={14} /> Live Preview
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md">
                          A4 Standard
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Ready to Print
                        </span>
                      </div>
                    </div>
                    <div className="origin-top scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] transition-transform duration-500">
                      <div className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-sm overflow-hidden bg-white">
                        <ResumePreview ref={resumeRef} data={currentResume} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

