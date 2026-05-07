"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const DEFAULT_MODEL = process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL || "google/gemini-2.0-flash-001";

async function openRouterRequest(prompt: string, model: string = DEFAULT_MODEL) {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is missing on the server.");
    throw new Error("AI service is currently unavailable. Please configure the API key.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

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
    console.error("OpenRouter request failed:", error.message || error);
    throw new Error(`AI service failed: ${error.message}`);
  }
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

export async function searchJobsAction(role: string, location: string = "Worldwide") {
  const prompt = `
    You are a real-time job market analyzer. Based on your knowledge of the current job market as of May 2026, find and return 5 REALISTIC and ACTIVE job openings for the role: "${role}" in "${location}".
    
    CRITICAL INSTRUCTIONS:
    1. DO NOT invent fake companies or generic job descriptions. 
    2. Use real companies known for hiring this role in "${location}".
    3. The "applyLink" MUST be a Smart-Link search URL to ensure the job is ALWAYS ACTIVE and AVAILABLE for applying.
       Format: "https://www.linkedin.com/jobs/search/?keywords=[Job-Title]%20[Company-Name]&location=[Location]&f_TPR=r2592000&sortBy=DD"
       - f_TPR=r2592000: Filters for jobs posted in the last 30 days.
       - sortBy=DD: Sorts by most recent first.
       - DO NOT use "Easy Apply" filters (f_AL) by default unless you are 100% sure it is available, as it often filters out real jobs from major companies like Accenture.
       Example: "https://www.linkedin.com/jobs/search/?keywords=Frontend%20Developer%20Accenture&location=Manila&f_TPR=r2592000&sortBy=DD"
    4. Ensure the jobs are "Open for hire" or "Available for applying only". Avoid niche or one-off roles that expire quickly.
    5. Prioritize high-volume hiring companies (e.g., tech giants, large enterprises, well-funded startups) to ensure link reliability.
    6. Ensure the skills listed for each job are the actual industry-standard requirements for that specific company and role.

    For each job, provide:
    - id (unique string)
    - title (Real Job Title)
    - company (Real Company Name)
    - location (Actual typical office location or Remote)
    - experience (e.g., Entry-level, Mid-Senior level)
    - description (Concise real-world summary)
    - skills (Real required technical skills)
    - applyLink (The Smart-Link search URL as defined above)

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
  return openRouterRequest(prompt);
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
