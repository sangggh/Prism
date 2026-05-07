"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge,
  ConnectionLineType,
  Panel,
  Handle,
  Position,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  MarkerType, // Import MarkerType
  ReactFlowProvider
} from "@xyflow/react";

// Custom Node Component
const RoadmapNode = ({ data }: any) => {
  const handleClick = () => {
    if (data.isRecommendation && data.label) {
      const query = encodeURIComponent(data.label);
      window.open(`https://www.google.com/search?q=${query}+course+tutorial`, '_blank');
    }
  };

  const getStatusStyles = () => {
    if (data.isCompleted) return "bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400";
    if (data.isGap) return "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400";
    if (data.isRecommendation) return "bg-blue-500/5 border-blue-500/30 text-blue-700 dark:text-blue-400 italic text-xs";
    if (data.isProject) return "bg-purple-500/10 border-purple-500/50 text-purple-700 dark:text-purple-400";
    if (data.isSubNode) return "bg-slate-500/5 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs";
    return "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className={cn(
        "px-6 py-4 rounded-2xl border-2 shadow-sm min-w-[220px] max-w-[300px] transition-all duration-500 backdrop-blur-sm",
        getStatusStyles(),
        data.isRecommendation && "cursor-pointer hover:translate-x-1 hover:bg-blue-500/10",
        !data.isRecommendation && "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-blue-500 !border-0 !-top-1" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {data.isCompleted ? (
            <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={14} />
            </div>
          ) : data.icon ? (
            <div className={cn(
              "p-2 rounded-xl",
              data.isGap ? "bg-amber-500/20 text-amber-600" : 
              data.isProject ? "bg-purple-500/20 text-purple-600" : 
              "bg-blue-500/20 text-blue-600"
            )}>
              <data.icon size={16} />
            </div>
          ) : null}
          
          <div className="flex flex-col text-left">
            <span className={cn(
              "font-sans tracking-tight text-sm leading-tight",
              data.isCompleted && "line-through opacity-60",
              !data.isCompleted && "font-bold"
            )}>
              {data.label}
            </span>
            {data.description && (
              <p className="text-[10px] opacity-60 mt-1 line-clamp-2 leading-relaxed font-medium italic">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {data.isRecommendation && (
          <div className="mt-1 pt-2 border-t border-blue-500/10 text-[9px] font-black text-blue-500 uppercase tracking-[0.15em] flex items-center justify-between">
            <span>Resources Available</span>
            <ExternalLink size={10} />
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-500 !border-0 !-bottom-1" />
    </motion.div>
  );
};

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

// Custom Zoom Controls
const CustomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className="flex flex-col gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <button onClick={() => zoomIn()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
        <Plus size={18} />
      </button>
      <div className="h-px bg-slate-100 dark:bg-slate-800 mx-1" />
      <button onClick={() => zoomOut()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
        <Minus size={18} />
      </button>
      <div className="h-px bg-slate-100 dark:bg-slate-800 mx-1" />
      <button onClick={() => fitView()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
        <Maximize size={18} />
      </button>
    </div>
  );
};
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Map, 
  FileText, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Brain,
  Lightbulb,
  Rocket,
  Plus,
  Minus,
  Maximize,
  Upload,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Target,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { ThemeToggle } from "@/components/ThemeToggle";
import { extractSkillsFromResume } from "@/lib/utils";
import { analyzeSkillGapAction, searchJobsAction, extractSkillsFromTextAction } from "@/app/actions/ai";
import { JobsList } from "@/components/JobsList";
import { Job } from "@/components/JobCard";

// Load static roadmap data
import frontendData from "@/data/roadmaps/frontend.json";
import backendData from "@/data/roadmaps/backend.json";

// Helper to create placeholder roadmap data
const createPlaceholderData = (title: string) => {
  const id = title.toLowerCase().replace(/\s+/g, "-");
  return {
    id: id,
    title: title,
    description: `Step by step guide to becoming a ${title} in 2026`,
    nodes: [
      { id: "1", type: "roadmapNode", data: { label: `Start ${title} Journey` }, position: { x: 250, y: 0 } },
      { id: "2", type: "roadmapNode", data: { label: "Foundational Skills" }, position: { x: 250, y: 150 } },
      // Branches for Foundational Skills - horizontal tree
      { id: "2a", type: "roadmapNode", data: { label: "General Knowledge", isSubNode: true }, position: { x: -50, y: 250 } },
      { id: "2b", type: "roadmapNode", data: { label: "Core Tools", isSubNode: true }, position: { x: 550, y: 250 } },
      { id: "2c", type: "roadmapNode", data: { label: "Basic Syntax", isSubNode: true }, position: { x: 250, y: 250 } },
      
      { id: "3", type: "roadmapNode", data: { label: "Advanced Concepts" }, position: { x: 250, y: 450 } },
      { id: "4", type: "roadmapNode", data: { label: "Mastery & Projects" }, position: { x: 250, y: 600 } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", style: { strokeWidth: 3, stroke: '#3b82f6' } },
      { id: "e2-2a", source: "2", target: "2a", animated: true, style: { strokeDasharray: '5,5', stroke: '#64748b', strokeWidth: 2 } },
      { id: "e2-2b", source: "2", target: "2b", animated: true, style: { strokeDasharray: '5,5', stroke: '#64748b', strokeWidth: 2 } },
      { id: "e2-2c", source: "2", target: "2c", animated: true, style: { strokeDasharray: '5,5', stroke: '#64748b', strokeWidth: 2 } },
      { id: "e2-3", source: "2", target: "3", style: { strokeWidth: 3, stroke: '#3b82f6' } },
      { id: "e3-4", source: "3", target: "4", style: { strokeWidth: 3, stroke: '#3b82f6' } }
    ],
    skills: [title, "Fundamentals", "Advanced"]
  };
};

const ROLE_LIST = [
  "Frontend Developer", "Backend Developer", "Fullstack Developer", "DevOps Engineer", 
  "DevSecOps Engineer", "Data Analyst", "AI Engineer", "AI and Data Scientist", 
  "Data Engineer", "Android Developer", "Machine Learning Engineer", "PostgreSQL Developer", 
  "iOS Developer", "Blockchain Developer", "QA Engineer", "Software Architect", 
  "Cyber Security Engineer", "UX Designer", "Technical Writer", "Game Developer", 
  "Server Side Game Developer", "MLOps Engineer", "Product Manager", 
  "Engineering Manager", "Developer Relations", "BI Analyst"
];

const COUNTRY_LIST = [
  "Australia", "Canada", "Germany", "India", "Japan", "Netherlands", 
  "Philippines", "Remote", "Singapore", "South Korea", "United Arab Emirates", 
  "United Kingdom", "United States", "Worldwide"
];

const ROADMAPS = ROLE_LIST.map(role => {
  if (role === "Frontend Developer") return { id: "frontend", title: "Frontend Developer", data: frontendData };
  if (role === "Backend Developer") return { id: "backend", title: "Backend Developer", data: backendData };
  return { id: role.toLowerCase().replace(/\s+/g, "-"), title: role, data: createPlaceholderData(role) };
});

export default function RoadmapPage() {
  return (
    <ReactFlowProvider>
      <RoadmapContent />
    </ReactFlowProvider>
  );
}

function RoadmapContent() {
  const { resumes, isLoaded: resumeIsLoaded } = useResume();
  const [selectedRole, setSelectedRole] = useState(ROADMAPS[0]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [userLocation, setUserLocation] = useState<string>("Philippines");
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const currentResume = useMemo(() => 
    resumes.find(r => r.id === selectedResumeId),
    [resumes, selectedResumeId]
  );

  const fetchJobs = async () => {
    setIsSearchingJobs(true);
    try {
      const result = await searchJobsAction(selectedRole.title, userLocation);
      setJobs(result.jobs);
      setSelectedJob(null); // Reset job selection
      setAnalysisResult(null); // Reset analysis
      setNodes([]); // Clear roadmap
      setEdges([]); // Clear roadmap
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setIsSearchingJobs(false);
    }
  };

  // Removed initial fetch useEffect to ensure manual trigger only

  // Analyze gap when job is selected
  const handleAnalyzeJob = async (job: Job) => {
    if (!currentResume) {
      alert("Please select a resume first to personalize the roadmap.");
      return;
    }
    
    setSelectedJob(job);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const resumeSkills = extractSkillsFromResume(currentResume);
      const result = await analyzeSkillGapAction(resumeSkills, job.skills);
      setAnalysisResult(result);
      
      // Auto-fit view after analysis results are applied
      setTimeout(() => {
        const flow = document.querySelector('.react-flow__viewport');
        if (flow) {
          // We can't easily call fitView here without the hook, 
          // but we can set a flag or rely on the useEffect that updates nodes
        }
      }, 100);
    } catch (error) {
      console.error("Job analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { fitView } = useReactFlow();

  // ... (keep existing state)

  // Update nodes and edges based on job and analysis
  useEffect(() => {
    if (!selectedJob || !analysisResult) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Adaptive Roadmap Logic
    let baseNodes: Node[] = [];
    let baseEdges: Edge[] = [];

    // 1. Create nodes for job requirements
    const startX = 0; // Center everything at 0
    const startY = 0;
    const verticalSpacing = 180;

    // Header node
    baseNodes.push({
      id: "job-header",
      type: "roadmapNode",
      data: { 
        label: `${selectedJob.title}`, 
        icon: Target,
        description: `@ ${selectedJob.company}`
      },
      position: { x: startX, y: startY },
    });

    let currentY = startY + verticalSpacing;

    if (analysisResult) {
      // Completed skills - Horizontal layout at the top
      analysisResult.completed.forEach((skill: string, index: number) => {
        const id = `completed-${index}`;
        const xPos = (index - (analysisResult.completed.length - 1) / 2) * 260;
        baseNodes.push({
          id,
          type: "roadmapNode",
          data: { label: skill, isCompleted: true },
          position: { x: xPos, y: currentY },
        });
        
        // Connect job-header to each completed skill
        baseEdges.push({
          id: `e-header-${id}`,
          source: "job-header",
          target: id,
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 3 }, // Removed strokeDasharray: '0'
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });
      });

      currentY += verticalSpacing;

      // Missing skills (Learning Path) - Vertical center path
      const pathHeaderId = "learning-path-header";
      baseNodes.push({
        id: pathHeaderId,
        type: "roadmapNode",
        data: { label: "LEARNING OBJECTIVES", icon: Sparkles, isGap: true },
        position: { x: startX, y: currentY },
      });
      
      // Connect job-header directly to learning path header
      baseEdges.push({
        id: `e-job-to-path-header`,
        source: "job-header",
        target: pathHeaderId,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 4 }, // Removed strokeDasharray: '0'
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      });

      let pathY = currentY + verticalSpacing;
      analysisResult.missing.forEach((gap: any, index: number) => {
        const gapId = `missing-${index}`;
        baseNodes.push({
          id: gapId,
          type: "roadmapNode",
          data: { label: gap.skill, isGap: true },
          position: { x: startX, y: pathY },
        });
        
        // Connect nodes in sequence
        baseEdges.push({
          id: `e-path-${gapId}`,
          source: index === 0 ? pathHeaderId : `missing-${index - 1}`,
          target: gapId,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 4 }, // Removed strokeDasharray: '0'
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });

        // Recommendations - Offset to the right
        const rec = analysisResult.recommendations.find((r: any) => r.skill === gap.skill);
        if (rec) {
          const recId = `rec-${index}`;
          baseNodes.push({
            id: recId,
            type: "roadmapNode",
            data: { label: rec.action, icon: Lightbulb, isRecommendation: true },
            position: { x: startX + 350, y: pathY },
          });
          baseEdges.push({
            id: `e-gap-${recId}`,
            source: gapId,
            target: recId,
            animated: true,
            style: { stroke: '#64748b', strokeDasharray: '5,5', strokeWidth: 2 },
          });
        }
        pathY += verticalSpacing;
      });

      // Projects
      if (analysisResult.projects?.length > 0) {
        const projHeaderId = "projects-header";
        baseNodes.push({
          id: projHeaderId,
          type: "roadmapNode",
          data: { label: "MASTERY PROJECTS", icon: Rocket, isGap: true },
          position: { x: startX, y: pathY },
        });
        
        baseEdges.push({
          id: `e-last-path-proj`,
          source: analysisResult.missing.length > 0 ? `missing-${analysisResult.missing.length - 1}` : pathHeaderId,
          target: projHeaderId,
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 4 }, // Removed strokeDasharray: '0'
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });

        analysisResult.projects.forEach((proj: any, index: number) => {
          const projId = `proj-${index}`;
          const xOffset = (index - (analysisResult.projects.length - 1) / 2) * 350;
          baseNodes.push({
            id: projId,
            type: "roadmapNode",
            data: { label: proj.title, description: proj.description, isProject: true, icon: Rocket },
            position: { x: startX + xOffset, y: pathY + verticalSpacing },
          });
          baseEdges.push({
            id: `e-proj-${projId}`,
            source: projHeaderId,
            target: projId,
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 3 }, // Removed strokeDasharray: '0'
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
          });
        });
      }
    }

    setNodes(baseNodes);
    setEdges(baseEdges);
  }, [selectedJob, analysisResult, selectedRole]);

  // Auto-fit view when the nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [nodes, fitView]);

  if (!resumeIsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-blue-200 dark:shadow-blue-900/20 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-md rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">PRISM</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Role & Resume */}
        <aside className="w-[400px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          {/* Role Selection */}
          <section>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              <Target size={14} /> Career Goal
            </div>
            <select
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors font-sans"
              value={selectedRole.id}
              onChange={(e) => {
                const role = ROADMAPS.find(r => r.id === e.target.value);
                if (role) setSelectedRole(role);
              }}
            >
              {ROADMAPS.map(role => (
                <option key={role.id} value={role.id} className="font-sans">
                  {role.title}
                </option>
              ))}
            </select>
          </section>

          {/* Location Selection */}
          <section>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              <MapPin size={14} /> Preferred Location
            </div>
            <select
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors font-sans"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            >
              {COUNTRY_LIST.map(country => (
                <option key={country} value={country} className="font-sans">
                  {country}
                </option>
              ))}
            </select>
          </section>

          {/* Resume Selection */}
          <section>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              <FileText size={14} /> Reference Resume
            </div>
            <select
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors font-sans mb-3"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
            >
              <option value="" className="font-sans">Select a resume...</option>
              {resumes.map(resume => (
                <option key={resume.id} value={resume.id} className="font-sans">
                  {resume.personalInfo.fullName || "Untitled Resume"}
                </option>
              ))}
            </select>
            <button
              onClick={fetchJobs}
              disabled={isSearchingJobs}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-slate-200 dark:shadow-none"
            >
              {isSearchingJobs ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Target size={16} />
              )}
              Filter Jobs
            </button>
          </section>

          {/* Jobs List */}
          <section className="flex-1">
            <JobsList 
              jobs={jobs} 
              isLoading={isSearchingJobs} 
              selectedJobId={selectedJob?.id}
              onJobSelect={handleAnalyzeJob}
              userSkills={currentResume ? extractSkillsFromResume(currentResume) : []}
            />
          </section>
        </aside>

        {/* Main Content: React Flow */}
        <main className="flex-1 relative bg-white dark:bg-slate-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: false,
              style: { strokeWidth: 2 } // Removed strokeDasharray: '0'
            }}
            fitView
            className="dark:bg-slate-950"
          >
            <Background color="#33415566" gap={20} variant={BackgroundVariant.Dots}/>
            <Panel position="bottom-right" className="mb-6 mr-6">
              <CustomControls />
            </Panel>
            <MiniMap 
              position="bottom-left"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden !bottom-6 !left-6"
              nodeColor={(node: any) => {
                if (node.data.isGap) return '#fbbf24';
                if (node.data.isRecommendation) return '#60a5fa';
                if (node.data.isProject) return '#10b981';
                if (node.data.isCompleted) return '#10b981';
                return '#94a3b8';
              }}
              maskColor="rgba(15, 23, 42, 0.4)"
              style={{ width: 180, height: 120 }}
            />
            
            {isAnalyzing && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 rounded-full" />
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Analyzing Job Requirements</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Comparing with your skills to build a path...</p>
                  </div>
                </div>
              </div>
            )}

            {!selectedJob && (
              <Panel position="top-right" className="p-4">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Map className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{selectedRole.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">{selectedRole.data.description}</p>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <Briefcase className="text-slate-400" size={18} />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Select a job on the left to personalize this roadmap</span>
                  </div>
                </div>
              </Panel>
            )}

            {selectedJob && analysisResult && (
              <Panel position="top-right" className="p-4">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-md"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-4">
                    <Brain size={14} /> Career Coach Insights
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic mb-6">
                    "{analysisResult.explanation}"
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Compatibility</span>
                      <span className="text-emerald-500">
                        {Math.round((analysisResult.completed.length / (analysisResult.completed.length + analysisResult.missing.length)) * 100)}% Match
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(analysisResult.completed.length / (analysisResult.completed.length + analysisResult.missing.length)) * 100}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                </motion.div>
              </Panel>
            )}
          </ReactFlow>
        </main>
      </div>
    </div>
  );
}
