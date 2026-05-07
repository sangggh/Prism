"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  ReactFlowProvider
} from "@xyflow/react";

// Custom Node Component
const RoadmapNode = ({ data }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-5 py-3 rounded-xl border-2 shadow-xl min-w-[200px] max-w-[280px] text-center transition-all duration-300 relative z-10 ${
      data.isGap 
        ? "bg-amber-100 dark:bg-amber-900 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-50" 
        : data.isRecommendation
        ? "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-50 italic text-[13px]"
        : data.isProject
        ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-50"
        : data.isSubNode
        ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-bold"
    }`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-600 !border-2 !border-white dark:!border-slate-900 !-top-1.5" />
      <div className="flex flex-col items-center gap-1.5">
        {data.icon && <data.icon size={16} className={data.isRecommendation ? "text-blue-600 dark:text-blue-400" : data.isProject ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"} />}
        <span className="font-sans tracking-tight break-words text-sm">{data.label}</span>
        {data.description && <p className="text-[10px] opacity-70 mt-0.5 line-clamp-2">{data.description}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-600 !border-2 !border-white dark:!border-slate-900 !-bottom-1.5" />
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
  Maximize
} from "lucide-react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { ThemeToggle } from "@/components/ThemeToggle";
import { extractSkillsFromResume } from "@/lib/utils";
import { analyzeSkillGapAction } from "@/app/actions/ai";

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
  "Frontend", "Backend", "Full Stack", "DevOps", "DevSecOps", "Data Analyst", 
  "AI Engineer", "AI and Data Scientist", "Data Engineer", "Android", 
  "Machine Learning", "PostgreSQL", "iOS", "Blockchain", "QA", 
  "Software Architect", "Cyber Security", "UX Design", "Technical Writer", 
  "Game Developer", "Server Side Game Developer", "MLOps", "Product Manager", 
  "Engineering Manager", "Developer Relations", "BI Analyst"
];

const ROADMAPS = ROLE_LIST.map(role => {
  if (role === "Frontend") return { id: "frontend", title: "Frontend Developer", data: frontendData };
  if (role === "Backend") return { id: "backend", title: "Backend Developer", data: backendData };
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
  const { resumes, isLoaded } = useResume();
  const [selectedRole, setSelectedRole] = useState(ROADMAPS[0]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const currentResume = useMemo(() => 
    resumes.find(r => r.id === selectedResumeId),
    [resumes, selectedResumeId]
  );

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Update nodes and edges when role changes or analysis finishes
  useEffect(() => {
    // Map base nodes to use our custom roadmapNode type
    let baseNodes = selectedRole.data.nodes.map((n: any) => ({
      ...n,
      type: 'roadmapNode',
      data: { ...n.data }
    })) as Node[];
    
    let baseEdges = [...selectedRole.data.edges] as Edge[];

    if (analysisResult && analysisResult.gaps) {
      // Find the last node to position the gaps after it
      const lastNode = baseNodes.reduce((prev, current) => 
        (prev.position.y > current.position.y) ? prev : current
      );

      let currentY = lastNode.position.y + 200;
      
      // Add a header node for Gaps
      const gapsHeaderId = "gaps-header";
      baseNodes.push({
        id: gapsHeaderId,
        type: "roadmapNode",
        data: { label: "YOUR SKILL GAPS", icon: Sparkles, isGap: true },
        position: { x: 250, y: currentY },
      });

      // Connect last node to gaps header
      baseEdges.push({
        id: `e-last-${gapsHeaderId}`,
        source: lastNode.id,
        target: gapsHeaderId,
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 4 },
      });

      currentY += 150;

      // Add each gap as a node
      analysisResult.gaps.forEach((gapObj: any, index: number) => {
        const skillName = typeof gapObj === 'string' ? gapObj : gapObj.skill;
        const subtopics = gapObj.subtopics || [];
        
        const gapId = `gap-${index}`;
        // More compact layout: two columns near the center
        const isLeft = index % 2 === 0;
        const xPos = isLeft ? -150 : 650;
        
        baseNodes.push({
          id: gapId,
          type: "roadmapNode",
          data: { label: skillName, isGap: true },
          position: { x: xPos, y: currentY },
        });

        baseEdges.push({
          id: `e-header-${gapId}`,
          source: gapsHeaderId,
          target: gapId,
          type: ConnectionLineType.SmoothStep,
          animated: true,
          style: { stroke: '#f59e0b', strokeWidth: 3 }, // More solid orange
        });

        // Add subtopics as branches
        subtopics.forEach((topic: string, tIndex: number) => {
          const topicId = `topic-${index}-${tIndex}`;
          const tXOffset = isLeft ? -280 : 280;
          const tYOffset = (tIndex - (subtopics.length - 1) / 2) * 80;
          
          baseNodes.push({
            id: topicId,
            type: "roadmapNode",
            data: { label: topic, isSubNode: true },
            position: { x: xPos + tXOffset, y: currentY + tYOffset },
          });

          baseEdges.push({
            id: `e-gap-${topicId}`,
            source: gapId,
            target: topicId,
            animated: true,
            style: { stroke: '#64748b', strokeDasharray: '4,4', strokeWidth: 2 },
          });
        });

        // Find recommendation for this gap
        const rec = analysisResult.recommendations?.find((r: any) => r.skill.toLowerCase() === skillName.toLowerCase());
        if (rec) {
          const recId = `rec-${index}`;
          baseNodes.push({
            id: recId,
            type: "roadmapNode",
            data: { label: rec.action, icon: Lightbulb, isRecommendation: true },
            position: { x: xPos, y: currentY + 180 },
          });
          baseEdges.push({
            id: `e-gap-${recId}`,
            source: gapId,
            target: recId,
            style: { stroke: '#2563eb', strokeDasharray: '4,4', strokeWidth: 2 },
          });
        }

        if (!isLeft) currentY += 450; // More compact vertical spacing
      });

      // Add Mastery Projects at the very end
      if (analysisResult.projects && analysisResult.projects.length > 0) {
        currentY += 150;
        const projectsHeaderId = "projects-header";
        baseNodes.push({
          id: projectsHeaderId,
          type: "roadmapNode",
          data: { label: "MASTERY PROJECTS", icon: Rocket, isGap: true },
          position: { x: 250, y: currentY },
        });

        analysisResult.projects.forEach((proj: any, index: number) => {
          const projId = `proj-${index}`;
          const xOffset = index % 2 === 0 ? -450 : 450;
          baseNodes.push({
            id: projId,
            type: "roadmapNode",
            data: { 
              label: proj.title, 
              description: proj.description,
              isProject: true,
              icon: Rocket 
            },
            position: { x: 250 + xOffset, y: currentY + 250 },
          });

          baseEdges.push({
            id: `e-proj-header-${projId}`,
            source: projectsHeaderId,
            target: projId,
            type: ConnectionLineType.SmoothStep,
            animated: false,
            style: { stroke: '#10b981', strokeWidth: 3 },
          });
        });
      }
    }

    setNodes(baseNodes);
    setEdges(baseEdges);
  }, [selectedRole, analysisResult]);

  const handleAnalyze = async () => {
    if (!currentResume) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const resumeSkills = extractSkillsFromResume(currentResume);
      const result = await analyzeSkillGapAction(resumeSkills, selectedRole.data.skills);
      setAnalysisResult(result);
    } catch (error: any) {
      console.error("Analysis failed:", error);
      // Fallback result to show error message in UI
      setAnalysisResult({
        gaps: [],
        explanation: error.message || "Failed to connect to AI service.",
        recommendations: [],
        projects: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-blue-200 dark:shadow-blue-900/20 shadow-lg">
            <div className="w-5 h-5 bg-white rounded-md rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">PRISM</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl transition-all"
            >
              <ChevronLeft size={18} /> Back to Editor
            </Link>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Controls & Analysis */}
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          <div>
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Target Role</h2>
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
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Reference Resume</h2>
            <select
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors font-sans"
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
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedResumeId || isAnalyzing}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 dark:shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isAnalyzing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            Analyze Skill Gaps
          </button>

          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30"
            >
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2">
                <Brain size={14} /> AI Insight
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                {analysisResult.explanation}
              </p>
              <button 
                onClick={() => setAnalysisResult(null)}
                className="mt-4 w-full py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
              >
                Clear Analysis
              </button>
            </motion.div>
          )}
        </aside>

        {/* Main Content: React Flow */}
        <main className="flex-1 relative bg-white dark:bg-slate-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            className="dark:bg-slate-950"
            style={{ width: '100%', height: '100%' }}
          >
            <Background color="#334155" gap={20} variant={BackgroundVariant.Dots} />
            <Panel position="bottom-right" className="mb-6 mr-6">
              <CustomControls />
            </Panel>
            <MiniMap 
              position="bottom-left"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden !bottom-6 !left-6"
              nodeColor={(node) => {
                if (node.data.isGap) return '#fbbf24';
                if (node.data.isRecommendation) return '#60a5fa';
                if (node.data.isProject) return '#10b981';
                return '#94a3b8';
              }}
              maskColor="rgba(15, 23, 42, 0.4)"
              style={{ width: 180, height: 120 }}
            />
            <Panel position="top-right" className="p-4">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-sm">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedRole.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{selectedRole.data.description}</p>
              </div>
            </Panel>
          </ReactFlow>
        </main>
      </div>
    </div>
  );
}
