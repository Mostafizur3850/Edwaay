import React, { useState, useEffect } from 'react';
import { Check, X, Clock, RefreshCw, AlertCircle, CheckCircle, UserCheck, Search, Filter, ShieldAlert } from 'lucide-react';
import { fetchAdminGoalRequests, approveGoalRequest, rejectGoalRequest, directSetStudentGoal, fetchAdminGoalCategories } from '../../../services/api';

export const AdminGoalChangeRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Note Modal State
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Direct Set Modal State
  const [showDirectSet, setShowDirectSet] = useState(false);
  const [directUserId, setDirectUserId] = useState('');
  const [directCategoryId, setDirectCategoryId] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [reqData, catData] = await Promise.all([
        fetchAdminGoalRequests(statusFilter === 'All' ? undefined : statusFilter),
        fetchAdminGoalCategories()
      ]);
      setRequests(Array.isArray(reqData) ? reqData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAction = (req: any, type: 'approve' | 'reject') => {
    setSelectedReq(req);
    setActionType(type);
    setAdminNote('');
  };

  const handleConfirmAction = async () => {
    if (!selectedReq || !actionType) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (actionType === 'approve') {
        await approveGoalRequest(selectedReq.id, adminNote);
        setSuccessMsg(`আবেদন অনুমোদিত হয়েছে! (Goal approved for ${selectedReq.userName || selectedReq.userEmail})`);
      } else {
        await rejectGoalRequest(selectedReq.id, adminNote);
        setSuccessMsg(`আবেদন বাতিল করা হয়েছে।`);
      }
      setSelectedReq(null);
      setActionType(null);
      loadData();
    } catch (e: any) {
      setErrorMsg(e.message || "Action failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDirectSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUserId || !directCategoryId) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await directSetStudentGoal(directUserId, directCategoryId);
      setSuccessMsg(`শিক্ষার্থীর গোল সরাসরি পরিবর্তন করা হয়েছে!`);
      setShowDirectSet(false);
      setDirectUserId('');
      setDirectCategoryId('');
      loadData();
    } catch (e: any) {
      setErrorMsg(e.message || "Direct set failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = req.studentName || req.userName || '';
    const email = req.studentEmail || req.userEmail || req.userId || '';
    const currentGoal = req.currentGoalName || '';
    const requestedGoal = req.requestedGoalName || '';

    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      currentGoal.toLowerCase().includes(term) ||
      requestedGoal.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            শিক্ষার্থীদের গোল পরিবর্তন আবেদন (Goal Change Requests)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            শিক্ষার্থীদের আবেদনের প্রেক্ষিতে এডমিন অনুমোদন বা বাতিল করতে পারেন অথবা সরাসরি লক্ষ্য পরিবর্তন করতে পারেন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDirectSet(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition font-medium text-sm shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            সরাসরি গোল পরিবর্তন
          </button>
          <button
            onClick={loadData}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">স্ট্যাটাস:</span>
          {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'Pending' ? 'অপেক্ষমাণ (Pending)' :
               status === 'Approved' ? 'অনুমোদিত (Approved)' :
               status === 'Rejected' ? 'বাতিলকৃত (Rejected)' : 'সব (All)'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, ইমেইল বা বিষয় খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-sm">লোড হচ্ছে...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
          <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-medium text-gray-600">কোন আবেদন পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4">শিক্ষার্থী</th>
                  <th className="p-4">বর্তমান গোল</th>
                  <th className="p-4">আবেদনকৃত গোল</th>
                  <th className="p-4">কারণ (Reason)</th>
                  <th className="p-4">তারিখ</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{req.studentName || req.userName || 'Unnamed Student'}</div>
                      <div className="text-gray-400 text-[11px]">{req.studentEmail || req.userEmail || req.userId}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                        {req.currentGoalName || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold">
                        {req.requestedGoalName || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={req.reason}>
                      {req.reason || 'কোন কারণ উল্লেখ নেই'}
                    </td>
                    <td className="p-4 text-gray-400 whitespace-nowrap">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString('bn-BD') : 'N/A'}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {req.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold">
                          <Clock className="w-3 h-3" /> অপেক্ষমাণ
                        </span>
                      )}
                      {req.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                          <Check className="w-3 h-3" /> অনুমোদিত
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-semibold">
                          <X className="w-3 h-3" /> বাতিল
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenAction(req, 'approve')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition"
                          >
                            <Check className="w-3.5 h-3.5" /> অনুমোদন
                          </button>
                          <button
                            onClick={() => handleOpenAction(req, 'reject')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition"
                          >
                            <X className="w-3.5 h-3.5" /> বাতিল
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">সম্পন্ন</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {selectedReq && actionType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-gray-900">
            <h3 className="text-lg font-bold text-gray-900">
              {actionType === 'approve' ? 'অনুমোদন নিশ্চিত করুন' : 'আবেদন বাতিল নিশ্চিত করুন'}
            </h3>
            <p className="text-xs text-gray-600">
              {selectedReq.studentName || selectedReq.userName || selectedReq.studentEmail || selectedReq.userEmail}-এর আবেদন {actionType === 'approve' ? 'অনুমোদন' : 'বাতিল'} করতে যাচ্ছেন।
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">এডমিন নোট (ঐচ্ছিক):</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="নোট লিখুন..."
                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 font-medium"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setSelectedReq(null); setActionType(null); }}
                className="px-4 py-2 border border-gray-300 bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-md ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                }`}
              >
                {isProcessing ? 'প্রসেসিং...' : actionType === 'approve' ? 'অনুমোদন করুন' : 'বাতিল করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Set Modal */}
      {showDirectSet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleConfirmDirectSet} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-gray-900">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              সরাসরি গোল পরিবর্তন (Direct Set Goal)
            </h3>
            <p className="text-xs text-gray-600">
              শিক্ষার্থীর ইউজার আইডি বা ইমেইল দিয়ে যেকোনো একটি নতুন ক্যাটাগরি সরাসরি অ্যাসাইন করে দিন।
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ইউজার আইডি / ইমেইল</label>
              <input
                type="text"
                required
                placeholder="User ID or Email"
                value={directUserId}
                onChange={(e) => setDirectUserId(e.target.value)}
                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">নতুন গোল ক্যাটাগরি</label>
              <select
                required
                value={directCategoryId}
                onChange={(e) => setDirectCategoryId(e.target.value)}
                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="" className="text-gray-900 bg-white">ক্যাটাগরি নির্বাচন করুন...</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.title} className="text-gray-900 bg-white font-bold">
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub: any) => (
                        <option key={sub.id} value={sub.id} className="text-gray-900 bg-white">
                          {cat.title} ➔ {sub.title}
                        </option>
                      ))
                    ) : (
                      <option value={cat.id} className="text-gray-900 bg-white">{cat.title}</option>
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDirectSet(false)}
                className="px-4 py-2 border border-gray-300 bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white transition shadow-md shadow-emerald-600/20"
              >
                {isProcessing ? 'প্রসেসিং...' : 'গোল সেটিং আপডেট করুন'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
