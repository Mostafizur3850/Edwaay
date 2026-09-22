import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { callApi } from '../../../services/api';

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await callApi('News', { method: 'GET' });
      setNews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await callApi('News', {
        method: 'POST',
        body: JSON.stringify({ title, content, imageUrl })
      });
      setTitle('');
      setContent('');
      setImageUrl('');
      fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await callApi('News/' + id, { method: 'DELETE' });
      fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Recent News</h2>
      
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-8 space-y-4">
        <h3 className="font-semibold text-lg">Add New News</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content/Description</label>
          <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full border p-2 rounded h-24" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border p-2 rounded" placeholder="https://..." />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Add News
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Content</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map(n => (
              <tr key={n.id} className="border-b">
                <td className="p-4">{n.title}</td>
                <td className="p-4 truncate max-w-xs">{n.content}</td>
                <td className="p-4">{new Date(n.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
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

