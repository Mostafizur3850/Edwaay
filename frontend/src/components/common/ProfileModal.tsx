import React, { useState, useEffect } from 'react';
import { X, User, Camera, Lock, ListTodo, CalendarClock, StickyNote, Plus, Trash2, CheckSquare, Save, Edit2, Eye, Target } from 'lucide-react';
import { fetchGoalCategoryTree, requestGoalChange } from '../../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onUpdateUser: (data: any) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userData, onUpdateUser }) => {
  const getFullImageUrl = (path: string) => {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) return path;
      const cleanPath = path.startsWith('/') ? path : '/' + path;
      return `http://localhost:5141${cleanPath}`;
  };

  const [activeTab, setActiveTab] = useState('profile');
  
  // Goal Change Modal state
  const [showGoalChangeModal, setShowGoalChangeModal] = useState(false);
  const [goalTree, setGoalTree] = useState<any[]>([]);
  const [selectedGoalCatId, setSelectedGoalCatId] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [isSubmittingGoalChange, setIsSubmittingGoalChange] = useState(false);
  const [goalChangeSuccess, setGoalChangeSuccess] = useState<string | null>(null);
  const [goalChangeError, setGoalChangeError] = useState<string | null>(null);

  useEffect(() => {
    if (showGoalChangeModal) {
      fetchGoalCategoryTree().then(tree => setGoalTree(Array.isArray(tree) ? tree : []));
    }
  }, [showGoalChangeModal]);

  const handleSubmitGoalChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalCatId) return;
    setIsSubmittingGoalChange(true);
    setGoalChangeError(null);
    setGoalChangeSuccess(null);
    try {
      await requestGoalChange(userData?.id || userData?.email, selectedGoalCatId, changeReason);
      setGoalChangeSuccess('আপনার গোল পরিবর্তনের আবেদন এডমিনের কাছে পাঠানো হয়েছে। এডমিন অনুমোদন দিলে রানিং গোল আপডেট হবে।');
      setTimeout(() => {
        setShowGoalChangeModal(false);
        setGoalChangeSuccess(null);
      }, 2500);
    } catch (err: any) {
      setGoalChangeError(err.message || "আবেদন পাঠানো ব্যর্থ হয়েছে।");
    } finally {
      setIsSubmittingGoalChange(false);
    }
  };
  
  // Local states for form inputs
  const [name, setName] = useState(userData?.name || '');
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || 'https://picsum.photos/id/64/200');
  
  // Personal Tools State
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [todoInput, setTodoInput] = useState('');
  
  const [routines, setRoutines] = useState<{id: number, time: string, activity: string}[]>([]);
  const [routineTime, setRoutineTime] = useState('');
  const [routineActivity, setRoutineActivity] = useState('');

  // Notes State
  const [notes, setNotes] = useState<{id: number, title: string, content: string}[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Load saved data on open
  useEffect(() => {
      if (isOpen) {
          setName(userData?.name || '');
          const savedData = localStorage.getItem('takeuup_personal_data');
          if (savedData) {
              const parsed = JSON.parse(savedData);
              setTodos(parsed.todos || []);
              setRoutines(parsed.routines || []);
              setNotes(parsed.notes || []);
          }
      }
  }, [isOpen, userData]);

  // Save personal data whenever it changes
  useEffect(() => {
      if (isOpen) {
          localStorage.setItem('takeuup_personal_data', JSON.stringify({ todos, routines, notes }));
      }
  }, [todos, routines, notes, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setPhotoURL(url);
          // Update parent/localstorage immediately for image
          const updated = { ...userData, photoURL: url };
          localStorage.setItem('takeuup_user', JSON.stringify(updated));
          onUpdateUser(updated);
      }
  };

  const handleSaveProfile = () => {
      const updated = { ...userData, name, photoURL };
      localStorage.setItem('takeuup_user', JSON.stringify(updated));
      onUpdateUser(updated);
      alert('Profile updated successfully!');
  };

  const addTodo = () => {
      if (!todoInput.trim()) return;
      setTodos([...todos, { id: Date.now(), text: todoInput, done: false }]);
      setTodoInput('');
  };

  const toggleTodo = (id: number) => {
      setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addRoutine = () => {
      if (!routineTime || !routineActivity) return;
      setRoutines([...routines, { id: Date.now(), time: routineTime, activity: routineActivity }]);
      setRoutineTime('');
      setRoutineActivity('');
  };

  const handleSaveNote = () => {
      if (!noteTitle.trim()) return;

      if (editingNoteId) {
          // Update existing note
          setNotes(prev => prev.map(n => n.id === editingNoteId ? { ...n, title: noteTitle, content: noteContent } : n));
          setEditingNoteId(null);
      } else {
          // Create new note
          setNotes(prev => [...prev, { id: Date.now(), title: noteTitle, content: noteContent }]);
      }
      setNoteTitle('');
      setNoteContent('');
  };

  const startEditNote = (note: {id: number, title: string, content: string}) => {
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setEditingNoteId(note.id);
      // Scroll to top of form
      const formEl = document.getElementById('note-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
      setNoteTitle('');
      setNoteContent('');
      setEditingNoteId(null);
  };

  const deleteNote = (id: number) => {
      if (window.confirm("Are you sure you want to delete this note?")) {
          setNotes(prev => prev.filter(n => n.id !== id));
          if (editingNoteId === id) {
              cancelEdit();
          }
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-950 p-6 border-r border-slate-800 flex flex-col gap-2">
            <h2 className="text-xl font-bold text-white mb-6 pl-2">My Space</h2>
            
            {[
                { id: 'profile', label: 'Profile Settings', icon: User },
                { id: 'todo', label: 'To-Do List', icon: ListTodo },
                { id: 'routine', label: 'Routine Maker', icon: CalendarClock },
                { id: 'notes', label: 'My Notes', icon: StickyNote },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                    <item.icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-slate-900">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800">
                                <img src={getFullImageUrl(photoURL)} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Camera className="text-white" size={24} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Profile Photo</h4>
                            <p className="text-slate-500 text-sm">Click image to upload new</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Display Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
                            />
                        </div>
                        
                        <div className="pt-4 border-t border-slate-800">
                             <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Lock size={16} /> Change Password</h4>
                             <div className="space-y-3">
                                 <input type="password" placeholder="Current Password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none text-sm" />
                                 <input type="password" placeholder="New Password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none text-sm" />
                             </div>
                        </div>

                        {/* Active Goal Display & Change Request */}
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <div className="p-4 bg-gradient-to-r from-emerald-950/70 to-slate-800 border border-emerald-800/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">রানিং গোল (Active Goal)</span>
                                    <h4 className="text-base font-bold text-white mt-0.5">🎯 {userData?.activeGoalName || 'সাধারণ শিক্ষা'}</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                      setShowGoalChangeModal(true);
                                      setGoalChangeSuccess(null);
                                      setGoalChangeError(null);
                                    }}
                                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow"
                                >
                                    গোল পরিবর্তন আবেদন
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveProfile}
                            className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* TO-DO TAB */}
            {activeTab === 'todo' && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Personal To-Do List</h3>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={todoInput}
                            onChange={(e) => setTodoInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a new task..." 
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
                        />
                        <button onClick={addTodo} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 p-3 rounded-xl">
                            <Plus size={24} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {todos.map(todo => (
                            <div key={todo.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors group">
                                <button 
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${todo.done ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-cyan-400'}`}
                                >
                                    {todo.done && <CheckSquare size={14} className="text-slate-900" />}
                                </button>
                                <span className={`flex-1 ${todo.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{todo.text}</span>
                                <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {todos.length === 0 && <p className="text-slate-500 text-center py-8">No tasks yet. Add one above!</p>}
                    </div>
                </div>
            )}

            {/* ROUTINE TAB */}
            {activeTab === 'routine' && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Daily Routine Maker</h3>
                    
                    <div className="flex flex-col md:flex-row gap-2">
                        <input 
                            type="time" 
                            value={routineTime}
                            onChange={(e) => setRoutineTime(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
                        />
                        <input 
                            type="text" 
                            value={routineActivity}
                            onChange={(e) => setRoutineActivity(e.target.value)}
                            placeholder="Activity (e.g., Study Physics)" 
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
                        />
                        <button onClick={addRoutine} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-3 rounded-xl font-bold">
                            Add
                        </button>
                    </div>

                    <div className="space-y-3">
                         {routines.sort((a,b) => a.time.localeCompare(b.time)).map(routine => (
                             <div key={routine.id} className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border-l-4 border-cyan-500">
                                 <span className="font-mono text-cyan-400 font-bold">{routine.time}</span>
                                 <span className="flex-1 text-white">{routine.activity}</span>
                                 <button onClick={() => setRoutines(routines.filter(r => r.id !== routine.id))} className="text-slate-500 hover:text-red-400">
                                    <Trash2 size={18} />
                                 </button>
                             </div>
                         ))}
                         {routines.length === 0 && <p className="text-slate-500 text-center py-8">Create your perfect schedule.</p>}
                    </div>
                </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Quick Notes</h3>
                    
                    {/* Note Input/Edit Form */}
                    <div id="note-form" className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3 relative overflow-hidden transition-all duration-300">
                        {editingNoteId && <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />}
                        
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${editingNoteId ? 'text-cyan-400' : 'text-slate-500'}`}>
                                {editingNoteId ? 'Editing Note' : 'Create New Note'}
                            </span>
                            {editingNoteId && (
                                <button onClick={cancelEdit} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                    <X size={12} /> Cancel Edit
                                </button>
                            )}
                        </div>

                        <input 
                            type="text" 
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="Note Title" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none font-bold" 
                        />
                        <textarea 
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Write something..." 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none min-h-[100px] custom-scrollbar" 
                        />
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSaveNote} 
                                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${
                                    editingNoteId 
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
                                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-cyan-900/20'
                                }`}
                            >
                                {editingNoteId ? <Save size={16} /> : <Plus size={16} />}
                                {editingNoteId ? 'Update Note' : 'Save Note'}
                            </button>
                        </div>
                    </div>

                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {notes.map(note => (
                            <div 
                                key={note.id} 
                                className={`bg-yellow-200/10 border p-4 rounded-xl relative group transition-all duration-300 hover:shadow-lg ${
                                    editingNoteId === note.id ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-slate-800' : 'border-yellow-200/20 hover:bg-yellow-200/20'
                                }`}
                            >
                                <h4 className="font-bold text-yellow-100 mb-2 pr-20 truncate">{note.title}</h4>
                                <p className="text-yellow-100/70 text-sm whitespace-pre-wrap line-clamp-3 mb-8">{note.content}</p>
                                
                                <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditNote(note);
                                        }} 
                                        className="p-1.5 bg-slate-900/80 rounded-lg text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-colors shadow-sm border border-slate-700"
                                        title="View & Edit"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                        }} 
                                        className="p-1.5 bg-slate-900/80 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors shadow-sm border border-slate-700"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                
                                <div className="absolute bottom-3 left-4 right-4 pt-3 border-t border-yellow-200/10 flex justify-between items-center">
                                    <span className="text-[10px] text-yellow-200/40">{new Date(note.id).toLocaleDateString()}</span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditNote(note);
                                        }} 
                                        className="text-xs text-yellow-400 hover:text-cyan-400 font-medium flex items-center gap-1"
                                    >
                                        Read Full <Eye size={10} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {notes.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                                <StickyNote size={32} className="mb-3 opacity-50" />
                                <p className="text-sm">No notes yet. Create your first one above!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </div>

      {/* Goal Change Request Modal */}
      {showGoalChangeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleSubmitGoalChange} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🎯 গোল পরিবর্তন আবেদন (Goal Change Request)
            </h3>
            <p className="text-xs text-slate-400">
              বর্তমান লক্ষ্য: <strong className="text-emerald-400">{userData?.activeGoalName || 'সাধারণ শিক্ষা'}</strong>
              <br />
              নতুন লক্ষ্যের জন্য আবেদন করুন। এডমিন অনুমোদন দিলে রানিং গোল আপডেট হবে।
            </p>

            {goalChangeError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
                {goalChangeError}
              </div>
            )}

            {goalChangeSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold">
                {goalChangeSuccess}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">নতুন কাঙ্ক্ষিত লক্ষ্য</label>
              <select
                required
                value={selectedGoalCatId}
                onChange={(e) => setSelectedGoalCatId(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="">লক্ষ্য বেছে নিন...</option>
                {goalTree.map((cat) => (
                  <optgroup key={cat.id} label={cat.title}>
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>
                          {cat.title} ➔ {sub.title}
                        </option>
                      ))
                    ) : (
                      <option value={cat.id}>{cat.title}</option>
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পরিবর্তনের কারণ (Reason)</label>
              <textarea
                rows={3}
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="কেন গোল পরিবর্তন করতে চান সংক্ষেপে লিখুন..."
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowGoalChangeModal(false)}
                className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                বন্ধ করুন
              </button>
              <button
                type="submit"
                disabled={isSubmittingGoalChange}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition"
              >
                {isSubmittingGoalChange ? 'আবেদন পাঠানো হচ্ছে...' : 'আবেদন জমা দিন'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};