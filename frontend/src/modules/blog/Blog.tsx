import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Clock, Calendar, User, Tag, Share2, Bookmark } from 'lucide-react';
import { BlogPost } from '../../types/types';

export const Blog = () => {
  const getBlogImageUrl = (url: string) => {
      if (!url) return 'https://picsum.photos/id/106/800/400';
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
          return url;
      }
      return `http://localhost:5141/${url.replace(/^\//, '')}`;
  };

  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
      setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
      const loadBlogsData = async () => {
          try {
              const { fetchBlogsList, fetchBlogCategories } = await import('../../services/api');
              const [blogsData, catsData] = await Promise.all([
                  fetchBlogsList(),
                  fetchBlogCategories()
              ]);
              const list = Array.isArray(blogsData) ? blogsData : ((blogsData as any).$values || []);
              setBlogs(list);
              
              const catList = Array.isArray(catsData) ? catsData : ((catsData as any).$values || []);
              setCategories(catList);
          } catch (e) {
              console.error("Failed to load blogs data from APIs");
              setBlogs([]);
          }
      };
      
      loadBlogsData();
  }, []);

    const handleBlogClick = async (blog: any) => {
        try {
            const { fetchBlogDetails } = await import('../../services/api');
            const details = await fetchBlogDetails(blog.id || blog.Id);
            if (details) {
                setSelectedBlog({
                    id: details.id || details.Id,
                    title: details.title || details.Title,
                    author: 'Admin User',
                    readTime: `${Math.ceil((details.description || '').split(' ').length / 200)} min`,
                    category: blog.categoryName || blog.CategoryName || 'General',
                    imageUrl: getBlogImageUrl(details.imageUrl || details.ImageUrl || blog.imageUrl || blog.ImageUrl),
                    date: new Date().toLocaleDateString(),
                    content: details.description || details.Description
                });
            } else {
                setSelectedBlog({
                    id: blog.id || blog.Id,
                    title: blog.title || blog.Title,
                    author: 'Admin User',
                    readTime: '5 min',
                    category: blog.categoryName || blog.CategoryName || 'General',
                    imageUrl: getBlogImageUrl(blog.imageUrl || blog.ImageUrl),
                    date: new Date().toLocaleDateString(),
                    content: blog.description || blog.Description || 'No content available.'
                });
            }
        } catch (e) {
            console.error("Failed to load blog details", e);
            setSelectedBlog({
                id: blog.id || blog.Id,
                title: blog.title || blog.Title,
                author: 'Admin User',
                readTime: '5 min',
                category: blog.categoryName || blog.CategoryName || 'General',
                imageUrl: getBlogImageUrl(blog.imageUrl || blog.ImageUrl),
                date: new Date().toLocaleDateString(),
                content: blog.description || blog.Description || 'No content available.'
            });
        }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredBlogs = blogs.filter(blog => {
      const catName = blog.categoryName || blog.CategoryName || blog.category || 'General';
      const matchesCategory = activeCategory === 'All' || catName === activeCategory;
      const matchesSearch = (blog.title || blog.Title || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  // DETAILED VIEW RENDERER
  if (selectedBlog) {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
              <div className="max-w-4xl mx-auto px-4">
                  {/* Nav Bar */}
                  <button 
                      onClick={() => setSelectedBlog(null)} 
                      className="group flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
                  >
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mr-3 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all shadow-sm">
                          <ArrowLeft size={20} />
                      </div>
                      <span className="font-bold">Back to Blog</span>
                  </button>

                  {/* Header Content */}
                  <div className="space-y-6 mb-10">
                      <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-bold border border-cyan-200 dark:border-cyan-500/20 uppercase tracking-wider">
                              {selectedBlog.category}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                              <Clock size={14} /> {selectedBlog.readTime} read
                          </span>
                          {selectedBlog.date && (
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                  <Calendar size={14} /> {selectedBlog.date}
                              </span>
                          )}
                      </div>

                      <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                          {selectedBlog.title}
                      </h1>

                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                                  <User size={24} className="text-slate-400" />
                              </div>
                              <div>
                                  <p className="text-slate-900 dark:text-white font-bold text-sm">{selectedBlog.author}</p>
                                  <p className="text-slate-500 text-xs">Author</p>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><Bookmark size={20} /></button>
                              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><Share2 size={20} /></button>
                          </div>
                      </div>
                  </div>

                  {/* Featured Image */}
                  <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-slate-200 dark:border-slate-800 shadow-xl relative">
                      <img 
                          src={selectedBlog.imageUrl} 
                          alt={selectedBlog.title} 
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Article Content */}
                  <div className="prose lg:prose-xl dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-cyan-700 dark:prose-strong:text-cyan-200 prose-li:text-slate-600 dark:prose-li:text-slate-300">
                      {selectedBlog.content ? (
                          selectedBlog.content.split('\n').map((paragraph: string, idx: number) => (
                              <p key={idx} className="mb-4 leading-relaxed">
                                  {paragraph.trim().startsWith('**') ? (
                                      <strong className="text-xl block mt-8 mb-2 font-bold">{paragraph.replace(/\*\*/g, '')}</strong>
                                  ) : paragraph}
                              </p>
                          ))
                      ) : (
                          <p className="italic text-slate-500">No content available for this post.</p>
                      )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                      <button className="px-8 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-full font-bold transition-colors shadow-lg">
                          Share this article
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // DEFAULT LIST VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Explore Our Blog</h1>
                <p className="text-slate-600 dark:text-slate-400">Insights and tips to help you succeed in your studies.</p>
            </div>
            <div className="mt-4 md:mt-0 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Search blogs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 shadow-sm w-64 md:w-80 transition-all"
                />
            </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
            {['All', ...categories.map(c => c.name || c.Name)].map((cat, i) => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat 
                        ? 'bg-cyan-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedBlogs.length > 0 ? paginatedBlogs.map((blog) => {
                const id = blog.id || blog.Id;
                const title = blog.title || blog.Title;
                const imageUrl = getBlogImageUrl(blog.imageUrl || blog.ImageUrl);
                const category = blog.categoryName || blog.CategoryName || 'General';
                const author = blog.author || 'Admin User';
                const readTime = blog.readTime || '5 min';
                
                return (
                    <div key={id} onClick={() => handleBlogClick(blog)} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 hover:-translate-y-1">
                        <div className="relative overflow-hidden aspect-[4/3]">
                            <img 
                                src={imageUrl} 
                                alt={title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                 <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-wide">
                                     {category}
                                 </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                                {title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="font-medium flex items-center gap-1"><User size={12}/> {author}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {readTime}</span>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="col-span-full text-center py-20 text-slate-500">
                    No blogs found matching your criteria.
                </div>
            )}
            
            {/* Ad Placeholder (only show if blogs exist to maintain grid) */}
            {paginatedBlogs.length > 0 && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-full h-full min-h-[150px] bg-slate-200 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-slate-500 dark:text-slate-600 font-bold">Advertisement</span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Sponsored Content</p>
                </div>
            )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${
                            currentPage === page
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 font-medium'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        )}
    </div>
  );
};