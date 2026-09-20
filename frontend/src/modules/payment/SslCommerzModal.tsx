import React, { useState } from 'react';
import { X, HelpCircle, Gift, User, ShieldCheck, CreditCard, Smartphone, Building2, Lock, CheckCircle2, TouchpadOff } from 'lucide-react';

interface SslCommerzModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  packageName: string;
  onSuccess: (trxId: string) => void;
  onFail: (reason: string) => void;
}

export const SslCommerzModal: React.FC<SslCommerzModalProps> = ({
  isOpen,
  onClose,
  amount,
  packageName,
  onSuccess,
  onFail
}) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'cards' | 'net'>('mobile');
  const [selectedWallet, setSelectedWallet] = useState<string | null>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const trxId = 'SSL-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      onSuccess(trxId);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-800 border border-slate-200">
        
        {/* Top Branding Header */}
        <div className="p-4 text-center border-b border-slate-100 relative bg-slate-50/50">
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono font-bold rounded border border-slate-200">4:55</span>
            <button 
              onClick={onClose} 
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex justify-center mb-1">
            <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center p-2 shadow-md border-2 border-cyan-500/30">
              <img src="/assets/takeuup_emblem_logo.png" alt="Take U Up" className="h-9 w-auto object-contain" />
            </div>
          </div>
          <h3 className="font-extrabold text-slate-900 tracking-wider text-sm uppercase">TAKE U UP</h3>
          
          <div className="flex justify-center gap-6 mt-3 text-[11px] font-bold text-slate-500">
            <button className="flex flex-col items-center gap-0.5 hover:text-cyan-600 transition-colors">
              <HelpCircle size={16} />
              <span>Support</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-cyan-600 transition-colors">
              <ShieldCheck size={16} />
              <span>FAQ</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-cyan-600 transition-colors">
              <Gift size={16} />
              <span>Offers</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-cyan-600 transition-colors">
              <User size={16} />
              <span>Login</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 bg-blue-600 text-white text-xs font-black tracking-wide text-center">
          <button 
            onClick={() => setActiveTab('cards')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'cards' ? 'bg-blue-800 font-extrabold border-b-2 border-cyan-300' : 'hover:bg-blue-700 opacity-90'}`}
          >
            <CreditCard size={14} />
            <span>CARDS</span>
          </button>
          <button 
            onClick={() => setActiveTab('mobile')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'mobile' ? 'bg-slate-950 font-extrabold border-b-2 border-cyan-400' : 'hover:bg-blue-700 opacity-90'}`}
          >
            <Smartphone size={14} />
            <span>MOBILE BANKING</span>
          </button>
          <button 
            onClick={() => setActiveTab('net')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'net' ? 'bg-blue-800 font-extrabold border-b-2 border-cyan-300' : 'hover:bg-blue-700 opacity-90'}`}
          >
            <Building2 size={14} />
            <span>NET BANKING</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 bg-slate-50 min-h-[240px]">
          <p className="text-center text-xs text-slate-500 mb-3 font-medium">
            Please login to show your saved wallets
          </p>

          {activeTab === 'mobile' && (
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'bkash', name: 'bKash', color: 'border-pink-500 bg-pink-50/50', badge: 'বিকাশ' },
                { id: 'rocket', name: 'Rocket', color: 'border-purple-500 bg-purple-50/50', badge: 'রকেট' },
                { id: 'nagad', name: 'Nagad', color: 'border-orange-500 bg-orange-50/50', badge: 'নগদ' },
                { id: 'upay', name: 'Upay', color: 'border-cyan-500 bg-cyan-50/50', badge: 'উপায়' },
                { id: 'cellfin', name: 'CellFin', color: 'border-blue-500 bg-blue-50/50', badge: 'সেলফিন' },
                { id: 'mcash', name: 'Islami M-Cash', color: 'border-emerald-500 bg-emerald-50/50', badge: 'এমক্যাশ' },
                { id: 'pocket', name: 'Pocket', color: 'border-slate-500 bg-slate-50/50', badge: 'পকেট' },
                { id: 'pathao', name: 'Pathao Pay', color: 'border-red-500 bg-red-50/50', badge: 'পাঠাও পে' },
                { id: 'rainbow', name: 'My Rainbow', color: 'border-indigo-500 bg-indigo-50/50', badge: 'রেইনবো' }
              ].map(wallet => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all relative ${
                    selectedWallet === wallet.id 
                      ? `${wallet.color} ring-2 ring-blue-500 shadow-sm scale-105` 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {selectedWallet === wallet.id && (
                    <CheckCircle2 size={14} className="absolute top-1 right-1 text-blue-600 fill-blue-100" />
                  )}
                  <span className="text-slate-800 font-extrabold">{wallet.badge}</span>
                  <span className="text-[10px] text-slate-500">{wallet.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">কার্ড নম্বর (Card Number)</label>
                <input 
                  type="text" 
                  placeholder="4000 1234 5678 9010" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">মেয়াদ (MM/YY)</label>
                  <input 
                    type="text" 
                    placeholder="12/28" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">CVV / CVC</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    maxLength={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'net' && (
            <div className="grid grid-cols-2 gap-2">
              {['City Touch', 'Islami Bank iBanking', 'EBL Skybanking', 'Bank Asia Online'].map(bank => (
                <button
                  key={bank}
                  onClick={() => setSelectedWallet(bank)}
                  className={`p-3 rounded-xl border font-bold text-xs text-center transition-all bg-white ${
                    selectedWallet === bank ? 'border-blue-600 ring-2 ring-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          )}

          {/* Terms Footer Disclaimer */}
          <div className="mt-4 p-2.5 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-500 text-center leading-relaxed">
            By checking this pay button you agree to our <span className="text-blue-600 underline font-semibold">Terms of Service</span> which is limited to facilitating your payment to <span className="font-bold text-slate-800">TAKE U UP</span>.
          </div>
        </div>

        {/* Action Pay Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 bg-slate-300 hover:bg-slate-400 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors border-t border-slate-200 disabled:opacity-75"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
              প্রসেসিং হচ্ছে...
            </span>
          ) : (
            <>
              <Lock size={16} className="text-slate-700" />
              <span>PAY {amount.toFixed(2)} BDT</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
