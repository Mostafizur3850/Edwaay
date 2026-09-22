import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { callApi } from '../../../services/api';

export default function ManageCurrentAffairs() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await callApi('CurrentAffairs', { method: 'GET' }) as any[];
      setQuestions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        questionText: qText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        correctOption: correct,
        explanation: explanation
      };

      if (editingId) {
        await callApi('CurrentAffairs/' + editingId, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setEditingId(null);
      } else {
        await callApi('CurrentAffairs', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setExplanation('');
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await callApi('CurrentAffairs/' + id, { method: 'DELETE' });
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (q: any) => {
    setEditingId(q.id);
    setQText(q.questionText || '');
    setOptA(q.optionA || '');
    setOptB(q.optionB || '');
    setOptC(q.optionC || '');
    setOptD(q.optionD || '');
    setCorrect(q.correctOption || 'A');
    setExplanation(q.explanation || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setExplanation('');
  };

  return (
    <div className="p-6 animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6 text-white">Manage Current Affairs Quiz</h2>
      
      <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 space-y-4">
        <h3 className="font-semibold text-lg text-white mb-4">Add New Question</h3>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Question</label>
          <input required type="text" value={qText} onChange={e => setQText(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Enter the question here..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-slate-300">Option A</label><input required type="text" value={optA} onChange={e => setOptA(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Option A" /></div>
          <div><label className="block text-sm font-medium mb-1 text-slate-300">Option B</label><input required type="text" value={optB} onChange={e => setOptB(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Option B" /></div>
          <div><label className="block text-sm font-medium mb-1 text-slate-300">Option C</label><input required type="text" value={optC} onChange={e => setOptC(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Option C" /></div>
          <div><label className="block text-sm font-medium mb-1 text-slate-300">Option D</label><input required type="text" value={optD} onChange={e => setOptD(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Option D" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Correct Option</label>
            <select value={correct} onChange={e => setCorrect(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all">
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Explanation (Optional)</label>
            <input type="text" value={explanation} onChange={e => setExplanation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Explain why the answer is correct..." />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />} 
            {editingId ? 'Update Question' : 'Add Question'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="flex-1 md:flex-none bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 border-b border-slate-800 text-slate-300 text-sm">
            <tr>
              <th className="p-4 font-medium">Question</th>
              <th className="p-4 font-medium w-32">Correct</th>
              <th className="p-4 font-medium text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors text-white">
                <td className="p-4">{q.questionText}</td>
                <td className="p-4">
                  <span className="bg-slate-800 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
                    Option {q.correctOption}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(q)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-lg transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 p-2 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

