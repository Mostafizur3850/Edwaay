import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-center">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl relative z-10 transition-all duration-500 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={48} className="text-emerald-500 animate-bounce" strokeWidth={3} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
          Payment Successful!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mb-8">
          Thank you for your order. We have received your payment and are packaging your textbooks.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            Go to Student Dashboard <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/store')}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-350 font-bold rounded-xl transition-all cursor-pointer"
          >
            Continue Book Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
