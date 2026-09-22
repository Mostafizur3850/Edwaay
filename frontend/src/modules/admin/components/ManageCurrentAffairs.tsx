import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { callApi } from '../../../services/api';

export default function ManageCurrentAffairs() {
  const [questions, setQuestions] = useState([]);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('A');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await callApi('CurrentAffairs', { method: 'GET' });
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await callApi('CurrentAffairs', {
        method: 'POST',
        body: JSON.stringify({
            questionText: qText,
            optionA: optA,
            optionB: optB,
            optionC: optC,
            optionD: optD,
            correctOption: correct
        })
      });
      setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD('');
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await callApi('CurrentAffairs/' + id, { method: 'DELETE' });
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Current Affairs Quiz</h2>
      
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-8 space-y-4">
        <h3 className="font-semibold text-lg">Add New Question</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input required type="text" value={qText} onChange={e => setQText(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm mb-1">Option A</label><input required type="text" value={optA} onChange={e => setOptA(e.target.value)} className="w-full border p-2 rounded" /></div>
          <div><label className="block text-sm mb-1">Option B</label><input required type="text" value={optB} onChange={e => setOptB(e.target.value)} className="w-full border p-2 rounded" /></div>
          <div><label className="block text-sm mb-1">Option C</label><input required type="text" value={optC} onChange={e => setOptC(e.target.value)} className="w-full border p-2 rounded" /></div>
          <div><label className="block text-sm mb-1">Option D</label><input required type="text" value={optD} onChange={e => setOptD(e.target.value)} className="w-full border p-2 rounded" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correct Option</label>
          <select value={correct} onChange={e => setCorrect(e.target.value)} className="w-full border p-2 rounded">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Add Question
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Question</th>
              <th className="p-4">Correct</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id} className="border-b">
                <td className="p-4 font-medium">{q.questionText}</td>
                <td className="p-4">{q.correctOption}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

