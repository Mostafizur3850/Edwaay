import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
    Clock, Calculator, Book, CheckSquare, ChevronLeft, 
    Play, Pause, RotateCcw, Plus, Trash2, Search, Target, BookOpen, Activity, Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Timer = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className={`p-8 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border flex flex-col items-center max-w-md mx-auto`}>
            <div className={`text-6xl font-bold font-mono mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button 
                    onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors font-medium ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                >
                    <RotateCcw className="w-5 h-5" /> Reset
                </button>
            </div>
            <div className="mt-8 flex gap-2">
                {[15, 25, 45, 60].map(mins => (
                    <button
                        key={mins}
                        onClick={() => { setIsRunning(false); setTimeLeft(mins * 60); }}
                        className={`px-3 py-1 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        {mins}m
                    </button>
                ))}
            </div>
        </div>
    );
};

const SimpleCalculator = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [display, setDisplay] = useState('0');

    const handlePress = (val: string) => {
        if (val === 'C') {
            setDisplay('0');
        } else if (val === '=') {
            try {
                // eslint-disable-next-line no-eval
                setDisplay(String(eval(display)));
            } catch (e) {
                setDisplay('Error');
            }
        } else {
            setDisplay(display === '0' ? val : display + val);
        }
    };

    const btns = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];

    return (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-sm mx-auto`}>
            <div className={`w-full p-4 mb-4 text-right text-3xl font-mono rounded-lg ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} overflow-x-auto`}>
                {display}
            </div>
            <div className="grid grid-cols-4 gap-2">
                {btns.map(btn => (
                    <button
                        key={btn}
                        onClick={() => handlePress(btn)}
                        className={`p-4 text-xl font-medium rounded-lg transition-colors ${
                            ['/','*','-','+','='].includes(btn) 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : btn === 'C' 
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : isDark 
                                        ? 'bg-slate-800 text-white hover:bg-slate-700' 
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

const QuickNotes = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [notes, setNotes] = useState<{id: number, text: string, date: string}[]>(() => {
        const saved = localStorage.getItem('quickNotes');
        return saved ? JSON.parse(saved) : [];
    });
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        localStorage.setItem('quickNotes', JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        if (!newNote.trim()) return;
        const note = {
            id: Date.now(),
            text: newNote.trim(),
            date: new Date().toLocaleString()
        };
        setNotes([note, ...notes]);
        setNewNote('');
    };

    const deleteNote = (id: number) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    return (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-2xl mx-auto h-[600px] flex flex-col`}>
            <div className="flex gap-2 mb-6">
                <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type a new note here..."
                    className={`flex-grow p-4 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-950 text-white placeholder-slate-500 border-slate-800' : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-200'} border`}
                />
                <button 
                    onClick={addNote}
                    className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-24 flex items-center justify-center"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>
            
            <div className={`flex-grow overflow-y-auto pr-2 space-y-4`}>
                {notes.length === 0 ? (
                    <p className={`text-center mt-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No notes yet. Add one above!</p>
                ) : (
                    notes.map(n => (
                        <div key={n.id} className={`p-4 rounded-lg relative group ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} border`}>
                            <p className={`whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{n.text}</p>
                            <div className="mt-3 flex justify-between items-center text-xs">
                                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{n.date}</span>
                                <button 
                                    onClick={() => deleteNote(n.id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const TodoList = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>(() => {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Revise Chapter 4", done: false },
            { id: 2, text: "Solve practice problems", done: true }
        ];
    });
    const [input, setInput] = useState('');

    useEffect(() => {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (!input.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
        setInput('');
    };

    return (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-lg mx-auto`}>
            <div className="flex gap-2 mb-6">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add a new task..."
                    className={`flex-grow px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'} border`}
                />
                <button 
                    onClick={addTask}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>
            
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox"
                                checked={task.done}
                                onChange={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`${task.done ? 'line-through text-slate-500' : (isDark ? 'text-white' : 'text-slate-900')}`}>
                                {task.text}
                            </span>
                        </div>
                        <button 
                            onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center text-slate-500 py-8">
                        No tasks yet. Add one above!
                    </div>
                )}
            </div>
        </div>
    );
};

const Dictionary = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [word, setWord] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!word.trim() || !showSuggestions) {
            setSuggestions([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.datamuse.com/sug?s=${word}`);
                const data = await res.json();
                setSuggestions(data.slice(0, 5).map((d: any) => d.word));
            } catch (e) {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [word, showSuggestions]);

    const searchWord = async (searchStr: string = word) => {
        if (!searchStr.trim()) return;
        setWord(searchStr);
        setShowSuggestions(false);
        setLoading(true);
        try {
            // Fetch definitions
            const defRes = await fetch(`https://api.datamuse.com/words?sp=${searchStr}&md=d&max=1`);
            const defData = await defRes.json();
            
            // Fetch synonyms
            const synRes = await fetch(`https://api.datamuse.com/words?rel_syn=${searchStr}&max=15`);
            const synData = await synRes.json();
            const synonyms = Array.isArray(synData) ? synData.map((d: any) => d.word) : [];

            // Fetch antonyms
            const antRes = await fetch(`https://api.datamuse.com/words?rel_ant=${searchStr}&max=15`);
            const antData = await antRes.json();
            const antonyms = Array.isArray(antData) ? antData.map((d: any) => d.word) : [];

            // Fetch Bengali meaning
            let bnMeanings: string[] = [];
            try {
                const trRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&dt=bd&q=${searchStr}`);
                const trData = await trRes.json();
                
                if (trData && trData[0] && trData[0][0] && trData[0][0][0]) {
                    bnMeanings.push(trData[0][0][0]);
                }
                
                if (trData && trData[1]) {
                    trData[1].forEach((posGroup: any) => {
                        if (posGroup[1] && Array.isArray(posGroup[1])) {
                            posGroup[1].forEach((meaning: string) => {
                                if (!bnMeanings.includes(meaning)) {
                                    bnMeanings.push(meaning);
                                }
                            });
                        }
                    });
                }
            } catch(e) {
                console.error("Translation error", e);
            }

            const defs = (Array.isArray(defData) && defData.length > 0 && defData[0].defs) ? defData[0].defs : [];

            if (defs.length > 0 || synonyms.length > 0 || antonyms.length > 0 || bnMeanings.length > 0) {
                setResult({ word: searchStr, defs, bnMeanings, synonyms, antonyms });
            } else {
                setResult({ error: 'Word not found or has no data.' });
            }
        } catch (e) {
            setResult({ error: 'Error fetching word' });
        }
        setLoading(false);
    };

    return (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-2xl mx-auto h-[500px] flex flex-col relative`}>
            <div className="flex gap-2 mb-6 relative z-10">
                <div className="flex-grow relative">
                    <input 
                        type="text"
                        value={word}
                        onChange={(e) => {
                            setWord(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && searchWord()}
                        placeholder="Search a word..."
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'} border`}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            {suggestions.map((s, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => searchWord(s)}
                                    className={`px-4 py-2 cursor-pointer ${isDark ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => searchWord(word)}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 h-fit"
                >
                    {loading ? 'Searching...' : <Search className="w-5 h-5" />}
                </button>
            </div>
            
            <div className={`flex-grow overflow-y-auto p-4 rounded-lg z-0 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                {result && !result.error && (
                    <div>
                        <h2 className={`text-2xl font-bold capitalize mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{result.word}</h2>
                        
                        {result.bnMeanings && result.bnMeanings.length > 0 && (
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {result.bnMeanings.map((meaning: string, i: number) => (
                                        <span key={i} className={`px-3 py-1.5 text-base font-medium rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                            {meaning}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {result.synonyms && result.synonyms.length > 0 && (
                            <div className="mb-4">
                                <span className={`font-semibold mr-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Synonyms:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {result.synonyms.map((s: string, i: number) => (
                                        <span key={i} onClick={() => searchWord(s)} className={`px-3 py-1 cursor-pointer text-sm rounded-full transition-colors ${isDark ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-slate-200 text-blue-600 hover:bg-slate-300'}`}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.antonyms && result.antonyms.length > 0 && (
                            <div className="mb-4">
                                <span className={`font-semibold mr-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Antonyms:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {result.antonyms.map((s: string, i: number) => (
                                        <span key={i} onClick={() => searchWord(s)} className={`px-3 py-1 cursor-pointer text-sm rounded-full transition-colors ${isDark ? 'bg-slate-800 text-red-400 hover:bg-slate-700' : 'bg-slate-200 text-red-600 hover:bg-slate-300'}`}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {result.defs && result.defs.length > 0 && (
                            <div className="mb-4">
                                <ul className="space-y-3 mt-4">
                                    {result.defs?.slice(0, 5).map((d: string, j: number) => {
                                        const parts = d.split('\t');
                                        const pos = parts.length > 1 ? parts[0] : '';
                                        const def = parts.length > 1 ? parts[1] : parts[0];
                                        return (
                                            <li key={j} className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {pos && <span className="font-semibold italic mr-2 text-blue-500">[{pos}]</span>}
                                                {def}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                {result?.error && <p className="text-red-500 text-center mt-10">{result.error}</p>}
                {!result && <p className={`text-center mt-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Type a word and hit search.</p>}
            </div>
        </div>
    );
};

const UnitConverter = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [val, setVal] = useState('1');
    const [type, setType] = useState('length');

    const getConverted = () => {
        const v = parseFloat(val) || 0;
        switch(type) {
            case 'length':
                return { 'Centimeters': v * 100, 'Meters': v, 'Kilometers': v / 1000, 'Inches': v * 39.3701, 'Feet': v * 3.28084, 'Miles': v * 0.000621371 };
            case 'weight':
                return { 'Grams': v * 1000, 'Kilograms': v, 'Milligrams': v * 1e6, 'Pounds': v * 2.20462, 'Ounces': v * 35.274 };
            case 'temperature':
                return { 'Celsius': v, 'Fahrenheit': (v * 9/5) + 32, 'Kelvin': v + 273.15 };
            case 'time':
                return { 'Seconds': v * 3600, 'Minutes': v * 60, 'Hours': v, 'Days': v / 24, 'Weeks': v / 168 };
            case 'data':
                return { 'KB': v * 1024, 'MB': v, 'GB': v / 1024, 'TB': v / (1024 * 1024) };
            case 'area':
                return { 'Sq Meters': v, 'Sq Kilometers': v / 1e6, 'Sq Feet': v * 10.7639, 'Acres': v / 4046.86, 'Hectares': v / 10000 };
            default:
                return {};
        }
    };

    const results = getConverted();

    return (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-2xl mx-auto`}>
            <div className="flex gap-4 mb-6">
                <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className={`px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'} border`}
                >
                    <option value="length">Length (from Meters)</option>
                    <option value="weight">Weight (from KG)</option>
                    <option value="temperature">Temperature (from °C)</option>
                    <option value="time">Time (from Hours)</option>
                    <option value="data">Data (from MB)</option>
                    <option value="area">Area (from Sq. Meters)</option>
                </select>
                <input 
                    type="number" 
                    value={val} 
                    onChange={e => setVal(e.target.value)} 
                    placeholder="Enter value..."
                    className={`flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'} border`}
                />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(results).map(([k, v]) => (
                    <div key={k} className={`p-4 rounded-lg border flex flex-col justify-center items-center text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{k}</div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900 break-all'}`}>
                            {typeof v === 'number' && Math.abs(v) < 0.01 && v !== 0 ? v.toExponential(4) : (v as number).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GoalPlanner = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [goals, setGoals] = useState<{id: number, title: string, progress: number}[]>(() => {
        const saved = localStorage.getItem('goalPlanner');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Finish Math Book', progress: 40 },
            { id: 2, title: 'Learn React', progress: 80 }
        ];
    });
    const [newGoal, setNewGoal] = useState('');

    useEffect(() => {
        localStorage.setItem('goalPlanner', JSON.stringify(goals));
    }, [goals]);

    const addGoal = () => {
        if (!newGoal) return;
        setGoals([...goals, { id: Date.now(), title: newGoal, progress: 0 }]);
        setNewGoal('');
    };

    return (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-xl mx-auto`}>
            <div className="flex gap-2 mb-6">
                <input 
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="New long-term goal..."
                    className={`flex-grow px-4 py-2 rounded-lg ${isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 border-slate-200'} border`}
                />
                <button onClick={addGoal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
            </div>
            <div className="space-y-4">
                {goals.map(g => (
                    <div key={g.id} className={`p-4 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between mb-2">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{g.title}</span>
                            <span className="text-blue-500">{g.progress}%</span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${g.progress}%` }}></div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => setGoals(goals.map(t => t.id === g.id ? {...t, progress: Math.min(100, t.progress + 10)} : t))} className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-800 text-white' : 'bg-white border text-slate-700'}`}>+10%</button>
                            <button onClick={() => setGoals(goals.filter(t => t.id !== g.id))} className="text-xs text-red-500 px-2 py-1">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StudyTracker = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    return (
        <div className={`p-8 rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border max-w-lg mx-auto text-center`}>
            <Activity className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Study Tracker</h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6`}>Log your daily study hours and visualize your progress over time.</p>
            <div className={`p-6 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-4xl font-bold text-blue-600 mb-2">4.5 hrs</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Studied Today</div>
            </div>
        </div>
    );
};

export const AllToolsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTool, setActiveTool] = useState('timer');

    const tools = [
        { id: 'timer', label: 'Study Timer', icon: Clock },
        { id: 'calc', label: 'Calculator', icon: Calculator },
        { id: 'dict', label: 'Dictionary', icon: BookOpen },
        { id: 'unit', label: 'Unit Converter', icon: LinkIcon },
        { id: 'notes', label: 'Quick Notes', icon: Book },
        { id: 'todo', label: 'To-Do Tracker', icon: CheckSquare },
        { id: 'goals', label: 'Goal Planner', icon: Target },
        { id: 'tracker', label: 'Study Tracker', icon: Activity },
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'} pb-24 font-sans`}>
            {/* Header */}
            <div className={`${isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-6">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Free Study Tools
                    </h1>
                    <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Everything you need to stay productive and organized, all in one place.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className={`rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden`}>
                            {tools.map(tool => {
                                const Icon = tool.icon;
                                const isActive = activeTool === tool.id;
                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => setActiveTool(tool.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-b last:border-b-0 ${isDark ? 'border-slate-800' : 'border-slate-100'} ${
                                            isActive 
                                                ? 'bg-blue-50 text-blue-700 font-semibold' 
                                                : isDark 
                                                    ? 'text-slate-300 hover:bg-slate-800' 
                                                    : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                        {tool.label}
                                    </button>
                                );
                            })}
                            <Link 
                                to="/tools/pdf-to-word"
                                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-t ${isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Book className="w-5 h-5 text-slate-400" />
                                PDF Tools
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        {activeTool === 'timer' && <Timer />}
                        {activeTool === 'calc' && <SimpleCalculator />}
                        {activeTool === 'dict' && <Dictionary />}
                        {activeTool === 'unit' && <UnitConverter />}
                        {activeTool === 'notes' && <QuickNotes />}
                        {activeTool === 'todo' && <TodoList />}
                        {activeTool === 'goals' && <GoalPlanner />}
                        {activeTool === 'tracker' && <StudyTracker />}
                    </div>
                </div>
            </div>
        </div>
    );
};
