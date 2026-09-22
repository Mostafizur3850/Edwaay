import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, FolderPlus, Save, CheckCircle, AlertCircle, RefreshCw, Layers, Sparkles } from 'lucide-react';
import { fetchAdminGoalCategories, createGoalCategory, updateGoalCategory, deleteGoalCategory, reorderGoalCategories } from '../../../services/api';

export const AdminGoalCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [iconName, setIconName] = useState('GraduationCap');
  const [sequence, setSequence] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const ICON_OPTIONS = [
    'GraduationCap', 'BookOpen', 'BookMarked', 'Award', 'BookCheck', 'Briefcase',
    'FlaskConical', 'Calculator', 'Globe', 'Atom', 'TrendingUp', 'Cpu',
    'Stethoscope', 'Building2', 'Landmark', 'Users'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchAdminGoalCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to load Goal Categories.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = (parent?: any) => {
    setIsEditing(true);
    setEditId(null);
    setTitle('');
    setSubtitle('');
    setParentId(parent ? parent.id : '');
    setIconName('GraduationCap');
    const existingCount = parent ? (parent.subCategories?.length || 0) : categories.length;
    setSequence(existingCount + 1);
    setIsActive(true);
  };

  const handleOpenEdit = (item: any) => {
    setIsEditing(true);
    setEditId(item.id);
    setTitle(item.title || '');
    setSubtitle(item.subtitle || '');
    setParentId(item.parentId || '');
    setIconName(item.iconName || 'GraduationCap');
    setSequence(item.sequence || 1);
    setIsActive(item.isActive !== false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      parentId: parentId ? parentId : null,
      iconUrl: null,
      iconName,
      sequence: Number(sequence),
      isActive
    };

    try {
      if (editId) {
        await updateGoalCategory(editId, payload);
        setSuccessMsg("Goal Category updated successfully!");
      } else {
        await createGoalCategory(payload);
        setSuccessMsg("Goal Category created successfully!");
      }

      setIsEditing(false);
      loadCategories();
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Sub-categories under it will also be removed.`)) return;

    setIsLoading(true);
    try {
      await deleteGoalCategory(id);
      setSuccessMsg(`"${name}" removed successfully.`);
      loadCategories();
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to delete category.");
      setIsLoading(false);
    }
  };

  const handleMoveSequence = async (list: any[], index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;

    const updatedList = [...list];
    const temp = updatedList[index];
    updatedList[index] = updatedList[newIndex];
    updatedList[newIndex] = temp;

    const itemsToSave = updatedList.map((item, idx) => ({
      id: item.id,
      sequence: idx + 1
    }));

    try {
      await reorderGoalCategories(itemsToSave);
      loadCategories();
    } catch (e: any) {
      setErrorMsg("Failed to reorder sequence.");
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm uppercase tracking-wider mb-1">
            <Layers size={18} /> গোল ও বিভাগ ক্যাটাগরি ম্যানেজমেন্ট
          </div>
          <h2 className="text-2xl font-black text-white">Student Goal Category Hierarchy</h2>
          <p className="text-xs text-slate-400 mt-1">
            স্টুডেন্টরা ১ম বার লগইন করার সময় যে গোলগুলো দেখতে পাবে তা এখান থেকে ডাইনামিকালি সাজিয়ে অর্ডার (Sequence) সেট করা যায়।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={() => handleOpenCreate()}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 text-sm transition-all"
          >
            <Plus size={18} /> নতুন মেইন ক্যাটাগরি
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Main Grid: Tree List vs Add/Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Tree List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">ক্যাটাগরি ডাটা লোড হচ্ছে...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
              <Layers size={40} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-300">কোনো গোল ক্যাটাগরি নেই</h3>
              <p className="text-xs text-slate-500 mt-1">নতুন মেইন ক্যাটাগরি যুক্ত করতে ডানপাশের বাটনে ক্লিক করুন।</p>
            </div>
          ) : (
            categories.map((parent, pIdx) => {
              const subList = parent.subCategories || parent.SubCategories || [];

              return (
                <div key={parent.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                  
                  {/* Parent Row */}
                  <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-slate-500">
                        <button
                          onClick={() => handleMoveSequence(categories, pIdx, 'up')}
                          disabled={pIdx === 0}
                          className="p-1 hover:text-cyan-400 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveSequence(categories, pIdx, 'down')}
                          disabled={pIdx === categories.length - 1}
                          className="p-1 hover:text-cyan-400 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/20">
                        #{parent.sequence}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white">{parent.title}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${parent.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                            {parent.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {parent.subtitle && <p className="text-xs text-slate-400">{parent.subtitle}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCreate(parent)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-cyan-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <FolderPlus size={14} /> সাব-ক্যাটাগরি
                      </button>

                      <button
                        onClick={() => handleOpenEdit(parent)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(parent.id, parent.title)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Sub-categories List */}
                  {subList.length > 0 ? (
                    <div className="p-4 space-y-2 bg-slate-900/60">
                      {subList.map((sub: any, sIdx: number) => (
                        <div
                          key={sub.id}
                          className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-4 ml-6"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-slate-600">
                              <button
                                onClick={() => handleMoveSequence(subList, sIdx, 'up')}
                                disabled={sIdx === 0}
                                className="p-1 hover:text-emerald-400 disabled:opacity-30 transition-colors"
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                onClick={() => handleMoveSequence(subList, sIdx, 'down')}
                                disabled={sIdx === subList.length - 1}
                                className="p-1 hover:text-emerald-400 disabled:opacity-30 transition-colors"
                              >
                                <ArrowDown size={13} />
                              </button>
                            </div>

                            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                              #{sub.sequence}
                            </span>

                            <div>
                              <h4 className="text-sm font-bold text-slate-200">{sub.title}</h4>
                              {sub.subtitle && <p className="text-xs text-slate-500">{sub.subtitle}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(sub)}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id, sub.title)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500 italic">
                      কোনো সাব-ক্যাটাগরি যুক্ত করা হয়নি।
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Add/Edit Form Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-400" />
              {isEditing ? (editId ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি যোগ করুন') : 'ক্যাটাগরি ফর্ম'}
            </h3>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                বাতিল করুন
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ক্যাটাগরি টাইটেল (Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. এইচএসসি / এডমিশন"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                সাব-টাইটেল / বিবরণ (Subtitle)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. বিজ্ঞান বিভাগ"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                প্যারেন্ট ক্যাটাগরি (Parent Category)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- কোনো প্যারেন্ট নেই (Main Category) --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                আইকন সিলেক্ট করুন (Icon Name)
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                {ICON_OPTIONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            {/* Sequence Order */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ক্রম/অর্ডার নম্বর (Sequence)
              </label>
              <input
                type="number"
                value={sequence}
                onChange={(e) => setSequence(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">অ্যাক্টিভ স্ট্যাটাস</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-cyan-500' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Save size={18} />
              {isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'সেভ করুন'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
