import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey || "dummy" });

export const getAIStudyPlan = async (weakTopics: string[]): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure environment variables.";
  
  try {
    const prompt = `Create a 3-day micro study plan for a student weak in: ${weakTopics.join(', ')}. Keep it concise, motivational, and bulleted.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate plan.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI service temporarily unavailable.";
  }
};

export const generateTodayStudyTask = async (examType: string, subject: string, lastScore: number, timeAvailable: number): Promise<string> => {
  const fallbackResponse = `TODAY’S TASK:
- Subject: ${subject}
- Total time: ${timeAvailable} mins
- What to do:
  * Review basic formulas for 10 mins
  * Solve 5 easy problems from previous years
  * Read the summary of the last chapter

STOP RULE:
- Stop when you complete the 5 problems.

ONE LINE MESSAGE:
- You got this, just one small step today.`;

  if (!apiKey) return fallbackResponse;

  try {
    const prompt = `You are a Study Task Generator for students in Bangladesh.

Your job is to generate ONLY today’s study tasks.
Do NOT plan for future days.
Do NOT explain concepts.
Do NOT motivate too much.

Your goal:
- Remove confusion
- Reduce pressure
- Give a small, doable study task for today only

Context:
- Exam type: ${examType}
- Subject: ${subject}
- Last quiz score: ${lastScore}%
- Available time today: ${timeAvailable} minutes

RULES:
1. If last score < 40%, give EASY tasks.
2. If last score 40–70%, give MEDIUM tasks.
3. If last score > 70%, give MIXED tasks.
4. Total study time must NOT exceed available time.
5. Tasks must feel easy to start.
6. Use simple language.

OUTPUT FORMAT (STRICT):

TODAY’S TASK:
- Subject:
- Total time:
- What to do (bullet points):

STOP RULE:
- When to stop studying today

ONE LINE MESSAGE:
- (Calm, pressure-free)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || fallbackResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallbackResponse;
  }
};

export const getDetailedExplanation = async (question: string, answer: string): Promise<string> => {
  if (!apiKey) return "Explanation unavailable (API Key missing).";

  try {
    const prompt = `Explain why '${answer}' is the correct answer to the question: '${question}'. Keep it simple for a high school student. Max 2 sentences.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Explanation not found.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not fetch AI explanation.";
  }
};

export const generateDashboardInsights = async (userPerformance: any): Promise<string> => {
  if (!apiKey) {
    return "Based on your recent scores, you're excelling in Algebra but struggling with Organic Chemistry. Let's focus on Reaction Mechanisms today!";
  }
  
  try {
     const prompt = `Analyze this student data: ${JSON.stringify(userPerformance)}. Give a 1-sentence motivating insight and a topic to focus on.`;
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
     });
     return response.text || "Keep up the great work! Try a new quiz today.";
  } catch (error) {
      return "Based on your recent scores, you're excelling in Algebra but struggling with Organic Chemistry. Let's focus on Reaction Mechanisms today!";
  }
};

export const generateCVSummary = async (jobTitle: string, skills: string): Promise<string> => {
    if (!apiKey) return "Passionate professional looking for new opportunities. (AI unavailable)";

    try {
        const prompt = `Write a professional, concise CV summary (max 50 words) for a ${jobTitle} with skills in ${skills}. Use an active voice and professional tone.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Experienced professional seeking to leverage skills in a new role.";
    } catch (error) {
        return "Experienced professional seeking to leverage skills in a new role.";
    }
};

export const enhanceCVDescription = async (text: string): Promise<string> => {
    if (!apiKey) return text;
    try {
        const prompt = `Rewrite the following job description bullet point to be more professional, action-oriented, and impactful for a CV: "${text}". Keep it one sentence.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || text;
    } catch (error) {
        return text;
    }
};export const generateDynamicStudyRoutine = async (exam: string, daysLeft: string, dailyHours: string, weakSubjects: string, previousRoutine: any[] = [], mistakes: any[] = []): Promise<any> => {
  if (!apiKey) return null;

  try {
    let performanceContext = "";
    if (previousRoutine && previousRoutine.length > 0) {
      const completed = previousRoutine.filter(t => t.done).length;
      const total = previousRoutine.length;
      const incompleteTasks = previousRoutine.filter(t => !t.done).map(t => t.task || t.title).join(", ");
      
      performanceContext += `\n[PREVIOUS DAY PERFORMANCE]\nThe student completed ${completed} out of ${total} tasks yesterday.\nTasks they FAILED to complete: ${incompleteTasks || "None"}.\nPlease adjust today's plan based on this performance. If they missed important subjects, prioritize them today.`;
    }

    if (mistakes && mistakes.length > 0) {
      const unresolved = mistakes.filter(m => !m.resolved);
      if (unresolved.length > 0) {
         const subjectCounts: Record<string, number> = {};
         unresolved.forEach(m => {
            subjectCounts[m.subject] = (subjectCounts[m.subject] || 0) + 1;
         });
         const weakAreas = Object.entries(subjectCounts).map(([sub, count]) => `${sub} (${count} recent quiz mistakes)`).join(", ");
         performanceContext += `\n\n[MOCK TEST PERFORMANCE]\nThe student took quizzes recently and made mistakes in these subjects: ${weakAreas}. You MUST allocate specific time in today's routine to revise these exact subjects to fix their weaknesses.`;
      }
    }

    const prompt = `You are an AI Study Tutor for a student in Bangladesh. 
The student is preparing for: ${exam}. 
Days left: ${daysLeft}. 
Daily study hours: ${dailyHours}. 
Weak subjects identified by student: ${weakSubjects}.
${performanceContext}

Create a structured study routine for TODAY ONLY.
Divide the daily hours into logical sessions (morning, afternoon, evening).
Include specific activities like "20 MCQ practice" or "Weak topic revision".

Output ONLY a valid JSON array of objects with this exact structure:
[
  { 
    "id": "rt-1", 
    "task": "Bangla - 30 min (Topic details)", 
    "subject": "Bangla", 
    "timeSlot": "morning", 
    "timeDisplay": "09:00 AM - 09:30 AM", 
    "done": false, 
    "priority": "high", 
    "day": "Saturday" 
  }
]
Note: timeSlot MUST BE exactly "morning", "afternoon", or "evening". Priority MUST BE "high", "medium", or "low".`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    let text = response.text || "[]";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error generating routine:", error);
    return null;
  }
};export const generateWeaknessReport = async (mistakes: any[] = []): Promise<any> => {
  if (!apiKey) return null;

  try {
    let mistakeContext = "The student hasn't made any recorded mistakes yet. Just give general advice.";
    if (mistakes && mistakes.length > 0) {
      const unresolved = mistakes.filter(m => !m.resolved);
      if (unresolved.length > 0) {
         const subjectCounts: Record<string, number> = {};
         unresolved.forEach(m => {
            subjectCounts[m.subject] = (subjectCounts[m.subject] || 0) + 1;
         });
         const weakAreas = Object.entries(subjectCounts).map(([sub, count]) => `${sub} (${count} recent mistakes)`).join(", ");
         mistakeContext = `The student has unresolved mistakes in these subjects: ${weakAreas}. 
         They also made mistakes on these specific questions: ${unresolved.map(m => m.questionText).slice(0, 5).join(" | ")}`;
      }
    }

    const prompt = `You are an expert AI Study Analyzer.
Analyze the student's mistake data:
${mistakeContext}

Based on this, generate a personalized weakness report. 
Determine the absolute weakest subject, calculate an estimated percentage of score they are losing because of this subject (e.g., 15, 23), and list exactly 5 specific sub-topics they must study to fix this weakness.

Output ONLY a valid JSON object with this exact structure:
{
  "weakestSubject": "Math",
  "scoreLoss": 23,
  "insightMessage": "Math is costing you 23% of your potential score.",
  "topicsToFix": ["Percentage", "Profit & Loss", "Ratio", "Algebra", "Geometry"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });
    
    let text = response.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error generating weakness report:", error);
    return null;
  }
};