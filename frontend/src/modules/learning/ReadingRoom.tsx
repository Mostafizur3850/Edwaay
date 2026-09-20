import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    BookOpen, 
    ChevronLeft, 
    ChevronRight, 
    Lock, 
    CheckCircle2, 
    Clock, 
    Target, 
    Zap, 
    FileText, 
    Trophy,
    ArrowRight,
    Search,
    Bookmark,
    Circle,
    Info,
    Layout
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface ReadingTopic {
    id: string;
    title: string;
    content: string;
    isRead: boolean;
}

interface DailyGoal {
    day: number;
    title: string;
    topics: ReadingTopic[];
    isCompleted: boolean;
    testPassed: boolean;
}

// High-Fidelity Subject Curriculum Database for Job, BCS, Admission, and HSC tracks
const SUBJECT_THEMES: Record<string, {
    days: string[];
    topics: string[][];
    contents: string[][];
    questions: { q: string; opts: string[]; correct: number }[];
}> = {
    'bangladesh affairs': {
        days: [
            "Ancient History & Heritage of Bengal",
            "Language Movement & Rise of Nationalist Spirit (1947-1952)",
            "The Strategic Liberation War of 1971",
            "The Constitution of Bangladesh & State Principles",
            "Economic Assets, Agriculture & Mega Projects"
        ],
        topics: [
            ["Pala & Sena Dynasties", "Ancient Archeological Sites (Mahasthangarh, Shalban Vihara)", "Sultanate Period & Independent Sultans"],
            ["State Language Movement of 1952", "United Front Elections of 1954", "The Historic Six-Point Program of 1966"],
            ["Proclamation of Independence & Mujibnagar Government", "11 Sectors and Guerrilla Strategy", "The War Victory, Surrender Document & Heroes"],
            ["Preamble & Fundamental Rights in the Constitution", "Key Amendments & Judicial Review", "Legislative & Executive Organs of State"],
            ["GDP Composition & Macroeconomic Trends", "Agriculture & Freshwater Fish Success", "Mega Infrastructure (Padma Bridge, Metro Rail, Deep Sea Port)"]
        ],
        contents: [
            [
                "The Pala Dynasty (750–1174 CE) represents Bengal's golden era, founded by Gopala to end centuries of matsyanyaya (chaos). Rulers like Dharmapala built great learning hubs. Archaeological excavations such as Mahasthangarh in Bogra (ancient Pundranagara) and Paharpur Somapura Mahavihara in Naogaon remain the most critical highlights of ancient Bengal's structural heritage.",
                "The independent Bengal Sultanate arose with Shamsuddin Ilyas Shah, who unified political borders under 'Shahi Bangalah'. During Mughal rule, subahdars like Shaista Khan developed thriving commerce and built classic Lalbagh Fort architecture.",
                "To succeed in BCS and executive job exams, students must familiarize themselves with historical trade routes, ancient archaeological discoveries, and key rulers."
            ],
            [
                "The partition of India in 1947 sparked instant controversies regarding Pakistan's national linguistic policies. In 1948, the 'Tamaddun Majlish' first organized protests in Dhaka demanding Bengali's co-official status.",
                "The movement culminated on February 21, 1952. Demonstrators bravely violated Section 144. Police firing martyred activists like Salam, Barkat, Rafiq, Jabbar, and Shafiur. This laid the cultural foundation for the inevitable birth of Bangladesh.",
                "Electoral progress followed via the 21-point manifesto of the Jukta Front in 1954, and Sheikh Mujibur Rahman's epochal Six-Point Charter of demands in 1966."
            ],
            [
                "Following the brutal crackdowns of Operation Searchlight on March 25, 1971, Bangladesh declared independence. The historic Mujibnagar Government officially took oath on April 17, 1971, at Baidyanathtala with Syed Nazrul Islam as Acting President.",
                "Under Commander-in-Chief General M.A.G. Osmani, the country was zoned into 11 distinct military sectors. Brave regular army brigades ('Gono Bahini') coordinated with local freedom fighters to launch effective guerrilla counter-offensives.",
                "The historic surrender on December 16, 1971, at Suhrawardy Udyan concluded the struggle. The state honoured seven supreme martyrs with the highest military award, 'Bir Sreshtho'."
            ],
            [
                "Adopted on November 4, 1972, and in effect since December 16, 1972, the Constitution of Bangladesh is the supreme legal framework. It defines four main pillars: Nationalism, Socialism, Democracy, and Secularism.",
                "Part III outlines fundamental freedoms. Basic provisions such as Article 27 (Equality before law), Article 28 (Non-discrimination), and Article 32 (Life and personal liberty) are primary question-bank anchors.",
                "Understanding constitutional amendments (including the 15th amendment) and legislative protocols is mandatory to score well in all civil service exams."
            ],
            [
                "The economic engine of Bangladesh is driven by RMG exports, agricultural growth, and high worker remittances. The 6.15-kilometer Padma Multipurpose Bridge, built entirely with self-funded treasury, has reshaped trade.",
                "In primary sectors, Bangladesh ranks high globally in inland fish cultivation and seasonal rice yield. Urban transport reached new heights with Dhaka's first elevated MRT Line-6 system.",
                "Keep close track of the latest national budget allocation figures, GDP growth targets, and active export partners for upcoming job and university entry tests."
            ]
        ],
        questions: [
            { q: "Where is the ancient archaeological site 'Somapura Mahavihara' located?", opts: ["Bogra", "Naogaon", "Comilla", "Rajshahi"], correct: 1 },
            { q: "When did the Mujibnagar Government formally take oath?", opts: ["April 10, 1971", "April 17, 1971", "March 26, 1971", "December 16, 1971"], correct: 1 },
            { q: "Which article of the constitution guarantees 'Equality before Law'?", opts: ["Article 27", "Article 28", "Article 29", "Article 31"], correct: 0 },
            { q: "Who was the chief designer of the national flag of Bangladesh?", opts: ["Kamrul Hasan", "Hamidur Rahman", "Zainul Abedin", "Mustafa Monwar"], correct: 0 },
            { q: "The Padma Multipurpose Bridge connects which two districts?", opts: ["Munshiganj and Shariatpur", "Dhaka and Madaripur", "Munshiganj and Madaripur", "Narayanganj and Shariatpur"], correct: 0 }
        ]
    },
    'international affairs': {
        days: [
            "Global Geopolitics & Regional Border Disputes",
            "Universal International Organizations & Alliances",
            "Historical Conflict Resolution & Famous Peace Treaties",
            "Global Ecological Conventions & Climate Alliances",
            "Global Market Trading Councils & Strategic Maritime Straits"
        ],
        topics: [
            ["Polarity in World Order (Bipolar vs Multipolar)", "The Choke Points & Seas (Black Sea, South China Sea)", "Middle East Border Dynamics & Diplomacy"],
            ["The United Nations & Specialized Agencies (WHO, UNESCO)", "Bretton Woods System (IMF, World Bank)", "Regional Alliances (EU, ASEAN, BRICS, SAARC)"],
            ["The Peace of Westphalia (1648)", "The Treaty of Versailles (1919)", "Geneva Conventions & Humanitarian Protocol"],
            ["Kyoto Protocol & COP Framework Agreements", "The Paris Agreement & Carbon Neutral Offsets", "Biodiversity Treaties & Green Climate Fund"],
            ["WTO Policies & Commercial Tariff Settlements", "NATO vs Historical Warsaw Pact", "Major Maritime Channels (Hormuz, Malacca, Suez Canal)"]
        ],
        contents: [
            [
                "Geopolitical systems measure how topography and geographical resources govern state foreign behaviors. The globally integrated trade economy is progressively shifting towards multipolarity.",
                "The South China Sea handles over one-third of global commercial shipping, which is why boundary claims in this naval zone provoke friction among Southeast Asian powers.",
                "Sovereignty limits, historic border agreements, and defense doctrines are the key focuses for competitive international affairs MCQs."
            ],
            [
                "The United Nations (UN) was established in 1945 to promote worldwide balance. It functions through six major agencies: General Assembly, Security Council, Secretariat, Economic and Social Council, ICJ, and Trusteeship Council.",
                "The Security Council includes five veto-holding permanent members (P5). Financial regulations are monitored by Bretton Woods structures (IMF and World Bank).",
                "Regional networks such as European Union (EU) and BRICS create strong collective development systems."
            ],
            [
                "The Peace of Westphalia (1648) created the modern template for national sovereign borders, formally putting an end to the Thirty Years' War.",
                "The Treaty of Versailles (1919) ended the state of war in World War I and conceptualized the primary League of Nations.",
                "The Geneva Conventions provide strict international guidelines for humane treatment during wartime, outlining safety parameters for wounded soldiers and non-combatants."
            ],
            [
                "Global climate councils seek to set limits on emissions to halt global warming. The Kyoto Protocol (1997) set the first mandatory gas limitation thresholds.",
                "The Paris Agreement (2015) bound participating states to enforce dynamic mitigation to target a warming envelope below 1.5°C.",
                "Green Climate Funds (GCF) act to transfer resources to developing territories to build local adaptive measures."
            ],
            [
                "The WTO regulates global commercial trading issues and maintains tariff rules globally to advocate for free-trade policies.",
                "Security blocks like NATO offer joint military protection. Global shipping depends on major corridors like the Strait of Malacca, Strait of Hormuz, and Suez Canal.",
                "Learning the locations and strategic control points of these physical waterways is vital to excel in BCS and Bank exams."
            ]
        ],
        questions: [
            { q: "How many permanent members hold Veto power in the UN Security Council?", opts: ["3", "5", "10", "15"], correct: 1 },
            { q: "The headquarters of the International Court of Justice (ICJ) is situated where?", opts: ["Geneva", "New York", "The Hague", "Brussels"], correct: 2 },
            { q: "In which year was the Treaty of Westphalia signed?", opts: ["1548", "1648", "1748", "1848"], correct: 1 },
            { q: "Which critical strait connects the Persian Gulf and the Gulf of Oman?", opts: ["Strait of Malacca", "Strait of Hormuz", "Bab-el-Mandeb", "Bosporus Strait"], correct: 1 },
            { q: "The headquarters of the European Union (EU) is located in which city?", opts: ["Paris", "Berlin", "Brussels", "Amsterdam"], correct: 2 }
        ]
    },
    'general knowledge': {
        days: [
            "Primary Physical Geography & Earth Systems",
            "Sovereigns, Capitals & Currency Systems",
            "Milestones of Civilization & Human History",
            "Universal Science & Key Space Explorations",
            "Global Environmental Milestones & Preservation Councils"
        ],
        topics: [
            ["Tectonic Movements & Mountain Systems", "Oceans, Rivers & Major Deserts", "Atmosphere Layers & Weather Systems"],
            ["Capitals of Major World Nations", "Leading International Currencies", "Sovereign Parliament Names (Diet, Knesset, etc.)"],
            ["Ancient Empires (Roman, Mesopotamian, Indus)", "Major Turning Points (Industrial Revolution)", "World War I & World War II Timelines"],
            ["Understanding Atoms & Fundamental Elements", "Solar System Dynamics & Kepler's Laws", "Great Milestones of Space Flight (Appollo, Hubble)"],
            ["Major Nature Preserves & UNESCO Heritage Sites", "Biodiversity Hotspots", "Global Conservation Alliances (WWF, IUCN)"]
        ],
        contents: [
            [
                "Physical geography covers mountains, tectonic arrangements, and weathering. Earth consists of major plates that move together, causing volcanic eruptions or deep oceanic trenches.",
                "Major global deserts (Sahara, Gobi) are typically formed in hot dry bands. Atmosphere layers include the troposphere (where weather occurs) and stratospheric ozone shields.",
                "In examinations, questions on continental borders, deepest lakes (Caspian, Baikal), and mountain ranges (Himalayas, Andes) appear frequently."
            ],
            [
                "Knowing capitals and currencies of major states is highly key. For example, Japan's parliament is the National Diet, and Israel's legislature is called the Knesset.",
                "Understanding the Eurozone framework and standard reserve currency allocations (like Dollar, Pound, Yen, Renminbi) is important.",
                "Civil service examinations regularly check parliament terminologies and recent changes in currency boards."
            ],
            [
                "Ancient civilization foundations sprouted by major fertile rivers (Nile, Tigris-Euphrates). The Industrial Revolution began in Britain in the late 18th century, transforming manufacture.",
                "World War I (1914–1918) and World War II (1939–1945) reformed international boundaries and led to the UN charter.",
                "Recurrent dates of treaties, revolutions, and major independence declarations occupy a large part of GK test sheets."
            ],
            [
                "Universal science involves elementary biology, chemistry, and physics laws. Elements are structured in the periodic chart by their atomic number.",
                "The solar system consists of eight planets. Kepler's planetary orbits follow ellipses. Space advancements like Sputnik (1957) and Apollo 11 (1969) highlight human achievements.",
                "Basic everyday scientific formulas (like photosynthesis) find high exposure in junior mock tests."
            ],
            [
                "UNESCO preserves rare natural and cultural landmarks globally (like Sundarbans, Historic Mosque City of Bagerhat).",
                "Wild conservation is driven by councils like WWF and the IUCN (renowned for the red list of threatened species).",
                "GK questionnaires consistently feature eco-conventions and protection milestones as essential checkpoints."
            ]
        ],
        questions: [
            { q: "What is the deepest lake in the world?", opts: ["Lake Superior", "Lake Baikal", "Caspian Sea", "Lake Victoria"], correct: 1 },
            { q: "What is the name of the parliament of Japan?", opts: ["Diet", "Knesset", "Congress", "Duma"], correct: 0 },
            { q: "The Indus Valley Civilization was famous for what?", opts: ["Iron Tools", "Town Planning & Drainage", "Nomadic Lifestyle", "Grand Pyramids"], correct: 1 },
            { q: "Which planet is known as the Evening Star?", opts: ["Mars", "Venus", "Jupiter", "Mercury"], correct: 1 },
            { q: "Where is the headquarters of the World Wildlife Fund (WWF) located?", opts: ["Geneva, Switzerland", "Gland, Switzerland", "London, UK", "New York, USA"], correct: 1 }
        ]
    },
    'math': {
        days: [
            "Arithmetic Fundamentals & Percentages",
            "Algebraic Formulas & Linear Equations",
            "Set Theory & Venn Diagrams",
            "Geometry, Coordinate Systems & Trigonometry",
            "Permutations, Combinations & Probability"
        ],
        topics: [
            ["Ratio & Proportions", "Interest Calculations (Simple & Compound)", "Profit, Loss & Discount"],
            ["Laws of Indices & Logarithms", "Quadratic Equations", "Incompatibilities & Inequalities"],
            ["Basic Set Operations", "Two-set Venn Diagrams", "Three-set Complex Venn Problems"],
            ["Properties of Triangles & Circles", "Cartesian Coordinates & Distance Formula", "Trigonometric Ratios & Height-Distance"],
            ["Fundamental Counting Principles", "Permutations vs Combinations", "Classic Probability Laws"]
        ],
        contents: [
            [
                "Ratio is a comparative measure of two homogenous quantities. Proportions detail equality between two ratios. Understanding simple and compound interest represents a high-yield topic for all competitive exams.",
                "Profit and loss are calculated over the cost price of commodities. Discount represents concessions given over marked retail prices.",
                "Simple formulas like Profit% = (Profit / Cost Price) * 100 are extremely critical for speed and accuracy."
            ],
            [
                "Algebraic laws allow parsing variable dynamics. Indice laws define exponential relationships. Logarithms allow measuring high-magnitude scales.",
                "Quadratic equations in ax^2 + bx + c = 0 form possess two solutions determined via the classic quadratic formula.",
                "Solving system inequalities requires checking sign domains over coordinate intervals."
            ],
            [
                "A set is a well-defined collection of distinct objects. Basic operations include Union, Intersection, Difference, and Complement.",
                "Venn diagrams represent set relationships visually. For two sets A and B, n(A U B) = n(A) + n(B) - n(A n B).",
                "Advanced three-set systems are commonly solved using visual area divisions in competitive MCQ exams."
            ],
            [
                "Geometry revolves around properties of shapes. Pythagoras theorem is crucial: a^2 + b^2 = c^2 for right triangles.",
                "Trigonometry defines relationships between angles and side ratios. Trigonometric ratios like Sin, Cos, Tan are high-utility tools.",
                "Cartesian coordinate mathematics measures spatial elements, defining line slopes and distance properties."
            ],
            [
                "Permutations deal with 'arrangements' where order matters. Combinations govern 'selections' where order is immaterial.",
                "Probability measures the likelihood of target outcomes over maximum sample space: P(E) = n(E) / n(S).",
                "These topics are standard gatekeepers for securing excellent technical scores in university entrances and bank recruitments."
            ]
        ],
        questions: [
            { q: "If the ratio of two numbers is 3:5 and their sum is 80, what is the larger number?", opts: ["30", "40", "50", "60"], correct: 2 },
            { q: "What is the value of log2(64)?", opts: ["4", "5", "6", "8"], correct: 2 },
            { q: "In a class of 50 students, 30 like tea, 25 like coffee, and 15 like both. How many like neither?", opts: ["5", "10", "15", "20"], correct: 1 },
            { q: "What is the area of a right-angled triangle with base 6cm and hypotenuse 10cm?", opts: ["24 sq cm", "30 sq cm", "48 sq cm", "60 sq cm"], correct: 0 },
            { q: "In how many ways can the letters of the word 'CAT' be arranged?", opts: ["3", "6", "9", "12"], correct: 1 }
        ]
    }
};

const getTheme = (subject: string) => {
    const key = subject.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (SUBJECT_THEMES[key]) {
        return SUBJECT_THEMES[key];
    }
    const foundKey = Object.keys(SUBJECT_THEMES).find(k => key.includes(k) || k.includes(key));
    if (foundKey) {
        return SUBJECT_THEMES[foundKey];
    }
    return null;
};

// High-Fidelity Content Generator
const generateStudyPlan = (subject: string, duration: number): DailyGoal[] => {
    const goals: DailyGoal[] = [];
    const topicsPerDay = 3;
    const decodedSubject = decodeURIComponent(subject);
    const theme = getTheme(decodedSubject);
    
    for (let i = 1; i <= duration; i++) {
        const themeDayIndex = (i - 1) % (theme ? theme.days.length : 5);
        let dayTitle = `Day ${i}: ${decodedSubject} Study Plan`;
        let topicsList: ReadingTopic[] = [];

        if (theme) {
            const themeDayTitle = theme.days[themeDayIndex];
            dayTitle = `Day ${i}: ${themeDayTitle} (${i <= theme.days.length ? 'Core' : 'Revision Focus'})`;
            
            topicsList = theme.topics[themeDayIndex].map((t, j) => ({
                id: `d${i}-t${j}`,
                title: t,
                content: theme.contents[themeDayIndex][j] || `Strategic guidelines, historic context, and critical examination-style questions for ${t}. Dedicate at least 15 minutes to fully study these materials before moving on to the mastery check.`,
                isRead: false
            }));
        } else {
            dayTitle = `Day ${i}: ${decodedSubject} Essentials - ${i === 1 ? 'Foundations' : 'Advanced Analysis'}`;
            topicsList = Array.from({ length: topicsPerDay }).map((_, j) => ({
                id: `d${i}-t${j}`,
                title: `${decodedSubject} Practice ${i}.${j + 1}: ${['Fundamental Elements', 'Analytical Principles', 'Strategic Applications'][j]}`,
                content: `This is the comprehensive reading material for Day ${i}, Topic ${j + 1}. Focus on understanding the core concepts of ${decodedSubject} as they apply to competitive examinations. Key points include theory, historical context, and practical calculations.`,
                isRead: false
            }));
        }

        goals.push({
            day: i,
            title: dayTitle,
            isCompleted: false,
            testPassed: false,
            topics: topicsList
        });
    }
    return goals;
};

export const ReadingRoom = () => {
    const { subjectName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [duration, setDuration] = useState<number | null>(null);
    const [studyPlan, setStudyPlan] = useState<DailyGoal[]>([]);
    const [currentDay, setCurrentDay] = useState(1);
    const [activeTopicIndex, setActiveTopicIndex] = useState(0);
    const [showDailyTest, setShowDailyTest] = useState(false);
    const [testResult, setTestResult] = useState<{ passed: boolean, score: number } | null>(null);
    
    // Custom day count inputs
    const [customDaysValue, setCustomDaysValue] = useState<string>('');
    const [customDaysError, setCustomDaysError] = useState<string>('');

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`reading_room_${subjectName}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            setDuration(parsed.duration);
            setStudyPlan(parsed.plan);
            setCurrentDay(parsed.currentDay || 1);
        }
    }, [subjectName]);

    // Enforce day unlocking
    useEffect(() => {
        if (duration && studyPlan.length > 0 && currentDay > 1) {
            const previousDayPassed = studyPlan[currentDay - 2].testPassed;
            if (!previousDayPassed) {
                // Find the first day that isn't passed
                const firstUnpassed = studyPlan.findIndex(d => !d.testPassed);
                setCurrentDay(firstUnpassed + 1);
            }
        }
    }, [currentDay, studyPlan, duration]);

    // Save progress
    const saveProgress = (updatedPlan: DailyGoal[], day: number = currentDay) => {
        localStorage.setItem(`reading_room_${subjectName}`, JSON.stringify({
            duration,
            plan: updatedPlan,
            currentDay: day
        }));
        setStudyPlan(updatedPlan);
    };

    const handleSelectDuration = (d: number) => {
        const plan = generateStudyPlan(subjectName || 'Subject', d);
        setDuration(d);
        setStudyPlan(plan);
        localStorage.setItem(`reading_room_${subjectName}`, JSON.stringify({
            duration: d,
            plan: plan,
            currentDay: 1
        }));
    };

    const handleCustomDurationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = parseInt(customDaysValue, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 1000) {
            setCustomDaysError('Please enter a valid count between 1 and 1000 days.');
            return;
        }
        setCustomDaysError('');
        handleSelectDuration(parsed);
    };

    const markTopicRead = (dayIdx: number, topicIdx: number) => {
        const updatedPlan = studyPlan.map((day, dIdx) => {
            if (dIdx !== dayIdx) return day;
            
            const updatedTopics = day.topics.map((topic, tIdx) => {
                if (tIdx !== topicIdx) return topic;
                return { ...topic, isRead: true };
            });
            
            const allRead = updatedTopics.every(t => t.isRead);
            return { ...day, topics: updatedTopics, isCompleted: allRead };
        });
        
        saveProgress(updatedPlan);
    };

    const decodedSubject = decodeURIComponent(subjectName || 'Subject');
    const theme = getTheme(decodedSubject);
    const questions = theme ? theme.questions : [
        { q: `What is the primary role of the core concept in ${decodedSubject} discussed today?`, opts: ["Observation", "Governing Principle Theory", "Basic Hypothesis", "Empirical Conclusion"], correct: 1 },
        { q: `Which variable or parameter is most critical in learning ${decodedSubject}?`, opts: ["Time & Spacing", "Structural Properties", "Historical/Ambient Variables", "Experimental Values"], correct: 2 },
        { q: `How does today's concept apply to competitive examinations?`, opts: ["Directly with High Probability", "Inversely with Low Impact", "Not relevant to standard GK", "Partially via analytical questions"], correct: 0 },
        { q: `What is the historical significance of this ${decodedSubject} topic?`, opts: ["Ancient/Classic Origin", "Modern scientific breakthrough", "Post-industrial innovation", "21st-century dynamic discovery"], correct: 0 },
        { q: `Which foundational scholar is heavily associated with this ${decodedSubject} domain?`, opts: ["Aristotle", "Sir Isaac Newton", "Adam Smith / Standard Authorities", "Albert Einstein"], correct: 2 }
    ];

    const handleFinishDay = () => {
        setShowDailyTest(true);
        setTestResult(null);
    };

    const submitTest = (answers: number[]) => {
        const score = answers.reduce((acc, curr, idx) => curr === questions[idx].correct ? acc + 1 : acc, 0);
        const passed = score >= 3;
        setTestResult({ passed, score });
        
        if (passed) {
            const updatedPlan = studyPlan.map((day, idx) => 
                idx === currentDay - 1 ? { ...day, testPassed: true } : day
            );
            saveProgress(updatedPlan);
        }
    };

    const DailyQuiz = () => {
        const [answers, setAnswers] = useState<number[]>([]);
        const [showQuestions, setShowQuestions] = useState(false);

        if (!showQuestions) {
            return (
                <>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">Gatekeeping Test</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        To ensure you've mastered today's material, please complete this quick evaluation. 
                        You must score at least <span className="text-white font-bold">3/5</span> to unlock Day {currentDay + 1}.
                    </p>
                    
                    <div className="space-y-4 mb-10">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <p className="text-slate-300 font-medium italic">"Ready to prove your knowledge?"</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowQuestions(true)}
                        className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-colors flex items-center justify-center gap-3"
                    >
                        Start Quick Test <ChevronRight size={20} />
                    </button>
                </>
            );
        }

        return (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                        <p className="text-white font-bold mb-4">{qIdx + 1}. {q.q}</p>
                        <div className="grid grid-cols-1 gap-2">
                            {q.opts.map((opt, oIdx) => (
                                <button
                                    key={oIdx}
                                    onClick={() => {
                                        const newAns = [...answers];
                                        newAns[qIdx] = oIdx;
                                        setAnswers(newAns);
                                    }}
                                    className={`text-left p-3 rounded-xl border transition-all text-sm ${
                                        answers[qIdx] === oIdx 
                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <button 
                    disabled={answers.length < 5}
                    onClick={() => submitTest(answers)}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                >
                    Submit Evaluation <Trophy size={20} />
                </button>
            </div>
        );
    };

    const nextDay = () => {
        if (currentDay < (duration || 0)) {
            setCurrentDay(prev => prev + 1);
            setActiveTopicIndex(0);
            setShowDailyTest(false);
            setTestResult(null);
            saveProgress(studyPlan, currentDay + 1);
        }
    };

    if (!duration) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/20">
                        <Layout className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Personal Reading Room</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Welcome to your focused study space for <span className="text-cyan-400 font-bold">{decodedSubject}</span>. 
                        Choose a duration, or enter a custom amount of days. The curriculum will divide automatically!
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {[30, 60, 90, 120, 180, 365].map(d => (
                            <button
                                key={d}
                                onClick={() => handleSelectDuration(d)}
                                className="group relative bg-slate-800 hover:bg-slate-755 border border-slate-700 p-4 rounded-xl transition-all hover:scale-105"
                            >
                                <span className="block text-2xl font-black text-white mb-0.5">{d}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">Days Plan</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleCustomDurationSubmit} className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl text-left">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Or Set Custom Study Days
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Enter custom days (e.g., 45)"
                                value={customDaysValue}
                                onChange={(e) => {
                                    setCustomDaysValue(e.target.value);
                                    if (customDaysError) setCustomDaysError('');
                                }}
                                className="flex-1 bg-slate-900 border border-slate-850 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600 text-sm"
                                min="1"
                                max="1000"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl transition-all text-sm uppercase tracking-wider shadow-lg shadow-indigo-950/50"
                            >
                                Generate
                            </button>
                        </div>
                        {customDaysError && (
                            <p className="text-rose-400 text-xs mt-2 font-semibold">
                                {customDaysError}
                            </p>
                        )}
                    </form>

                    <div className="mt-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-slate-500 hover:text-slate-300 font-bold text-sm transition-colors uppercase tracking-wider"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentDayData = studyPlan[currentDay - 1];
    const isDayReadyForTest = currentDayData.isCompleted;
    const progress = (studyPlan.filter(d => d.testPassed).length / duration) * 100;

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row transition-colors duration-500">
            {/* Sidebar - Plan Progress */}
            <aside className="w-full md:w-72 lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 text-sm font-medium"
                    >
                        <ChevronLeft size={16} /> Exit Room
                    </button>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-white">{decodedSubject}</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Preparation Hub</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-500">PROGESS</span>
                            <span className="text-cyan-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-cyan-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {studyPlan.map((day, idx) => {
                        const isLocked = idx > 0 && !studyPlan[idx - 1].testPassed;
                        const isActive = day.day === currentDay;
                        
                        return (
                            <button
                                key={day.day}
                                disabled={isLocked}
                                onClick={() => {
                                    setCurrentDay(day.day);
                                    setActiveTopicIndex(0);
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                                    isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : 
                                    isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive ? 'bg-white/20' : 
                                    day.testPassed ? 'bg-green-500/20 text-green-500' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {isLocked ? <Lock size={14} /> : day.testPassed ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{day.day}</span>}
                                </div>
                                <div className="min-w-0">
                                    <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                        Day {day.day}
                                    </div>
                                    <div className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                                        {day.isCompleted ? 'Finished Reading' : 'Reading Session'}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
                {/* Content Header */}
                <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-500">TOPIC:</span>
                        <div className="flex gap-2">
                            {currentDayData.topics.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTopicIndex(i)}
                                    className={`w-8 h-2 rounded-full transition-all ${
                                        activeTopicIndex === i ? 'bg-cyan-500 w-12' : 
                                        currentDayData.topics[i].isRead ? 'bg-green-500/50' : 'bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-full text-slate-400 flex items-center gap-2">
                            <Clock size={12} /> 25m Session
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentDay}-${activeTopicIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="text-cyan-500 text-xs font-black uppercase tracking-widest">{currentDayData.title}</span>
                                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                        {currentDayData.topics[activeTopicIndex].title}
                                    </h1>
                                </div>

                                <div className="prose prose-invert prose-lg max-w-none">
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {currentDayData.topics[activeTopicIndex].content}
                                    </p>
                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mt-8">
                                        <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                                            <Info size={18} className="text-cyan-400" /> Study Points
                                        </h4>
                                        <ul className="space-y-3 text-slate-400 text-sm">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                                                Understanding the core definitions is crucial for MCQ sections.
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                                                Compare these values with standard experimental data provided in the appendix.
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                                                Pay attention to the units; dimensional consistency is a common trap.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    {!currentDayData.topics[activeTopicIndex].isRead ? (
                                        <button
                                            onClick={() => markTopicRead(currentDay - 1, activeTopicIndex)}
                                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-3 uppercase tracking-wider text-sm"
                                        >
                                            <CheckCircle2 size={20} /> Mark Topic as Completed
                                        </button>
                                    ) : currentDayData.testPassed ? (
                                        <div className="text-white font-bold flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/30">
                                            <Trophy size={20} className="text-yellow-400" /> Day {currentDay} Accomplished
                                        </div>
                                    ) : (
                                        <div className="text-emerald-500 font-bold flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl">
                                            <CheckCircle2 size={18} /> Topic Finished
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        {activeTopicIndex > 0 && (
                                            <button 
                                                onClick={() => setActiveTopicIndex(prev => prev - 1)}
                                                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                        )}
                                        {activeTopicIndex < currentDayData.topics.length - 1 ? (
                                            <button 
                                                onClick={() => setActiveTopicIndex(prev => prev + 1)}
                                                className="px-8 py-4 bg-slate-100 text-slate-900 font-black rounded-2xl transition-all flex items-center gap-2 hover:scale-105"
                                            >
                                                Next Topic <ChevronRight size={20} />
                                            </button>
                                        ) : !currentDayData.testPassed ? (
                                            <div className="flex flex-col items-end gap-2">
                                                {!currentDayData.isCompleted && (
                                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-400/10 px-2 py-1 rounded">
                                                        Read all topics first
                                                    </span>
                                                )}
                                                <button 
                                                    disabled={!currentDayData.isCompleted}
                                                    onClick={handleFinishDay}
                                                    className={`px-8 py-4 font-black rounded-full transition-all flex items-center gap-3 shadow-xl ${
                                                        currentDayData.isCompleted 
                                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white animate-pulse shadow-cyan-900/20 hover:scale-105' 
                                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed grayscale'
                                                    }`}
                                                >
                                                    Take Mastery Quiz <Zap size={20} fill="currentColor" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={nextDay}
                                                className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl transition-all flex items-center gap-3 hover:scale-105 shadow-xl shadow-indigo-900/20"
                                            >
                                                Proceed to Day {currentDay + 1} <ArrowRight size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Progress bar (Overlay-like) */}
                <div className="h-1.5 w-full bg-slate-900">
                    <motion.div 
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(activeTopicIndex + (currentDayData.topics[activeTopicIndex].isRead ? 1 : 0)) / currentDayData.topics.length * 100}%` }}
                    />
                </div>
            </main>

            {/* Daily Test Modal */}
            <AnimatePresence>
                {showDailyTest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
                        >
                            {!testResult ? (
                                <DailyQuiz />
                            ) : (
                                <div className="text-center">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                        testResult.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                    }`}>
                                        {testResult.passed ? <Trophy size={40} /> : <Zap size={40} />}
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2 uppercase">
                                        {testResult.passed ? 'Day Completed!' : 'Test Failed'}
                                    </h3>
                                    <p className="text-slate-400 mb-8">
                                        {testResult.passed 
                                            ? `Fantastic work! You scored ${testResult.score}/5. You've officially mastered everything for Day ${currentDay}.`
                                            : `You scored ${testResult.score}/5. Take a moment to review the material from today and try again.`
                                        }
                                    </p>

                                    {testResult.passed ? (
                                        <button 
                                            onClick={nextDay}
                                            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
                                        >
                                            Unlock Day {currentDay + 1}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setShowDailyTest(false)}
                                            className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl hover:bg-slate-700 transition-all font-bold"
                                        >
                                            Review Topics
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
