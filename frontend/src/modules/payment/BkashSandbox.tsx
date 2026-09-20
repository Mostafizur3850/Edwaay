import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Smartphone, Lock, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export const BkashSandbox: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId') || 'sim-pay-123';
  const amount = searchParams.get('amount') || '500.00';
  const orderId = searchParams.get('orderId') || '';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Number, 2: OTP, 3: PIN, 4: Processing
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loaderText, setLoaderText] = useState('');

  // Auto-generate verification code simulation
  useEffect(() => {
    if (step === 2) {
      setErrorMsg(null);
    }
  }, [step]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step === 1) {
      if (phoneNumber.length !== 11 || !phoneNumber.startsWith('01')) {
        setErrorMsg('Please enter a valid 11-digit bKash account number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (otp.length !== 6) {
        setErrorMsg('Please enter the 6-digit verification code.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (pin.length < 4) {
        setErrorMsg('Please enter your 4 or 5-digit PIN.');
        return;
      }
      
      // Execute payment simulation
      setStep(4);
      setLoaderText('Confirming checkout details with bank...');
      
      setTimeout(() => {
        setLoaderText('Verifying merchant invoice allocation...');
        setTimeout(() => {
          setLoaderText('Finalizing tokenized payment execution...');
          setTimeout(() => {
            // Redirect to backend bKash callback API to mark invoice as paid on server
            const backendUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5141/api';
            window.location.href = `${backendUrl}/Payment/bkash/callback?paymentID=${paymentId}&status=success`;
          }, 1500);
        }, 1200);
      }, 1000);
    }
  };

  const handleCancel = () => {
    const backendUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5141/api';
    window.location.href = `${backendUrl}/Payment/bkash/callback?paymentID=${paymentId}&status=cancel`;
  };

  const pressKey = (num: string) => {
    setErrorMsg(null);
    if (step === 1) {
      if (phoneNumber.length < 11) setPhoneNumber(prev => prev + num);
    } else if (step === 2) {
      if (otp.length < 6) setOtp(prev => prev + num);
    } else if (step === 3) {
      if (pin.length < 5) setPin(prev => prev + num);
    }
  };

  const backspace = () => {
    if (step === 1) {
      setPhoneNumber(prev => prev.slice(0, -1));
    } else if (step === 2) {
      setOtp(prev => prev.slice(0, -1));
    } else if (step === 3) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans text-left">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col justify-between min-h-[580px]">
        
        {/* Header Pink Section */}
        <div className="bg-[#E2125B] text-white p-5 flex flex-col items-center justify-center relative">
          <div className="text-2xl font-black italic tracking-wider flex items-center gap-1">
            bKash <span className="text-[10px] uppercase font-bold not-italic border border-white px-1 py-0.2 rounded ml-1 bg-white/10">Sandbox</span>
          </div>
          
          <div className="mt-4 flex justify-between w-full text-xs font-bold border-t border-white/20 pt-3">
            <span className="opacity-90">Invoice Ref: {paymentId.substring(0, 13)}</span>
            <span className="font-extrabold text-white text-sm">৳{amount}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          {step === 4 ? (
            /* Loading State */
            <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-6 text-center">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
              <div>
                <p className="text-pink-600 font-black text-lg">Executing Payment</p>
                <p className="text-slate-500 text-xs mt-1 animate-pulse">{loaderText}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-lg flex items-center gap-2 mb-4">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {step === 1 && (
                  /* Step 1: Phone Number Input */
                  <div className="space-y-4">
                    <div className="text-center">
                      <Smartphone className="mx-auto text-pink-500 mb-2" size={32} />
                      <h4 className="font-bold text-slate-800 text-sm">Your bKash Account Number</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Enter your personal or merchant bKash mobile wallet number</p>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={phoneNumber}
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full text-center py-3 border-2 border-pink-500/30 focus:border-pink-500 rounded-xl bg-slate-50 font-mono font-bold text-lg text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  /* Step 2: OTP Verification */
                  <div className="space-y-4">
                    <div className="text-center">
                      <Shield className="mx-auto text-pink-500 mb-2" size={32} />
                      <h4 className="font-bold text-slate-800 text-sm">bKash Verification Code</h4>
                      <p className="text-[10px] text-slate-400 mt-1">We sent a 6-digit OTP to your mobile wallet phone.</p>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={otp}
                        placeholder="000000"
                        className="w-full text-center py-3 border-2 border-pink-500/30 focus:border-pink-500 rounded-xl bg-slate-50 font-mono font-bold text-lg text-slate-800 tracking-[0.5em] outline-none"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  /* Step 3: PIN Input */
                  <div className="space-y-4">
                    <div className="text-center">
                      <Lock className="mx-auto text-pink-500 mb-2" size={32} />
                      <h4 className="font-bold text-slate-800 text-sm">Enter bKash Wallet PIN</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Securely enter your 5-digit secret transaction PIN code.</p>
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        readOnly
                        value={pin}
                        placeholder="•••••"
                        className="w-full text-center py-3 border-2 border-pink-500/30 focus:border-pink-500 rounded-xl bg-slate-50 font-mono font-bold text-lg text-slate-800 tracking-[0.5em] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sandbox Keypad */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100 mt-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num, i) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => pressKey(num)}
                      className={`py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg rounded-xl transition-all cursor-pointer ${
                        num === '0' ? 'col-span-2' : ''
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={backspace}
                    className="py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    Clear
                  </button>
                </div>

                {/* Confirm Buttons */}
                <div className="flex border-t border-slate-100 pt-4 gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold rounded-xl text-sm transition-all cursor-pointer text-center"
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#E2125B] hover:bg-[#c90d4f] text-white font-extrabold rounded-xl text-sm transition-all shadow-md shadow-pink-200 cursor-pointer text-center"
                  >
                    PROCEED
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="bg-[#B80F4A] py-3 text-center text-[10px] text-white/80 font-medium flex items-center justify-center gap-1">
          <Shield size={10} /> Authorized bKash Payment API Sandbox
        </div>

      </div>
    </div>
  );
};
