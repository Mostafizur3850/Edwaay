import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  UserCheck, 
  Calendar, 
  Download, 
  X, 
  MapPin, 
  DollarSign, 
  Clock,
  Send,
  LogOut,
  Building2,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmployerDashboardProps {
    onLogout?: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('jobs'); // Default to Jobs View
  const navigate = useNavigate();
  
  // Job Posting State
  const [jobs, setJobs] = useState<any[]>([]);
  
  // Applications State
  const [applications, setApplications] = useState<any[]>([]);
  const [reviewApp, setReviewApp] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
      type: 'online',
      date: '',
      time: '',
      link: '',
      location: '',
      message: ''
  });

  useEffect(() => {
      // Load Jobs
      const storedJobs = localStorage.getItem('takeuup_jobs');
      if (storedJobs) setJobs(JSON.parse(storedJobs));

      // Load Applications
      const storedApps = localStorage.getItem('takeuup_applications');
      if (storedApps) setApplications(JSON.parse(storedApps));
  }, [activeView]);

  const handleDeleteJob = (id: number) => {
      if(window.confirm("Are you sure you want to delete this job?")) {
          const updated = jobs.filter(j => j.id !== id);
          setJobs(updated);
          localStorage.setItem('takeuup_jobs', JSON.stringify(updated));
      }
  };

  const updateAppStatus = (id: number, status: string) => {
      const updated = applications.map(app => app.id === id ? { ...app, status } : app);
      setApplications(updated);
      localStorage.setItem('takeuup_applications', JSON.stringify(updated));
      if (reviewApp) setReviewApp((prev: any) => ({ ...prev, status }));
  };

  const handleSendInvite = (e: React.FormEvent) => {
      e.preventDefault();
      updateAppStatus(reviewApp.id, 'Interview Scheduled');
      alert(`Invitation sent to ${reviewApp.email}`);
      setShowScheduleModal(false);
      setReviewApp(null);
  };

  const navigateToPostJob = () => {
      navigate('/jobs/create');
  };

  const handleLogoutClick = () => {
      if (onLogout) onLogout();
      navigate('/');
  };

  // --- Render Functions ---

  const renderOverview = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-slate-400 text-sm font-medium">Active Jobs</h3>
                  <div className="text-3xl font-bold text-white mt-2">{jobs.length}</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-slate-400 text-sm font-medium">Total Applicants</h3>
                  <div className="text-3xl font-bold text-white mt-2">{applications.length}</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-slate-400 text-sm font-medium">Interviews Scheduled</h3>
                  <div className="text-3xl font-bold text-green-400 mt-2">
                      {applications.filter(a => a.status === 'Interview Scheduled').length}
                  </div>
              </div>
          </div>

          <div className="flex gap-4">
              <button onClick={navigateToPostJob} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white p-8 rounded-2xl text-left transition-colors group">
                  <Plus className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-bold">Post a New Job</div>
                  <div className="text-violet-200 text-sm mt-1">Create a new listing</div>
              </button>
              <button onClick={() => setActiveView('applications')} className="flex-1 bg-slate-800 hover:bg-slate-750 text-white p-8 rounded-2xl border border-slate-700 text-left transition-colors group">
                  <UserCheck className="w-8 h-8 mb-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-bold">Review Applications</div>
                  <div className="text-slate-400 text-sm mt-1">Manage candidates</div>
              </button>
          </div>
      </div>
  );

  const renderJobList = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Job Listings</h2>
              <button onClick={navigateToPostJob} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-900/20 transition-all">
                  <Plus size={20} /> Post New Job
              </button>
          </div>
          
          <div className="grid gap-4">
            {jobs.map(job => (
                <div key={job.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex justify-between items-center group hover:border-violet-500/50 transition-all">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{job.title}</h3>
                        <div className="flex gap-4 text-slate-400 text-sm mt-1">
                            <span className="flex items-center gap-1"><Building2 size={14}/> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">{job.applicants || 0}</div>
                            <div className="text-xs text-slate-500 uppercase">Applicants</div>
                        </div>
                        <div className="h-10 w-px bg-slate-700"></div>
                        <button onClick={() => handleDeleteJob(job.id)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition-colors" title="Delete Job">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
            {jobs.length === 0 && (
                <div className="text-slate-500 text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
                    <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No jobs posted yet.</p>
                    <button onClick={navigateToPostJob} className="text-violet-400 hover:text-violet-300 text-sm mt-2 font-bold">Create your first post</button>
                </div>
            )}
          </div>
      </div>
  );

  const renderApplications = () => (
      <div className="space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-bold text-white">Candidate Applications</h2>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs">
                      <tr>
                          <th className="px-6 py-4">Candidate</th>
                          <th className="px-6 py-4">Applied For</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                      {applications.map(app => (
                          <tr key={app.id} className="hover:bg-slate-700/50">
                              <td className="px-6 py-4">
                                  <div className="font-bold text-white">{app.name}</div>
                                  <div className="text-xs">{app.email}</div>
                              </td>
                              <td className="px-6 py-4">{app.jobTitle}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      app.status === 'Interview Scheduled' ? 'bg-green-500/10 text-green-400' : 
                                      app.status === 'Pending Test' ? 'bg-yellow-500/10 text-yellow-400' :
                                      'bg-blue-500/10 text-blue-400'
                                  }`}>
                                      {app.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                  <button onClick={() => alert("Downloading CV...")} className="p-2 hover:bg-slate-600 rounded text-blue-400" title="Download CV"><Download size={16} /></button>
                                  <button onClick={() => { setReviewApp(app); setShowScheduleModal(true); }} className="p-2 hover:bg-slate-600 rounded text-green-400" title="Schedule"><Calendar size={16} /></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              {applications.length === 0 && <div className="p-12 text-center text-slate-500">No applications received yet.</div>}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center font-bold text-white">E</div>
                    <div>
                        <div className="font-bold text-lg leading-tight">Employer</div>
                        <div className="text-xs text-slate-500">Portal</div>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {[
                    { id: 'jobs', label: 'Job Listings', icon: Briefcase },
                    { id: 'applications', label: 'Applications', icon: Users },
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            activeView === item.id 
                            ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto h-screen">
            {activeView === 'overview' && renderOverview()}
            {activeView === 'jobs' && renderJobList()}
            {activeView === 'applications' && renderApplications()}
        </main>

        {/* Schedule Modal */}
        {showScheduleModal && reviewApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 relative">
                    <button onClick={() => setShowScheduleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                    <h3 className="text-xl font-bold text-white mb-4">Schedule Interview</h3>
                    <p className="text-slate-400 text-sm mb-4">Invite <strong>{reviewApp.name}</strong> for {reviewApp.jobTitle}</p>
                    
                    <form onSubmit={handleSendInvite} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                <input type="date" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                                <input type="time" value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                                <option value="online">Online (Google Meet)</option>
                                <option value="onsite">On-site (Office)</option>
                            </select>
                        </div>
                        {scheduleData.type === 'online' ? (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link</label>
                                <input type="text" value={scheduleData.link} onChange={e => setScheduleData({...scheduleData, link: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                                <input type="text" value={scheduleData.location} onChange={e => setScheduleData({...scheduleData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                            <textarea rows={3} value={scheduleData.message} onChange={e => setScheduleData({...scheduleData, message: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl">Send Invitation</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};