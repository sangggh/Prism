import React from "react";
import { ResumeData } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
}

const renderBulletPoints = (description: string) => {
  if (!description) return null;
  const lines = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return null;

  return (
    <ul className="list-disc ml-5 mt-1 text-[9.5pt] leading-snug" style={{ color: '#1f2937' }}>
      {lines.map((line, index) => {
        // Remove existing bullet characters if present at the start (e.g., -, *, •)
        const cleanedLine = line.replace(/^[•\-\*]\s*/, "");
        return <li key={index} className="pl-1">{cleanedLine}</li>;
      })}
    </ul>
  );
};

export const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white p-[20mm] shadow-lg w-[210mm] min-h-[297mm] mx-auto text-[#1a1a1a] leading-tight print:shadow-none"
        id="resume-content"
        style={{ color: '#1a1a1a', backgroundColor: '#ffffff', fontFamily: '"Times New Roman", Times, serif' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2" style={{ color: '#000000' }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="text-[10pt] flex flex-wrap justify-center gap-x-2" style={{ color: '#374151' }}>
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.location ? "| " : ""}{data.personalInfo.phone}</span>}
            {data.personalInfo.email && <span>{(data.personalInfo.location || data.personalInfo.phone) ? "| " : ""}{data.personalInfo.email}</span>}
            {data.personalInfo.linkedin && (
              <span>{(data.personalInfo.location || data.personalInfo.phone || data.personalInfo.email) ? "| " : ""}{data.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
            )}
            {data.personalInfo.github && (
              <span>{(data.personalInfo.location || data.personalInfo.phone || data.personalInfo.email || data.personalInfo.linkedin) ? "| " : ""}{data.personalInfo.github.replace(/^https?:\/\//, '')}</span>
            )}
          </div>
        </div>

        {/* Education Section */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[11pt] font-bold border-b border-black uppercase mb-3 tracking-wider pb-1" style={{ color: '#000000', borderBottomColor: '#000000' }}>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-[11pt]" style={{ color: '#000000' }}>{edu.school}</span>
                  <span className="text-[10pt]" style={{ color: '#000000' }}>
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-[10.5pt]" style={{ color: '#000000' }}>{edu.degree}</span>
                </div>
                {edu.description && renderBulletPoints(edu.description)}
              </div>
            ))}
          </div>
        )}

        {/* Experience Section */}
        {data.hasExperience && data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[11pt] font-bold border-b border-black uppercase mb-3 tracking-wider pb-1" style={{ color: '#000000', borderBottomColor: '#000000' }}>
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-[11pt]" style={{ color: '#000000' }}>{exp.company}</span>
                  <span className="text-[10pt]" style={{ color: '#000000' }}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                <div className="italic text-[10.5pt] mb-2" style={{ color: '#000000' }}>{exp.position}</div>
                {exp.description && renderBulletPoints(exp.description)}
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills Section */}
        {data.selectedRepos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[11pt] font-bold border-b border-black uppercase mb-3 tracking-wider pb-1" style={{ color: '#000000', borderBottomColor: '#000000' }}>
              Technical Skills
            </h2>
            <div className="text-[10pt] leading-snug" style={{ color: '#1f2937' }}>
              <span className="font-bold" style={{ color: '#000000' }}>Programming Languages: </span>
              {Array.from(new Set(data.selectedRepos.map(repo => repo.language).filter(lang => lang && lang !== "Unknown"))).join(", ")}
            </div>
          </div>
        )}

        {/* GitHub Projects Section */}
        {data.selectedRepos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[11pt] font-bold border-b border-black uppercase mb-3 tracking-wider pb-1" style={{ color: '#000000', borderBottomColor: '#000000' }}>
              Technical Projects
            </h2>
            {data.selectedRepos.map((repo) => (
              <div key={repo.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-[11pt]" style={{ color: '#000000' }}>{repo.name}</span>
                  <span className="text-[9.5pt] italic" style={{ color: '#000000' }}>{repo.language}</span>
                </div>
                <p className="text-[9.5pt] leading-snug" style={{ color: '#1f2937' }}>{repo.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Section */}
        {data.certificates.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[11pt] font-bold border-b border-black uppercase mb-3 tracking-wider pb-1" style={{ color: '#000000', borderBottomColor: '#000000' }}>
              Certificates & Achievements
            </h2>
            {data.certificates.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-[10.5pt]" style={{ color: '#000000' }}>{cert.name}</span>
                  <span className="text-[10pt]" style={{ color: '#000000' }}>{formatDate(cert.date)}</span>
                </div>
                <div className="text-[9.5pt]" style={{ color: '#1f2937' }}>
                  {cert.issuer} {cert.link && <span className="text-blue-700 ml-1">• {cert.link.replace(/^https?:\/\//, '')}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
