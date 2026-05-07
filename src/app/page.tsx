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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <p className="text-slate-500 font-medium text-lg animate-pulse">Initializing Prism...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* App Header */}
      <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView("history")}
        >
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-blue-200 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-md rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">PRISM</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <HomeIcon size={18} /> Home
          </div>
          <Link
            href="/roadmap"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl transition-all"
          >
            <Map size={18} /> Roadmap
          </Link>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          {(view === "editor" || view === "review") && (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
              >
                <Save size={18} /> Save
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2" />
              {view === "review" && (
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                  Export PDF
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "history" ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto"
            >
              <HistoryList
                resumes={resumes}
                onLoad={handleLoadResume}
                onDelete={deleteResume}
                onCreateNew={handleCreateNew}
              />
            </motion.div>
          ) : view === "editor" ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-64px)] overflow-y-auto bg-white"
            >
              <div className="max-w-3xl mx-auto py-10 px-8">
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setView("history")}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Resume Editor</h1>
                    <p className="text-slate-500 text-sm">Build your professional profile step by step</p>
                  </div>
                </div>
                <FormWizard
                  data={currentResume}
                  onChange={setCurrentResume}
                  onSave={handleSave}
                  onPreview={() => setView("review")}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-64px)] overflow-y-auto bg-slate-100"
            >
              <div className="max-w-5xl mx-auto py-12 px-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setView("editor")}
                      className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900 shadow-sm"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Final Review</h1>
                      <p className="text-slate-500 text-sm">Preview your resume before downloading</p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    Download PDF
                  </button>
                </div>
                
                <div className="flex justify-center pb-20">
                  <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
                    <ResumePreview ref={resumeRef} data={currentResume} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

