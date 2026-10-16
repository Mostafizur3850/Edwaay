import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: apiKey });
const ACTIVE_MODEL = 'gemini-3.5-flash-lite';
const BACKUP_MODEL = 'gemini-3.1-flash-lite';

export const getAIStudyPlan = async (weakTopics: string[]): Promise<string> => {
  try {
    const prompt = `Create a 3-day micro study plan for a student weak in: ${weakTopics.join(', ')}. Keep it concise, motivational, and bulleted.`;
    
    const response = await ai.models.generateContent({
      model: ACTIVE_MODEL,
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
      model: ACTIVE_MODEL,
      contents: prompt,
    });

    return response.text || fallbackResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallbackResponse;
  }
};

export const getDetailedExplanation = async (question: string, answer: string): Promise<string> => {
  try {
    const prompt = `Explain why '${answer}' is the correct answer to the question: '${question}'. Keep it simple for a high school student. Max 2 sentences.`;
    
    const response = await ai.models.generateContent({
      model: ACTIVE_MODEL,
      contents: prompt,
    });
    
    return response.text || "Explanation not found.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not fetch AI explanation.";
  }
};

export const generateDashboardInsights = async (userPerformance: any): Promise<string> => {
  try {
     const prompt = `Analyze this student data: ${JSON.stringify(userPerformance)}. Give a 1-sentence motivating insight and a topic to focus on.`;
     const response = await ai.models.generateContent({
        model: ACTIVE_MODEL,
        contents: prompt
     });
     return response.text || "Keep up the great work! Try a new quiz today.";
  } catch (error) {
      return "Based on your recent scores, you're excelling in Algebra but struggling with Organic Chemistry. Let's focus on Reaction Mechanisms today!";
  }
};

export const generateCVSummary = async (jobTitle: string, skills: string): Promise<string> => {
    try {
        const prompt = `Write a professional, concise CV summary (max 50 words) for a ${jobTitle} with skills in ${skills}. Use an active voice and professional tone.`;
        const response = await ai.models.generateContent({
            model: ACTIVE_MODEL,
            contents: prompt
        });
        return response.text || "Experienced professional seeking to leverage skills in a new role.";
    } catch (error) {
        return "Experienced professional seeking to leverage skills in a new role.";
    }
};

export const enhanceCVDescription = async (text: string): Promise<string> => {
    try {
        const prompt = `Rewrite the following job description bullet point to be more professional, action-oriented, and impactful for a CV: "${text}". Keep it one sentence.`;
        const response = await ai.models.generateContent({
            model: ACTIVE_MODEL,
            contents: prompt
        });
        return response.text || text;
    } catch (error) {
        return text;
    }
};

// Fallback routine generator that creates intelligent, personalized tasks tailored to user's exam and weaknesses
function generateFallbackRoutine(promptText: string, exam: string, daysLeft: string, dailyHours: string, weakSubjects: string): { advice: string; tasks: any[] } {
  const combined = `${promptText} ${exam} ${weakSubjects}`.toLowerCase();
  const isBCS = combined.includes('bcs') || combined.includes('বিসিএস');
  const isAdmission = combined.includes('admission') || combined.includes('ভর্তি');
  const hasMathWeakness = combined.includes('গণিত') || combined.includes('math') || combined.includes('যুক্তির');
  const hasEnglishWeakness = combined.includes('ইংরেজি') || combined.includes('english');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  if (isBCS) {
    const list: any[] = [];
    if (hasMathWeakness) {
      list.push({
        id: `rt-${Date.now()}-1`,
        task: 'গাণিতিক যুক্তি: শতকরা, অনুপাত ও লাভ-ক্ষতির মৌলিক সূত্রাবলি এবং বিসিএস প্রিলির বিগত বছরের ১০টি প্রশ্ন সমাধান',
        subject: 'গাণিতিক যুক্তি',
        timeSlot: 'morning',
        timeDisplay: '০৭:৩০ AM - ০৯:০০ AM',
        done: false,
        priority: 'high',
        day: todayName
      });
    } else {
      list.push({
        id: `rt-${Date.now()}-1`,
        task: 'বাংলা সাহিত্য: প্রাচীন ও মধ্যযুগ (চর্যাপদ, মঙ্গলকাব্য) গুরুত্বপূর্ণ প্রশ্ন ও টীকা রিভিশন',
        subject: 'বাংলা সাহিত্য',
        timeSlot: 'morning',
        timeDisplay: '০৮:০০ AM - ০৯:৩০ AM',
        done: false,
        priority: 'high',
        day: todayName
      });
    }

    if (hasEnglishWeakness) {
      list.push({
        id: `rt-${Date.now()}-2`,
        task: 'English Language: Right Forms of Verbs, Subject-Verb Agreement ও ১৫টি Daily Vocabulary অনুশীলন',
        subject: 'English',
        timeSlot: 'afternoon',
        timeDisplay: '০৩:৩০ PM - ০৪:৪৫ PM',
        done: false,
        priority: 'high',
        day: todayName
      });
    } else {
      list.push({
        id: `rt-${Date.now()}-2`,
        task: 'সাধারণ বিজ্ঞান ও তথ্যপ্রযুক্তি: তথ্য ও যোগাযোগ প্রযুক্তির ২০টি বিগত বছরের বিসিএস MCQ সলভ',
        subject: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
        timeSlot: 'afternoon',
        timeDisplay: '০৩:০০ PM - ০৪:১৫ PM',
        done: false,
        priority: 'medium',
        day: todayName
      });
    }

    list.push({
      id: `rt-${Date.now()}-3`,
      task: 'বাংলাদেশ বিষয়াবলি: সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদ ও মুক্তিযুদ্ধ ভিত্তিক বিসিএস প্রশ্ন রিভিশন',
      subject: 'বাংলাদেশ বিষয়াবলি',
      timeSlot: 'evening',
      timeDisplay: '০৮:০০ PM - ০৯:০০ PM',
      done: false,
      priority: 'high',
      day: todayName
    });

    const advice = `🎯 বিসিএস পরীক্ষার বিশেষ স্টাডি গাইডলাইন ও অ্যানালাইসিস:
আপনার বিসিএস প্রিলিমিনারি পরীক্ষার বাকি ১২০ দিন। প্রতিদিন ৩ ঘণ্টা সময় হাতে রেখেও পরিকল্পিত অধ্যয়ন করলে প্রিলিমিনারি নিশ্চিত করা সম্ভব।

📌 মূল সুপারিশসমূহ:
১. গণিত প্রস্তুতি (সকালে ১.৫ ঘণ্টা): সকালে ফ্রেশ মাইন্ডে পাটিগণিত ও বীজগণিতের মৌলিক সূত্রাবলি লিখে বুঝে সমাধান করুন। বিগত ১০ম থেকে ৪৬তম বিসিএস-এর প্রশ্নসমূহ ব্যাখ্যাসহ অনুশীলন করুন।
২. ইংরেজি প্রস্তুতি (বিকেলে ১ ঘণ্টা): Grammar-এর রুলস পড়ার পর অন্তত ২০টি করে বিগত বছরের প্রশ্ন সলভ করুন। প্রতিদিন সকালে ও বিকেলে ১০-১৫টি নতুন Vocabulary নোট করুন।
৩. রিভিশন ও সাধারণ জ্ঞান (রাতে ৩০ মিনিট): সারাদিনে যা পড়লেন তা রাতে একবার চোখ বুলিয়ে রিভিশন দিন এবং বাংলাদেশ বিষয়ের গুরুত্বপূর্ণ সাল ও ঘটনাগুলো নোট রাখুন।`;

    return { advice, tasks: list };
  }

  if (isAdmission) {
    return {
      advice: `🎯 ভার্সিটি ভর্তি পরীক্ষা স্টাডি স্ট্র্যাটেজি:
প্রতিদিন ৩ ঘণ্টা সময়কে সর্বোচ্চ ব্যবহার করতে বিজ্ঞান বিভাগের মৌলিক বিষয়গুলোতে বেশি জোর দেওয়া হয়েছে। সকাল ও বিকেলে গণিত ও বিজ্ঞানের কঠিন প্রশ্নগুলো সমাধান করুন।`,
      tasks: [
        {
          id: `rt-${Date.now()}-1`,
          task: 'পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর ও গতিবিদ্যা গাণিতিক সমস্যাবলি সমাধান',
          subject: 'পদার্থবিজ্ঞান',
          timeSlot: 'morning',
          timeDisplay: '০৮:০০ AM - ০৯:৩০ AM',
          done: false,
          priority: 'high',
          day: todayName
        },
        {
          id: `rt-${Date.now()}-2`,
          task: 'রসায়ন ১ম পত্র: গুণগত রসায়ন ও মৌলের পর্যায়বৃত্ত ধর্ম MCQ টেস্ট',
          subject: 'রসায়ন',
          timeSlot: 'afternoon',
          timeDisplay: '০২:৩০ PM - ০৪:০০ PM',
          done: false,
          priority: 'high',
          day: todayName
        },
        {
          id: `rt-${Date.now()}-3`,
          task: 'উচ্চতর গণিত: ক্যালকুলাস ও ম্যাট্রিক্সের বিগত ৫ বছরের ঢাকা বিশ্ববিদ্যালয় প্রশ্ন সলভ',
          subject: 'উচ্চতর গণিত',
          timeSlot: 'evening',
          timeDisplay: '০৮:০০ PM - ০৯:৩০ PM',
          done: false,
          priority: 'medium',
          day: todayName
        }
      ]
    };
  }

  return {
    advice: `🎯 আপনার স্টাডি প্ল্যান ও পরামর্শ:
আপনার প্রম্পট অনুযায়ী দুর্বল বিষয়গুলোকে অগ্রাধিকার দিয়ে এবং ৩ ঘণ্টার প্রতিদিনের সময়কে সকালে, বিকেলে ও রাতে বিভক্ত করে এই ভারসাম্যপূর্ণ রুটিনটি তৈরি করা হলো।`,
    tasks: [
      {
        id: `rt-${Date.now()}-1`,
        task: 'প্রধান দুর্বল বিষয়ের মৌলিক অধ্যায় রিভিশন ও গুরুত্বপূর্ণ নোটস পড়া',
        subject: hasMathWeakness ? 'গণিত' : 'বাংলা',
        timeSlot: 'morning',
        timeDisplay: '০৮:৩০ AM - ১০:০০ AM',
        done: false,
        priority: 'high',
        day: todayName
      },
      {
        id: `rt-${Date.now()}-2`,
        task: 'ইংরেজি ব্যাকরণ ও ২০টি গুরুত্বপূর্ণ শব্দভাণ্ডার অনুশীলন',
        subject: 'English',
        timeSlot: 'afternoon',
        timeDisplay: '০৩:০০ PM - ০৪:১৫ PM',
        done: false,
        priority: 'high',
        day: todayName
      },
      {
        id: `rt-${Date.now()}-3`,
        task: 'বিগত বছরের প্রশ্নব্যাংক থেকে ৫০টি MCQ সলভ ও ভুল বিশ্লেষণ',
        subject: 'সাধারণ জ্ঞান',
        timeSlot: 'evening',
        timeDisplay: '০৮:০০ PM - ০৯:৩০ PM',
        done: false,
        priority: 'medium',
        day: todayName
      }
    ]
  };
}

export const generateDynamicStudyRoutine = async (
  exam: string,
  daysLeft: string,
  dailyHours: string,
  weakSubjects: string,
  previousRoutine: any[] = [],
  mistakes: any[] = []
): Promise<{ advice: string; tasks: any[] }> => {
  const userQuery = exam || "আমার পরীক্ষার জন্য একটি পড়ার রুটিন তৈরি করে দাও";
  
  const prompt = `You are a high-speed, intelligent AI Study Tutor in Bangladesh, just like ChatGPT and Gemini.
The student has asked you this specific question or provided this study goal:
"${userQuery}"

Your task is to provide an authentic, direct, helpful, and highly personalized response in Bengali specifically answering the student's question, followed by 3-4 actionable study tasks.

Respond ONLY with a valid JSON object matching this schema:
{
  "advice": "শিক্ষার্থীর নির্দিষ্ট প্রশ্নের সরাসরি বিস্তারিত বাংলা উত্তর, পরামর্শ ও কৌশল...",
  "tasks": [
    {
      "id": "rt-1",
      "task": "নির্দিষ্ট পড়ার টাস্ক",
      "subject": "বিষয়",
      "timeSlot": "morning",
      "timeDisplay": "০৮:০০ AM - ০৯:৩০ AM",
      "done": false,
      "priority": "high",
      "day": "Saturday"
    }
  ]
}

Rules:
1. "advice" MUST specifically answer what the student asked (do NOT repeat a generic template).
2. "tasks" MUST be an array of 3 or 4 relevant tasks.
3. timeSlot MUST be "morning", "afternoon", or "evening".
4. Output raw JSON only. Do not wrap in markdown or backticks.`;

  // Try ACTIVE_MODEL (gemini-3.5-flash-lite) first, then fallback to BACKUP_MODEL (gemini-3.1-flash-lite)
  for (const modelToUse of [ACTIVE_MODEL, BACKUP_MODEL]) {
    try {
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
      });

      let text = response.text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }

      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        const finalAdvice = parsed.advice || "";
        const rawTasks = Array.isArray(parsed.tasks) ? parsed.tasks : (Array.isArray(parsed) ? parsed : []);

        const normalizedTasks = rawTasks.map((t: any, idx: number) => {
          let slot = t.timeSlot;
          if (slot === 'night') slot = 'evening';
          if (!['morning', 'afternoon', 'evening'].includes(slot)) slot = 'morning';
          return {
            id: t.id || `rt-ai-${Date.now()}-${idx}`,
            task: t.task || t.title || "স্টাডি সেশন",
            subject: t.subject || "সাধারণ",
            timeSlot: slot,
            timeDisplay: t.timeDisplay || "০৮:০০ AM - ০৯:৩০ AM",
            done: false,
            priority: t.priority || "high",
            day: t.day || "Saturday"
          };
        });

        if (finalAdvice) {
          return { advice: finalAdvice, tasks: normalizedTasks };
        }
      }
    } catch (error) {
      console.warn(`Gemini generation failed with ${modelToUse}:`, error);
    }
  }

  return generateFallbackRoutine(exam, exam, daysLeft, dailyHours, weakSubjects);
};

export const generateWeaknessReport = async (mistakes: any[] = []): Promise<any> => {
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
      model: ACTIVE_MODEL,
      contents: prompt,
    });
    
    let text = response.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error generating weakness report:", error);
    return {
      weakestSubject: "গণিত ও যুক্তি",
      scoreLoss: 20,
      insightMessage: "গণিত ও যুক্তিতে কিছু ভুলের কারণে প্রায় ২০% নম্বর কম আসছে।",
      topicsToFix: ["শতকরা ও লাভ-ক্ষতি", "অনুপাত", "বীজগণিত", "জ্যামিতি", "পরিমিতি"]
    };
  }
};