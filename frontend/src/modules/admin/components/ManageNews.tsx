import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { callApi } from '../../../services/api';

export default function ManageNews() {
  const [news, setNews] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newsLink, setNewsLink] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await callApi('News', { method: 'GET' }) as any[];
      setNews(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await callApi('News/' + editingId, {
          method: 'PUT',
          body: JSON.stringify({ title, content, imageUrl, newsLink })
        });
      } else {
        await callApi('News', {
          method: 'POST',
          body: JSON.stringify({ title, content, imageUrl, newsLink })
        });
      }
      
      setTitle('');
      setContent('');
      setImageUrl('');
      setNewsLink('');
      setEditingId(null);
      fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setImageUrl(item.imageUrl || '');
    setNewsLink(item.newsLink || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setNewsLink('');
  };

  const handleDelete = async (id: number | string) => {
    try {
      await callApi('News/' + id, { method: 'DELETE' });
      fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6 text-white">Manage Recent News</h2>
      
      <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 space-y-4">
        <h3 className="font-semibold text-lg text-white mb-4">
          {editingId ? 'Edit News' : 'Add New News'}
        </h3>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Title</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="News title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Content/Description</label>
          <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all min-h-[120px]" placeholder="Write the news content here..." />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Image URL (Optional)</label>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">News Link (Optional)</label>
            <input type="text" value={newsLink} onChange={e => setNewsLink(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="https://..." />
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            {editingId ? (
              <>
                <Edit2 size={18} /> Update News
              </>
            ) : (
              <>
                <Plus size={18} /> Add News
              </>
            )}
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
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Content</th>
              <th className="p-4 font-medium w-32">Date</th>
              <th className="p-4 font-medium text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map(n => (
              <tr key={n.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors text-white">
                <td className="p-4 font-medium">{n.title}</td>
                <td className="p-4 truncate max-w-xs text-slate-300">{n.content}</td>
                <td className="p-4 text-slate-400 text-sm">{new Date(n.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(n)} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 p-2 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(n.id)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 p-2 rounded-lg transition-colors">
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

