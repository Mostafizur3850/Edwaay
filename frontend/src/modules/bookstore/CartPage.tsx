import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getCart, updateCartQuantity, removeFromCart } from '../../services/api';

export const CartPage = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<any>({ items: [], subtotal: 0 });
    const [loading, setLoading] = useState(false);

    const getSessionId = () => {
        let sid = localStorage.getItem('takeuup_session_id');
        if (!sid) {
            sid = 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('takeuup_session_id', sid);
        }
        return sid;
    };

    const ensureArray = (val: any): any[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (val.$values && Array.isArray(val.$values)) return val.$values;
        return [];
    };

    const loadCart = async () => {
        setLoading(true);
        const sid = getSessionId();
        try {
            const data = await getCart(sid);
            setCartData(data || { items: [], subtotal: 0 });
        } catch (e) {
            console.error("Failed to load cart", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
    }, []);

    const handleUpdateQty = async (itemId: string, currentQty: number, delta: number) => {
        const sid = getSessionId();
        const newQty = Math.max(1, currentQty + delta);
        try {
            await updateCartQuantity(itemId, newQty, sid);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            console.error("Failed to update quantity", e);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        const sid = getSessionId();
        try {
            await removeFromCart(itemId, sid);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            console.error("Failed to remove item", e);
        }
    };

    const cartItemsList = ensureArray(cartData?.items || cartData?.Items || (cartData as any)?.$values);
    const cartSubtotal = cartData?.subtotal || cartData?.Subtotal || 0;
    const cartCount = cartItemsList.reduce((acc, item) => acc + (item.quantity || item.Quantity || 0), 0);

    const getProductImageUrl = (url: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `http://localhost:5141/${url.replace(/^\//, '')}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white font-sans pb-20 relative transition-colors duration-500 pt-28">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] dark:opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link to="/store" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 font-medium transition-colors mb-2">
                            <ArrowLeft size={16} /> Continue Shopping
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                        You have <span className="text-cyan-600 dark:text-cyan-400">{cartCount} items</span> in your cart
                    </div>
                </div>

                {loading && cartItemsList.length === 0 ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                    </div>
                ) : cartItemsList.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItemsList.map(item => {
                                const itemId = item.id || item.Id;
                                const name = item.name || item.Name || '';
                                const price = item.price || item.Price || 0;
                                const quantity = item.quantity || item.Quantity || 0;
                                const image = item.image || item.Image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';
                                
                                return (
                                    <div key={itemId} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#151921] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-24 h-28 bg-slate-100 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                                            <img src={getProductImageUrl(image)} className="w-full h-full object-contain drop-shadow-md" alt={name} />
                                        </div>
                                        
                                        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 line-clamp-2">{name}</h3>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Unit Price: ৳{price}</span>
                                        </div>

                                        <div className="flex items-center gap-6 justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0B0F19] rounded-xl px-3 py-1.5 border border-slate-200 dark:border-white/10">
                                                <button 
                                                    onClick={() => handleUpdateQty(itemId, quantity, -1)} 
                                                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-bold w-6 text-center text-slate-900 dark:text-white">{quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQty(itemId, quantity, 1)} 
                                                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <span className="font-black text-cyan-600 dark:text-cyan-400 text-lg block">৳{price * quantity}</span>
                                            </div>

                                            <button 
                                                onClick={() => handleRemoveItem(itemId)} 
                                                className="text-slate-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                                                title="Remove item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm sticky top-28">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span className="font-bold text-slate-900 dark:text-white">৳{cartSubtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span>Shipping Charge</span>
                                    <span className="text-green-500 font-bold">FREE</span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between text-base font-black text-slate-900 dark:text-white">
                                    <span>Total Amount</span>
                                    <span className="text-cyan-600 dark:text-cyan-400 text-xl">৳{cartSubtotal}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>

                            <div className="mt-8 pt-6 border-t border-slate-150 dark:border-white/5 space-y-3">
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <ShieldCheck size={16} className="text-cyan-500" />
                                    <span>Safe & secure SSL encrypted checkout</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>Genuine educational books & stationery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-sm">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-[#1E2330] rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={32} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Your Cart is Empty</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 font-light">Add textbooks, calculators, and exam preparation guides from our student store to get started.</p>
                        <Link to="/store" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-md shadow-cyan-500/10">
                            Go to Student Store <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
