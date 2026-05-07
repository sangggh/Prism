"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const DEFAULT_MODEL = process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL || "google/gemini-2.0-flash-001";

type OpenRouterContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data?: string; fileData?: string } };

type OpenRouterMessage = {
  role: "user" | "system" | "assistant";
  content: string | OpenRouterContentPart[];
};

async function openRouterRequest(
  promptOrMessages: string | OpenRouterMessage[],
  model: string = DEFAULT_MODEL,
  extraBody: Record<string, unknown> = {},
  timeoutMs = 45000
) {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is missing on the server.");
    throw new Error("AI service is currently unavailable. Please configure the API key.");
  }

  try {
    const response = await fetchWithTimeout(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: typeof promptOrMessages === "string" ? [{ role: "user", content: promptOrMessages }] : promptOrMessages,
          response_format: { type: "json_object" },
          ...extraBody,
        }),
      },
      timeoutMs
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      throw new Error(data.error.message || "Unknown API Error");
    }

    if (!data.choices || data.choices.length === 0) {
      console.error("Unexpected API Response:", data);
      throw new Error("No response generated from AI model.");
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new Error("AI service timed out. Try cropping the image closer to the certificate text.");
    }
    console.error("OpenRouter request failed:", error.message || error);
    throw new Error(`AI service failed: ${error.message}`);
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function normalizeCertificateResult(result: any, fallbackLink = "") {
  const certificate = result?.certificate ?? result ?? {};
  return {
    certificate: {
      name: typeof certificate.name === "string" ? certificate.name : "",
      issuer: typeof certificate.issuer === "string" ? certificate.issuer : "",
      date: normalizeDate(certificate.date),
      link: typeof certificate.link === "string" && certificate.link ? certificate.link : fallbackLink,
      description: typeof certificate.description === "string" ? certificate.description : "",
      category: typeof certificate.category === "string" ? certificate.category : "unknown",
      skills: Array.isArray(certificate.skills) ? certificate.skills.filter((skill: unknown) => typeof skill === "string") : [],
      confidence: typeof certificate.confidence === "number" ? certificate.confidence : 0,
    },
  };
}

function normalizeText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeJobTitle(title: string, company: string, requestedRole: string) {
  const fallbackTitle = normalizeText(requestedRole, "Software Developer");
  let normalizedTitle = normalizeText(title, fallbackTitle);

  if (company) {
    const companyPattern = escapeRegExp(company);
    normalizedTitle = normalizedTitle
      .replace(new RegExp(`\\s+(?:at|for|with)\\s+${companyPattern}\\b`, "i"), "")
      .replace(new RegExp(`\\b${companyPattern}\\s+`, "i"), "")
      .replace(new RegExp(`\\s+${companyPattern}\\b`, "i"), "");
  }

  return normalizedTitle
    .replace(/\s+/g, " ")
    .replace(/\s+[-|,]\s*$/g, "")
    .trim() || fallbackTitle;
}

function buildLinkedInJobSearchUrl(title: string, company: string, location: string) {
  const keywords = normalizeJobTitle(title, company, title);
  const params = new URLSearchParams({
    keywords: keywords || "Software Developer",
    location: location || "Worldwide",
    sortBy: "DD",
  });

  return `https://www.linkedin.com/jobs/search/?${params.toString()}`;
}

function normalizeJobsResult(result: any, requestedRole: string, requestedLocation: string) {
  const jobs = Array.isArray(result?.jobs) ? result.jobs : [];
  return {
    jobs: jobs
      .map((job: any, index: number) => {
        const company = normalizeText(job?.company, "");
        const title = normalizeJobTitle(job?.title, company, requestedRole);
        const location = normalizeText(job?.location, requestedLocation);
        const safeIdSource = `${title}-${company || "company"}-${location}-${index}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        return {
          id: normalizeText(job?.id, safeIdSource || `job-${index + 1}`),
          title,
          company: company || "Company hiring on LinkedIn",
          location,
          experience: normalizeText(job?.experience, "Not specified"),
          description: normalizeText(job?.description, `LinkedIn search for ${title}${company ? ` at ${company}` : ""}.`),
          skills: Array.isArray(job?.skills)
            ? job.skills.filter((skill: unknown) => typeof skill === "string" && skill.trim()).map((skill: string) => skill.trim())
            : [],
          applyLink: buildLinkedInJobSearchUrl(title, company, location),
        };
      })
      .slice(0, 5),
  };
}

export async function extractSkillsFromTextAction(text: string) {
  const prompt = `
    Extract a comprehensive list of technical skills, tools, and technologies from the following resume text.
    Resume Text:
    ${text}

    Format the response as a JSON object:
    {
      "skills": ["Skill 1", "Skill 2", ...]
    }
  `;
  return openRouterRequest(prompt);
}

export async function analyzeCertificateEvidenceAction(input: {
  sourceType: "file" | "url";
  url?: string;
  filename?: string;
  mimeType?: string;
  dataUrl?: string;
}) {
  const prompt = `Read this certificate or achievement image/PDF for a resume.
    Extract a short title, issuer, date, and category only. Missing fields must be empty strings.
    Date must be YYYY-MM-DD when possible.
    Return JSON only:
    {
      "certificate": {
        "name": "",
        "issuer": "",
        "date": "YYYY-MM-DD",
        "link": "",
        "description": "",
        "category": "certificate | participation | award | course | workshop | competition | unknown",
        "skills": [],
        "confidence": 0.0
      }
    }`;

  const content: OpenRouterContentPart[] = [{ type: "text", text: prompt }];
  const fallbackLink = input.sourceType === "url" ? input.url?.trim() || "" : "";
  let needsPdfParser = false;
  let isImageInput = false;

  if (input.sourceType === "file") {
    if (!input.dataUrl || !input.filename || !input.mimeType) {
      throw new Error("Please provide a PDF or image file to scan.");
    }

    if (input.mimeType === "application/pdf") {
      needsPdfParser = true;
      content.push({
        type: "file",
        file: {
          filename: input.filename,
          file_data: input.dataUrl,
        },
      });
    } else if (input.mimeType.startsWith("image/")) {
      isImageInput = true;
      content.push({
        type: "image_url",
        image_url: { url: input.dataUrl },
      });
    } else {
      throw new Error("Unsupported file type. Upload a PDF or image.");
    }
  } else {
    const url = input.url?.trim();
    if (!url) throw new Error("Please enter a URL to scan.");

    content.push({ type: "text", text: `Credential URL: ${url}` });

    if (/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url)) {
      isImageInput = true;
      content.push({ type: "image_url", image_url: { url } });
    } else if (/\.pdf(\?.*)?$/i.test(url)) {
      needsPdfParser = true;
      content.push({
        type: "file",
        file: {
          filename: "credential.pdf",
          file_data: url,
        },
      });
    } else {
      try {
        const response = await fetchWithTimeout(url, {
          headers: {
            "User-Agent": "Prism Resume Builder credential scanner",
          },
        });
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/pdf")) {
          needsPdfParser = true;
          content.push({
            type: "file",
            file: {
              filename: "credential.pdf",
              file_data: url,
            },
          });
        } else if (contentType.startsWith("image/")) {
          isImageInput = true;
          content.push({ type: "image_url", image_url: { url } });
        } else {
          const html = await response.text();
          const pageText = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .slice(0, 12000);

          content.push({
            type: "text",
            text: `Credential page text:\n${pageText}`,
          });
        }
      } catch {
        content.push({
          type: "text",
          text: "The page could not be fetched by the server. Infer what you can from the URL text only and keep confidence low.",
        });
      }
    }
  }

  const result = await openRouterRequest(
    [{ role: "user", content }],
    DEFAULT_MODEL,
    {
      max_tokens: 350,
      temperature: 0,
      ...(needsPdfParser
        ? {
            plugins: [
              {
                id: "file-parser",
                pdf: { engine: "mistral-ocr" },
              },
            ],
          }
        : {}),
    },
    isImageInput ? 12000 : 30000
  );

  return normalizeCertificateResult(result, fallbackLink);
}

export async function searchJobsAction(role: string, location: string = "Worldwide") {
  const prompt = `
    You are a real-time job market analyzer. Based on your knowledge of the current job market as of May 2026, find and return 5 REALISTIC and ACTIVE job openings for the role: "${role}" in "${location}".
    
    CRITICAL INSTRUCTIONS:
    1. DO NOT invent fake companies or generic job descriptions. 
    2. Use real companies known for hiring this role in "${location}".
    3. Do not provide direct LinkedIn /jobs/view/ URLs, because expired or invented job IDs open the wrong job or a "job not found" page.
       The server will generate the final LinkedIn search URL from the title, company, and location.
    4. Ensure the jobs are "Open for hire" or "Available for applying only". Avoid niche or one-off roles that expire quickly.
    5. Prioritize high-volume hiring companies (e.g., tech giants, large enterprises, well-funded startups) to ensure link reliability.
    6. Ensure the skills listed for each job are the actual industry-standard requirements for that specific company and role.

    For each job, provide:
    - id (unique string)
    - title (Real Job Title only; do not include the company name or phrases like "at Company" / "for Company")
    - company (Real Company Name)
    - location (Actual typical office location or Remote)
    - experience (e.g., Entry-level, Mid-Senior level)
    - description (Concise real-world summary)
    - skills (Real required technical skills)
    - applyLink (leave empty; the server will generate it)

    Format the response as a JSON object:
    {
      "jobs": [
        {
          "id": "...",
          "title": "...",
          "company": "...",
          "location": "...",
          "experience": "...",
          "description": "...",
          "skills": ["...", "..."],
          "applyLink": "..."
        }
      ]
    }
  `;
  const result = await openRouterRequest(prompt);
  return normalizeJobsResult(result, role, location);
}

export async function analyzeSkillGapAction(resumeSkills: string[], jobSkills: string[]) {
  const prompt = `
    Compare the following resume skills with the job's required skills.
    User Skills: ${resumeSkills.join(", ")}
    Job Required Skills: ${jobSkills.join(", ")}

    Please provide:
    1. "completed": List of required skills that the user ALREADY possesses (found in resume).
    2. "missing": List of required skills that are MISSING from the resume.
    3. For each missing skill, provide 2-3 specific sub-topics or foundational concepts that need to be learned.
    4. A brief explanation of why these gaps are important for this specific job.
    5. Personalized learning recommendations for each missing skill.
    6. At least 2 specific "Mastery Projects" that the user can build to demonstrate proficiency in these missing skills.

    Format the response as a JSON object:
    {
      "completed": ["skill1", "skill2"],
      "missing": [
        { "skill": "skill3", "subtopics": ["topic1", "topic2"] },
        { "skill": "skill4", "subtopics": ["topic3", "topic4"] }
      ],
      "explanation": "Brief explanation...",
      "recommendations": [
        { "skill": "skill3", "action": "Take course X...", "resource": "link/description" }
      ],
      "projects": [
        { "title": "Project Name", "description": "What to build...", "techStack": ["skill3", "skill4"] }
      ]
    }
  `;
  return openRouterRequest(prompt);
}
