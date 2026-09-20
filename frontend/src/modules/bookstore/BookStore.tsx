import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Star, Plus, Minus, Trash2, X, Filter, BookOpen, PenTool, Calculator, GraduationCap, ArrowRight, Globe, MessageSquare, Monitor, Shield, Sparkles, Zap, CheckCircle2, Briefcase, ChevronLeft, ChevronRight, MapPin, Phone, Mail, User } from 'lucide-react';

// Enhanced Mock Product Data
const PRODUCTS = [
  {
    id: 1,
    title: "HSC Physics 1st Paper",
    author: "Dr. Shahjahan Tapan",
    price: 350,
    rating: 4.8,
    category: "Academic",
    image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=400&h=500",
    tag: "Best Seller",
    tagColor: "bg-orange-500"
  },
  {
    id: 4,
    title: "Scientific Calculator fx-991EX",
    author: "Casio Original",
    price: 2800,
    rating: 5.0,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee1f620?auto=format&fit=crop&q=80&w=400&h=500",
    tag: "Essential",
    tagColor: "bg-blue-500"
  },
  {
    id: 5,
    title: "Chemistry Plus - Admission",
    author: "Joykoly Series",
    price: 420,
    rating: 4.8,
    category: "Admission",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 8,
    title: "Udvash Engineering Q-Bank",
    author: "Udvash Network",
    price: 600,
    rating: 4.9,
    category: "Admission",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 9,
    title: "Bank Job Solutions 2024",
    author: "Professor's",
    price: 550,
    rating: 4.7,
    category: "Job Prep",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 10,
    title: "Premium Spiral Notebook",
    author: "Paperfly",
    price: 150,
    rating: 4.5,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 11,
    title: "Engineering Physics",
    author: "Dr. Gias Uddin",
    price: 320,
    rating: 4.6,
    category: "Academic",
    image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 12,
    title: "Advanced Organic Chemistry",
    author: "Bahl & Bahl",
    price: 750,
    rating: 4.9,
    category: "Academic",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 13,
    title: "HSC Biology 2nd Paper",
    author: "Gazi Ajmal",
    price: 360,
    rating: 4.7,
    category: "Academic",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 14,
    title: "Math Question Bank",
    author: "Udvash",
    price: 500,
    rating: 4.8,
    category: "Admission",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 19,
    title: "Gel Pen Set (12 Pcs)",
    author: "Matador",
    price: 120,
    rating: 4.9,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee1f620?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 20,
    title: "Geometry Box Premium",
    author: "Faber-Castell",
    price: 450,
    rating: 4.8,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 21,
    title: "BCS Digest",
    author: "Assurance",
    price: 650,
    rating: 4.7,
    category: "Job Prep",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 23,
    title: "Mental Ability for BCS",
    author: "Oracle",
    price: 300,
    rating: 4.6,
    category: "Job Prep",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 24,
    title: "Primary Teacher Exam Guide",
    author: "Professor's",
    price: 400,
    rating: 4.5,
    category: "Job Prep",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    id: 25,
    title: "Graph Paper Bundle",
    author: "Bashundhara",
    price: 80,
    rating: 4.4,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400&h=500",
  }
];

const CATEGORIES = [
    { id: 'All', icon: <ShoppingBag size={16} /> },
    { id: 'Academic', icon: <BookOpen size={16} /> },
    { id: 'Admission', icon: <GraduationCap size={16} /> },
    { id: 'Job Prep', icon: <Briefcase size={16} /> }, 
    { id: 'Stationery', icon: <PenTool size={16} /> },
];

export const BookStore = () => {
  const ITEMS_PER_PAGE = 20;
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutDistrict, setCheckoutDistrict] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'SSL' | 'bKash'>('bKash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user billing details when opening checkout modal
  useEffect(() => {
    if (isCheckoutOpen) {
      const localUser = localStorage.getItem('takeuup_user');
      if (localUser) {
        const u = JSON.parse(localUser);
        setCheckoutName(u.name || '');
        setCheckoutEmail(u.email || '');
        setCheckoutPhone(u.phoneNumber || u.phone || '');
      }
    }
  }, [isCheckoutOpen]);
  
  // Dynamic Bookstore State
  const [categories, setCategories] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [cartData, setCartData] = useState<any>({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Detail Modal State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Helper to resolve potential ASP.NET Core serialization loops ($values) or missing lists
  const ensureArray = (val: any): any[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (val.$values && Array.isArray(val.$values)) return val.$values;
      return [];
  };

  // Helper to retrieve/create a session ID for guest carts
  const getSessionId = () => {
      let sid = localStorage.getItem('takeuup_session_id');
      if (!sid) {
          sid = 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          localStorage.setItem('takeuup_session_id', sid);
      }
      return sid;
  };

  // Load Categories
  useEffect(() => {
      const loadCategories = async () => {
          try {
              const { fetchStoreCategories } = await import('../../services/api');
              const list = await fetchStoreCategories();
              setCategories(ensureArray(list));
          } catch(e) {
              console.error("Failed to load store categories", e);
          }
      };
      loadCategories();
  }, []);

  // Load Products
  useEffect(() => {
      const loadProducts = async () => {
          setLoading(true);
          try {
              const { fetchHomeProducts } = await import('../../services/api');
              const catId = activeCategory === 'All' ? undefined : activeCategory;
              const result = await fetchHomeProducts(searchQuery, catId);
              const items = result?.items || result?.Items || result || [];
              setProductsList(ensureArray(items));
          } catch(e) {
              console.error("Failed to load products", e);
          } finally {
              setLoading(false);
          }
      };
      loadProducts();
      setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Load Cart
  const loadCart = async () => {
      const sid = getSessionId();
      try {
          const { getCart } = await import('../../services/api');
          const data = await getCart(sid);
          setCartData(data || { items: [], subtotal: 0 });
      } catch (e) {
          console.error("Failed to load cart", e);
      }
  };

  useEffect(() => {
      loadCart();
      window.addEventListener('cartUpdated', loadCart);
      return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  // Cart operations
  const handleAddToCart = async (productId: string) => {
      const sid = getSessionId();
      try {
          const { addToCart } = await import('../../services/api');
          await addToCart(sid, productId, 1);
          await loadCart();
          setIsCartOpen(true);
          window.dispatchEvent(new Event('cartUpdated'));
      } catch(e) {
          console.error("Failed to add to cart", e);
      }
  };

  const handleUpdateQty = async (itemId: string, currentQty: number, delta: number) => {
      const sid = getSessionId();
      const newQty = Math.max(1, currentQty + delta);
      try {
          const { updateCartQuantity } = await import('../../services/api');
          await updateCartQuantity(itemId, newQty, sid);
          await loadCart();
          window.dispatchEvent(new Event('cartUpdated'));
      } catch(e) {
          console.error("Failed to update qty", e);
      }
  };

  const handleRemoveFromCart = async (itemId: string) => {
      const sid = getSessionId();
      try {
          const { removeFromCart } = await import('../../services/api');
          await removeFromCart(itemId, sid);
          await loadCart();
          window.dispatchEvent(new Event('cartUpdated'));
      } catch(e) {
          console.error("Failed to remove from cart", e);
      }
  };

  const handleCheckout = () => {
      const token = localStorage.getItem('takeuup_token') || localStorage.getItem('takeuup_user');
      if (!token) {
          alert("Please sign in or register to purchase books.");
          navigate('/login', { state: { returnTo: '/cart' } });
          return;
      }
      setIsCartOpen(false);
      navigate('/checkout');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const sid = getSessionId();
      const cartItemIds = cartItemsList.map(item => item.id || item.Id);

      const orderData = {
          cartItemIds,
          currency: 'BDT',
          shipping: 0,
          paymentMethod,
          address: {
              name: checkoutName,
              phone: checkoutPhone,
              email: checkoutEmail,
              district: checkoutDistrict,
              addressLine: checkoutAddress
          }
      };

      try {
          const { createRealOrder } = await import('../../services/api');
          const res = await createRealOrder(sid, orderData);
          
          if ((res.status === 'Redirect' || res.Status === 'Redirect') && (res.redirectUrl || res.RedirectUrl)) {
              window.location.href = res.redirectUrl || res.RedirectUrl;
          } else {
              alert("🎉 Order placed successfully! Thank you for purchasing.");
              setIsCheckoutOpen(false);
              setCartData({ items: [], subtotal: 0 });
              loadCart();
          }
      } catch (err: any) {
          console.error("Order creation failed", err);
          alert(err.message || "Failed to create order. Please try again.");
      } finally {
          setIsSubmitting(false);
      }
  };

  // Pagination Logic
  const totalPages = Math.ceil(productsList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = productsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cartItemsList = ensureArray(cartData?.items || cartData?.Items || (cartData as any)?.$values);
  const cartSubtotalAmount = cartData?.subtotal || cartData?.Subtotal || 0;
  const cartCount = cartItemsList.reduce((acc, item) => acc + (item.quantity || item.Quantity || 0), 0);

  const getCategoryIcon = (slug: string) => {
      const s = (slug || '').toLowerCase();
      if (s.includes('bcs')) return <Briefcase size={16} />;
      if (s.includes('admission')) return <GraduationCap size={16} />;
      if (s.includes('stationery')) return <PenTool size={16} />;
      return <BookOpen size={16} />;
  };

  const getProductImageUrl = (url: string) => {
      if (!url) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      return `http://localhost:5141/${url.replace(/^\//, '')}`;
  };

  const renderDescription = (desc: string) => {
      if (!desc) return <span className="text-slate-500">No description available for this product.</span>;
      
      const trimmed = desc.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          try {
              const parsed = JSON.parse(trimmed);
              if (parsed.blocks && Array.isArray(parsed.blocks)) {
                  return (
                      <div className="space-y-3 text-sm text-slate-650 dark:text-slate-400 font-normal">
                          {parsed.blocks.map((block: any, idx: number) => {
                              if (block.type === 'paragraph') {
                                  return <p key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} className="leading-relaxed" />;
                              }
                              if (block.type === 'header') {
                                  const Tag = `h${Math.min(6, block.data.level || 3)}` as any;
                                  return <Tag key={idx} className="font-extrabold text-slate-900 dark:text-white mt-4" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                              }
                              if (block.type === 'list') {
                                  const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                                  return (
                                      <ListTag key={idx} className="list-disc pl-5 space-y-1">
                                          {block.data.items.map((item: string, i: number) => (
                                              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                          ))}
                                      </ListTag>
                                  );
                              }
                              return null;
                          })}
                      </div>
                  );
              }
          } catch(e) {
              // Ignore and fallback to HTML
          }
      }

      const hasHtml = /<[a-z][\s\S]*>/i.test(desc);
      if (hasHtml) {
          return (
              <div 
                  className="text-sm text-slate-650 dark:text-slate-400 space-y-3 leading-relaxed
                             [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_h1]:text-lg [&_h1]:font-black [&_h2]:text-base [&_h2]:font-bold"
                  dangerouslySetInnerHTML={{ __html: desc }} 
              />
          );
      }

      return <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed whitespace-pre-line font-normal">{desc}</p>;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white font-sans pb-20 relative transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] dark:opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <div className="relative pt-10 pb-16 px-4">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                    <Sparkles size={12} /> Official Student Store
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                    Equip Your Mind for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600">Academic Excellence</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10 text-lg font-light">
                    The one-stop shop for textbooks, exam guides, stationery, and more.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-white/80 dark:bg-[#151921]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-6 py-4 shadow-2xl transition-all">
                        <Search className="text-slate-500 dark:text-slate-400 mr-4" size={22} />
                        <input 
                            type="text" 
                            placeholder="Search for books, guides, calculators..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-slate-900 dark:text-white w-full focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 text-lg"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-30 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-y border-slate-200 dark:border-white/5 py-4 mb-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeCategory === 'All' 
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105' 
                            : 'bg-slate-100 dark:bg-[#151921] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <ShoppingBag size={16} /> All Items
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                activeCategory === cat.id 
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105' 
                                : 'bg-slate-100 dark:bg-[#151921] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {getCategoryIcon(cat.slug || '')} 
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4">
            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {currentProducts.length > 0 ? (
                        currentProducts.map(product => {
                            const pId = product.id || product.Id;
                            const pName = product.name || product.Name;
                            const pPrice = product.price || product.Price;
                            const pSlug = product.slug || product.Slug;
                            const pOldPrice = product.oldPrice || product.OldPrice || product.previousPrice || product.PreviousPrice;
                            const pCategory = product.categoryName || product.CategoryName || 'Store';
                            const primaryImg = ensureArray(product.images || product.Images).find((img: any) => img.isPrimary || img.IsPrimary);
                            const pThumbnail = getProductImageUrl(product.featureImageUrl || product.FeatureImageUrl || product.images?.[0]?.url || product.Images?.[0]?.Url);
                            
                            return (
                                <div key={pId} className="group bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-[#1E2330] flex items-center justify-center p-4 cursor-pointer" onClick={() => { setSelectedDetailProduct(product); setShowDetailModal(true); }}>
                                        <img 
                                            src={pThumbnail} 
                                            alt={pName} 
                                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                                        />
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(pId); }}
                                            className="absolute bottom-3 right-3 w-8 h-8 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-lg translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-cyan-600 dark:hover:bg-cyan-400"
                                            title="Add to Cart"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="p-3 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate pr-2">{pCategory}</span>
                                            <div className="flex items-center gap-0.5 text-yellow-500 dark:text-yellow-400 text-[10px] font-bold shrink-0">
                                                <Star size={10} fill="currentColor" /> 4.8
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5 leading-tight line-clamp-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => { setSelectedDetailProduct(product); setShowDetailModal(true); }} title={pName}>{pName}</h3>
                                        
                                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-slate-900 dark:text-white">৳{pPrice}</span>
                                                {pOldPrice && (
                                                    <span className="text-[10px] text-slate-400 line-through">৳{pOldPrice}</span>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleAddToCart(pId)}
                                                className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-white uppercase tracking-wide transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-[#1E2330] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Filter size={40} className="text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                            <p className="text-slate-500 dark:text-slate-400">Try selecting a different category or adjust your search.</p>
                            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-6 text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-3">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1E2330] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                                    currentPage === page 
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 scale-110' 
                                    : 'bg-slate-100 dark:bg-[#1E2330] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    })}

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1E2330] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>

        {/* Floating Cart Button */}
        <button 
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-110 transition-transform active:scale-95 group border border-white/10"
        >
            <ShoppingBag size={24} fill="currentColor" className="group-hover:animate-bounce" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-50 dark:border-[#0B0F19]">
                    {cartCount}
                </span>
            )}
        </button>

        {/* Cart Drawer */}
        {isCartOpen && (
            <>
                <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300" onClick={() => setIsCartOpen(false)} />
                <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#151921] border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#151921]">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <ShoppingBag className="text-cyan-500 dark:text-cyan-400" /> Shopping Cart <span className="text-slate-500 text-sm font-medium">({cartCount} items)</span>
                        </h2>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-[#151921]">
                        {cartItemsList.length > 0 ? (
                            cartItemsList.map(item => {
                                const itemId = item.id || item.Id;
                                const prodId = item.productId || item.ProductId;
                                const name = item.name || item.Name || '';
                                const price = item.price || item.Price || 0;
                                const quantity = item.quantity || item.Quantity || 0;
                                const image = item.image || item.Image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';
                                
                                return (
                                    <div key={itemId} className="flex gap-4 bg-white dark:bg-[#1E2330] p-3 rounded-2xl border border-slate-200 dark:border-white/5 group shadow-sm">
                                        <div className="w-20 h-24 bg-slate-100 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                                            <img src={getProductImageUrl(image)} className="w-full h-full object-contain drop-shadow-md" alt="" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{name}</h4>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-bold text-cyan-600 dark:text-cyan-400 text-lg">৳{price * quantity}</span>
                                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0B0F19] rounded-lg px-2 py-1 border border-slate-200 dark:border-white/10">
                                                    <button onClick={() => handleUpdateQty(itemId, quantity, -1)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Minus size={14} /></button>
                                                    <span className="text-sm font-bold w-4 text-center text-slate-900 dark:text-white">{quantity}</span>
                                                    <button onClick={() => handleUpdateQty(itemId, quantity, 1)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveFromCart(itemId)} className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 self-start p-1 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-[#1E2330] rounded-full flex items-center justify-center">
                                    <ShoppingBag size={32} className="opacity-50 text-slate-400 dark:text-slate-500" />
                                </div>
                                <p className="text-lg font-medium">Your cart is empty</p>
                                <button onClick={() => setIsCartOpen(false)} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-full font-bold transition-colors">
                                    Browse Products
                                </button>
                            </div>
                        )}
                    </div>

                    {cartItemsList.length > 0 && (
                        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1E2330]">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
                                <span className="font-black text-2xl text-slate-900 dark:text-white">৳{cartSubtotalAmount}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1">
                                Checkout Securely <ArrowRight size={20} />
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                                <CheckCircle2 size={12} className="text-green-500" /> Secure SSL Payment
                            </p>
                        </div>
                    )}
                </div>
            </>
        )}

        {/* Product Detail Modal */}
        {showDetailModal && selectedDetailProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row gap-6">
                    <button 
                        onClick={() => { setShowDetailModal(false); setSelectedDetailProduct(null); }} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 hover:bg-slate-105 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <X size={20}/>
                    </button>
                    
                    <div className="w-full md:w-1/2 bg-slate-100 dark:bg-[#1E2330] rounded-2xl p-4 flex items-center justify-center aspect-square">
                        <img 
                            src={getProductImageUrl(
                                selectedDetailProduct.featureImageUrl || 
                                selectedDetailProduct.FeatureImageUrl || 
                                selectedDetailProduct.images?.[0]?.url || 
                                selectedDetailProduct.Images?.[0]?.Url
                            )} 
                            alt={selectedDetailProduct.name || selectedDetailProduct.Name} 
                            className="max-h-full max-w-full object-contain drop-shadow-xl" 
                        />
                    </div>
                    
                    <div className="w-full md:w-1/2 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                                {selectedDetailProduct.categoryName || selectedDetailProduct.CategoryName || 'Book'}
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 mb-2 leading-tight">
                                {selectedDetailProduct.name || selectedDetailProduct.Name}
                            </h3>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    ৳{selectedDetailProduct.price || selectedDetailProduct.Price}
                                </span>
                                {(selectedDetailProduct.oldPrice || selectedDetailProduct.OldPrice || selectedDetailProduct.previousPrice || selectedDetailProduct.PreviousPrice) && (
                                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                                        ৳{selectedDetailProduct.oldPrice || selectedDetailProduct.OldPrice || selectedDetailProduct.previousPrice || selectedDetailProduct.PreviousPrice}
                                    </span>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                    (selectedDetailProduct.stock || selectedDetailProduct.Stock || 0) > 0 
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                    {(selectedDetailProduct.stock || selectedDetailProduct.Stock || 0) > 0 ? `In Stock (${selectedDetailProduct.stock || selectedDetailProduct.Stock})` : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="mb-6 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar border-t border-slate-100 dark:border-white/5 pt-4">
                                {renderDescription(selectedDetailProduct.description || selectedDetailProduct.Description || selectedDetailProduct.shortDescription || selectedDetailProduct.ShortDescription)}
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    handleAddToCart(selectedDetailProduct.id || selectedDetailProduct.Id);
                                    setShowDetailModal(false);
                                    setSelectedDetailProduct(null);
                                }}
                                disabled={!(selectedDetailProduct.stock || selectedDetailProduct.Stock || 0)}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                            >
                                <ShoppingBag size={18} /> Add to Shopping Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Checkout Billing & Payment Gateway Modal */}
        {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 text-left">
                <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
                    <button 
                        onClick={() => setIsCheckoutOpen(false)} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <X size={20}/>
                    </button>
                    
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Billing & Shipping Address</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Specify your shipping destination and select your payment method.</p>

                    <form onSubmit={handleConfirmOrder} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Receiver's Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="text" 
                                        required 
                                        value={checkoutName}
                                        onChange={e => setCheckoutName(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="tel" 
                                        required 
                                        value={checkoutPhone}
                                        onChange={e => setCheckoutPhone(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs"
                                        placeholder="e.g. 017xxxxxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="email" 
                                        required 
                                        value={checkoutEmail}
                                        onChange={e => setCheckoutEmail(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs"
                                        placeholder="you@gmail.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">District</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="text" 
                                        required 
                                        value={checkoutDistrict}
                                        onChange={e => setCheckoutDistrict(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs"
                                        placeholder="e.g. Dhaka"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Delivery Address Line</label>
                            <textarea 
                                rows={2}
                                required 
                                value={checkoutAddress}
                                onChange={e => setCheckoutAddress(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs"
                                placeholder="House / Road / Area details..."
                            />
                        </div>

                        {/* Payment gateway selection */}
                        <div className="space-y-2 pt-2">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Select Payment Gateway</label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* bKash Payment option */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('bKash')}
                                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                        paymentMethod === 'bKash'
                                            ? 'bg-pink-500/10 border-pink-500/80 shadow-md shadow-pink-500/5'
                                            : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm">
                                        b
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">bKash Checkout</span>
                                </button>

                                {/* SSLCommerz Payment option */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('SSL')}
                                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                        paymentMethod === 'SSL'
                                            ? 'bg-cyan-500/10 border-cyan-500/80 shadow-md shadow-cyan-500/5'
                                            : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                        SSL
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">SSLCommerz Pay</span>
                                </button>
                            </div>
                        </div>

                        {/* Order Summary & Pricing details */}
                        <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-850 p-4 rounded-2xl space-y-2 mt-4">
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>৳{cartSubtotalAmount}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>Shipping Charge</span>
                                <span className="text-green-500 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                                <span>Grand Total</span>
                                <span className="text-cyan-600 dark:text-cyan-400">৳{cartSubtotalAmount}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
                        >
                            {isSubmitting ? 'Processing Payment...' : `Pay Securely ৳${cartSubtotalAmount}`}
                            {!isSubmitting && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};