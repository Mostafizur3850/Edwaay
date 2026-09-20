import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, User, Phone, Mail, MapPin, Tag } from 'lucide-react';
import { getCart, createRealOrder, validateCoupon } from '../../services/api';

export const CheckoutPage = () => {
    const navigate = useNavigate();
    
    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [district, setDistrict] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'SSL' | 'COD'>('COD');
    
    // Coupon States
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    
    // Cart & Order States
    const [cartData, setCartData] = useState<any>({ items: [], subtotal: 0 });
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Pre-fill user data
    useEffect(() => {
        const localUser = localStorage.getItem('takeuup_user');
        if (localUser) {
            try {
                const u = JSON.parse(localUser);
                setName(u.name || '');
                setEmail(u.email || '');
                setPhone(u.phoneNumber || u.phone || '');
            } catch (e) {
                console.error("Failed to parse local user data", e);
            }
        }
        
        loadCart();
        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
    }, []);

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

    const handleApplyCoupon = async (e: React.MouseEvent) => {
        e.preventDefault();
        setCouponError('');
        setCouponSuccess('');
        
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code.');
            return;
        }

        try {
            const coupon = await validateCoupon(couponCode.trim());
            if (coupon && coupon.isActive) {
                setAppliedCoupon(coupon);
                setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
            } else {
                setCouponError('Coupon is inactive or invalid.');
            }
        } catch (err: any) {
            setCouponError(err.message || 'Invalid coupon code.');
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = (e: React.MouseEvent) => {
        e.preventDefault();
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponSuccess('');
        setCouponError('');
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cartItemsList.length === 0) {
            alert("Your cart is empty. Please add items to buy first!");
            return;
        }

        setIsSubmitting(true);
        const sid = getSessionId();
        const cartItemIds = cartItemsList.map(item => item.id || item.Id);

        const orderData = {
            cartItemIds,
            currency: 'BDT',
            shipping: 0,
            paymentMethod,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            address: {
                name,
                phone,
                email,
                district,
                addressLine
            }
        };

        try {
            const res = await createRealOrder(sid, orderData);
            
            // Handle digital payment redirects
            if ((res.status === 'Redirect' || res.Status === 'Redirect') && (res.redirectUrl || res.RedirectUrl)) {
                window.location.href = res.redirectUrl || res.RedirectUrl;
            } else {
                alert("🎉 Order placed successfully! Thank you for purchasing.");
                // Dispatch event to clear all reactive cart indicators
                window.dispatchEvent(new Event('cartUpdated'));
                navigate('/store');
            }
        } catch (err: any) {
            console.error("Order creation failed", err);
            alert(err.message || "Failed to create order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const cartItemsList = ensureArray(cartData?.items || cartData?.Items || (cartData as any)?.$values);
    const cartSubtotal = cartData?.subtotal || cartData?.Subtotal || 0;
    
    // Calculate coupon discount
    let discountAmount = 0;
    if (appliedCoupon) {
        const discountVal = parseFloat(appliedCoupon.discount || appliedCoupon.Discount || '0');
        const discType = appliedCoupon.discountType || appliedCoupon.DiscountType || 'Percentage';
        if (discType === 'Percentage') {
            discountAmount = Math.round(cartSubtotal * discountVal / 100);
        } else {
            discountAmount = Math.round(discountVal);
        }
        discountAmount = Math.min(discountAmount, cartSubtotal);
    }
    
    const grandTotal = cartSubtotal - discountAmount;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white font-sans pb-20 relative transition-colors duration-500 pt-28 text-left">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] dark:opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 font-medium transition-colors mb-6">
                    <ArrowLeft size={16} /> Return to Cart
                </Link>
                
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Billing Form */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Billing & Shipping Details</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Enter your shipping details below to place your order.</p>

                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Receiver's Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            type="text" 
                                            required 
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs transition-colors"
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
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs transition-colors"
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
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs transition-colors"
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
                                            value={district}
                                            onChange={e => setDistrict(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs transition-colors"
                                            placeholder="e.g. Dhaka"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Delivery Address Line</label>
                                <textarea 
                                    rows={3}
                                    required 
                                    value={addressLine}
                                    onChange={e => setAddressLine(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs transition-colors"
                                    placeholder="House / Road / Area details..."
                                />
                            </div>

                            {/* Payment Gateways */}
                            <div className="space-y-3 pt-4">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Select Payment Gateway</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                            paymentMethod === 'COD'
                                                ? 'bg-cyan-500/10 border-cyan-500/85 shadow-md shadow-cyan-500/5'
                                                : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                            COD
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('bKash')}
                                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                            paymentMethod === 'bKash'
                                                ? 'bg-pink-500/10 border-pink-500/85 shadow-md shadow-pink-500/5'
                                                : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
                                            b
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">bKash Checkout</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('SSL')}
                                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                            paymentMethod === 'SSL'
                                                ? 'bg-blue-500/10 border-blue-500/85 shadow-md shadow-blue-500/5'
                                                : 'bg-slate-50 dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                                            SSL
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">SSLCommerz Pay</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
                            >
                                {isSubmitting ? 'Confirming Order...' : `Confirm Order & Pay ৳${grandTotal}`}
                                {!isSubmitting && <ArrowRight size={16} />}
                            </button>
                        </form>
                    </div>

                    {/* Order summary column */}
                    <div className="space-y-6">
                        {/* Coupon Code Card */}
                        <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Tag size={16} className="text-cyan-500" /> Apply Coupon Code
                            </h3>
                            
                            {appliedCoupon ? (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-green-500">Active Promo</span>
                                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase">{appliedCoupon.code}</h4>
                                    </div>
                                    <button 
                                        onClick={handleRemoveCoupon}
                                        className="text-xs font-bold text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            placeholder="Promo code (e.g. DISCOUNT10)"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-xs transition-colors"
                                        />
                                        <button 
                                            onClick={handleApplyCoupon}
                                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold transition-all text-slate-900 dark:text-white cursor-pointer"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && <p className="text-xs text-red-500 font-medium">{couponError}</p>}
                                    {couponSuccess && <p className="text-xs text-green-500 font-medium">{couponSuccess}</p>}
                                </div>
                            )}
                        </div>

                        {/* Price Summary Card */}
                        <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Payment Summary</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>Store Subtotal</span>
                                    <span className="font-bold text-slate-900 dark:text-white">৳{cartSubtotal}</span>
                                </div>
                                
                                {appliedCoupon && (
                                    <div className="flex justify-between text-xs text-green-500 font-medium">
                                        <span>Coupon Discount ({appliedCoupon.discount}% off)</span>
                                        <span>-৳{discountAmount}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>Shipping Charge</span>
                                    <span className="text-green-500 font-bold">FREE</span>
                                </div>
                                
                                <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                                    <span>Grand Total</span>
                                    <span className="text-cyan-600 dark:text-cyan-400 text-lg">৳{grandTotal}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-2">
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <ShieldCheck size={16} className="text-cyan-500" />
                                    <span>SSL Encrypted Payment Guarantee</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>COD option supports verified delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
