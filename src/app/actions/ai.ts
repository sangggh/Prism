"use server";

export async function analyzeSkillGapAction(resumeSkills: string[], roadmapSkills: string[]) {
  // Use non-public API key for security
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  const model = process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL || "google/gemini-2.0-flash-001";

  if (!apiKey) {
    console.error("OpenRouter API key is missing on the server.");
    throw new Error("AI analysis is currently unavailable. Please configure the API key.");
  }

  const prompt = `
    Compare the following resume skills with the roadmap skills.
    Resume Skills: ${resumeSkills.join(", ")}
    Roadmap Skills: ${roadmapSkills.join(", ")}

    Please provide:
    1. A list of skills present in the roadmap but missing from the resume (Skill Gaps).
    2. For each missing skill, provide 2-3 specific sub-topics or foundational concepts that need to be learned.
    3. A brief explanation of why these gaps are important for the target role.
    4. Personalized learning recommendations for each missing skill.
    5. At least 2 specific "Mastery Projects" that the user can build to demonstrate proficiency in these missing skills.

    Format the response as a JSON object:
    {
      "gaps": [
        { "skill": "skill1", "subtopics": ["topic1", "topic2"] },
        { "skill": "skill2", "subtopics": ["topic3", "topic4"] }
      ],
      "explanation": "Brief explanation...",
      "recommendations": [
        { "skill": "skill1", "action": "Take course X...", "resource": "link/description" }
      ],
      "projects": [
        { "title": "Project Name", "description": "What to build...", "techStack": ["skill1", "skill2"] }
      ]
    }
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
    console.error("AI Analysis failed:", error.message || error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
}
