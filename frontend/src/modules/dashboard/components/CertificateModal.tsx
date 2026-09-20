import React from 'react';
import { X, Download, Printer, Award, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { StudentCertificate } from '../../../types/types';

interface CertificateModalProps {
  certificate: StudentCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-yellow-400" size={24} />
            <h2 className="text-lg font-bold text-white">Official Certificate of Achievement</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Certificate Template */}
        <div className="p-8 overflow-y-auto">
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black border-4 border-yellow-500/40 rounded-3xl p-10 text-center shadow-2xl overflow-hidden print:border-black print:text-black">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <div className="flex justify-between items-center mb-8">
              <div className="text-left">
                <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                  TAKEUUP
                </span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Education & Career Platform</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 text-xs font-bold">
                <ShieldCheck size={16} /> Verified Credential
              </div>
            </div>

            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Certificate of Completion</h3>
            <p className="text-xs text-slate-500 mb-6">This is proudly awarded to</p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 underline decoration-yellow-500/50 underline-offset-8">
              {certificate.studentName}
            </h1>

            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed mb-6">
              for successfully completing all requirements and achieving excellence in the course <br />
              <strong className="text-yellow-400 text-lg font-bold block mt-1">{certificate.courseOrExamName}</strong>
            </p>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto pt-6 border-t border-slate-800 text-left text-xs mb-8">
              <div>
                <span className="text-slate-500 block">Grade / Score:</span>
                <span className="font-bold text-white text-sm">{certificate.scoreOrGrade}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Issue Date:</span>
                <span className="font-bold text-white text-sm">{certificate.issueDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-4 border-t border-slate-800/80">
              <span>Credential ID: <strong className="text-slate-400">{certificate.verificationCode}</strong></span>
              <span className="flex items-center gap-1"><Sparkles size={12} className="text-yellow-500" /> Authorized Signature</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-400 hover:text-white text-xs font-bold"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Printer size={16} /> Print Certificate
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-yellow-900/20 transition-all"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
