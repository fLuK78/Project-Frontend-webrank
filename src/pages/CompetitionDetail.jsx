import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, ArrowLeft, Loader2, Edit3, Check, X,
  Calendar, ShieldCheck, MapPin, Save, Users, AlertTriangle, Trash2, 
  CheckCircle2, Verified, Link as LinkIcon, CreditCard
} from "lucide-react";

export default function CompetitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [competition, setCompetition] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAdminRejectModal, setShowAdminRejectModal] = useState(false);
  const [selectedRegId, setSelectedRegId] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "", description: "", rules: "", prize: "", date: "", location: "", maxPlayer: 0, image: ""
  });

  // --- Logic Helpers ---
  const currentUserRegistration = useMemo(() => {
    if (!user || !players.length) return null;
    return players.find(p => p.userId === user.id && p.status !== 'cancelled');
  }, [players, user]);

  const hasJoined = !!currentUserRegistration;
  const registrationStatus = currentUserRegistration?.status; 
  const isApproved = registrationStatus === 'approved';
  
  const isFull = useMemo(() => {
    if (!competition) return false;
    const approvedCount = players.filter(p => p.status === 'approved').length;
    return competition.maxPlayer > 0 && approvedCount >= competition.maxPlayer;
  }, [competition, players]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [compRes, participantsRes] = await Promise.all([
        api.get(`/competitions/${id}`),
        api.get(`/registrations/competition/${id}`).catch(() => ({ data: { data: [] } }))
      ]);

      const compData = compRes.data.data || compRes.data;
      if (compData) {
        setCompetition(compData);
        setEditForm({
          name: compData.name || "",
          description: compData.description || "",
          rules: compData.rules || "",
          prize: compData.prize || "",
          date: compData.date ? compData.date.split('T')[0] : "",
          location: compData.location || "",
          maxPlayer: compData.maxPlayer || 0,
          image: compData.image || ""
        });
      }

      const participantsData = participantsRes.data.data || [];
      setPlayers(participantsData);

      if (user) {
        const myReg = participantsData.find(p => p.userId === user.id && p.status !== 'cancelled');
        setRegistrationId(myReg ? myReg.id : null);
      }
    } catch (err) {
      showToast("ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (id) fetchData();
  }, [fetchData]);

  // --- Actions ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.put(`/competitions/${id}`, editForm);
      setCompetition(response.data.data || response.data);
      showToast("อัปเดตข้อมูลสำเร็จ!", "success");
      setIsEditing(false);
    } catch (err) {
      showToast(err.response?.data?.message || "ไม่สามารถบันทึกได้", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      showToast("กรุณาเข้าสู่ระบบก่อน", "error");
      return setTimeout(() => navigate("/login"), 1500);
    }
    if (hasJoined || isFull || submitting) return;
    
    setSubmitting(true);
    try {
      await api.post(`/registrations`, { userId: user.id, competitionId: id });
      showToast("สมัครสำเร็จ! กรุณาชำระเงิน", "success");
      fetchData(); 
    } catch (err) {
      showToast(err.response?.data?.message || "สมัครไม่สำเร็จ", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelJoin = async () => {
    const targetId = registrationId || currentUserRegistration?.id;
    if (!targetId) return showToast("ไม่พบข้อมูลการสมัคร", "error");
    
    setSubmitting(true);
    try {
      await api.delete(`/registrations/${targetId}`);
      setRegistrationId(null);
      setPlayers(prev => prev.filter(p => p.id !== targetId)); 
      showToast("ยกเลิกการสมัครแล้ว", "success");
      setShowCancelModal(false);
      fetchData(); 
    } catch (err) {
      showToast(err.response?.data?.message || "ไม่สามารถยกเลิกได้", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (regId, status) => {
    if (status === 'rejected') {
      setSelectedRegId(regId);
      setShowAdminRejectModal(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/registrations/${regId}/status`, { status });
      showToast(`อัปเดตสถานะเป็น ${status} สำเร็จ`, "success");
      fetchData();
    } catch (err) {
      showToast("ไม่สามารถอัปเดตสถานะได้", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmAdminReject = async () => {
    if (!selectedRegId) return;
    setSubmitting(true);
    try {
      await api.put(`/registrations/${selectedRegId}/status`, { status: 'rejected' });
      showToast("ปฏิเสธการสมัครเรียบร้อยแล้ว", "success");
      setShowAdminRejectModal(false);
      fetchData();
    } catch (err) {
      showToast("ไม่สามารถดำเนินการได้", "error");
    } finally {
      setSubmitting(false);
      setSelectedRegId(null);
    }
  };

  if (loading && !competition) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC] font-['Prompt']">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Arena...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-['Prompt'] text-slate-900 overflow-x-hidden">
      
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100, x: "-50%", opacity: 0 }} animate={{ y: 20, x: "-50%", opacity: 1 }} exit={{ y: -100, x: "-50%", opacity: 0 }}
            className={`fixed top-5 left-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl text-white font-black flex items-center gap-3 ${notification.type === 'success' ? 'bg-slate-900 border border-emerald-500/50' : 'bg-rose-600'}`}>
            {notification.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <AlertTriangle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal (User) */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitting && setShowCancelModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><AlertTriangle size={40} /></div>
              <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-2">Cancel Entry?</h3>
              <p className="text-slate-500 font-medium mb-8">คุณแน่ใจหรือไม่ที่จะยกเลิกการสมัคร?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Go Back</button>
                <button onClick={handleCancelJoin} disabled={submitting} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Reject Modal */}
      <AnimatePresence>
        {showAdminRejectModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitting && setShowAdminRejectModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl text-center border border-slate-100">
              <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><X size={48} /></div>
              <h3 className="text-3xl font-black text-slate-800 uppercase italic mb-3">Reject Entry?</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">คุณต้องการปฏิเสธการยืนยันผู้สมัครรายนี้หรือไม่?</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmAdminReject} disabled={submitting} className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Confirm Reject"}
                </button>
                <button onClick={() => setShowAdminRejectModal(false)} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-all">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal (Admin) */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitting && setIsEditing(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                <h2 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2"><Edit3 size={20} className="text-blue-600" /> Edit Tournament</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
              </div>
              <form onSubmit={handleUpdate} className="overflow-y-auto p-8 space-y-6">
                <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Banner Image Preview</label>
                  <div className="relative h-44 w-full rounded-3xl overflow-hidden bg-slate-200 shadow-inner">
                    <img src={editForm.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Paste Image URL" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} className="w-full pl-14 pr-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-2 uppercase">Name</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-2 uppercase">Date</label>
                    <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold focus:bg-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-2 uppercase">Max Players</label>
                    <input type="number" value={editForm.maxPlayer} onChange={(e) => setEditForm({ ...editForm, maxPlayer: parseInt(e.target.value) })} className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold focus:bg-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-2 uppercase">Location</label>
                    <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold focus:bg-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-2 uppercase">Prize</label>
                    <input type="text" value={editForm.prize} onChange={(e) => setEditForm({ ...editForm, prize: e.target.value })} className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold focus:bg-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-2 uppercase">Description</label>
                    <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Update Tournament
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Arena
        </button>
        {user?.role === 'Admin' && (
          <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-black text-[10px] uppercase shadow-lg border border-slate-100 flex items-center gap-2 hover:bg-slate-50 transition-all tracking-widest">
            <Edit3 size={14} className="text-blue-600" /> Edit Tournament
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img src={competition?.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} className="absolute inset-0 w-full h-full object-cover" alt="banner" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90" />
            <div className="absolute bottom-12 left-12 right-12">
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl uppercase italic tracking-tighter">
                {competition?.name}
              </motion.h1>
              <div className="flex items-center gap-6 mt-6">
                <span className="text-blue-400 font-black flex items-center gap-2 tracking-[0.2em] uppercase text-xs">
                  <MapPin size={16} /> {competition?.location || "Online Arena"}
                </span>
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 font-black text-[10px] uppercase tracking-widest border border-white/10">
                  {competition?.gameType || "E-Sports"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex p-3 bg-slate-50/50 gap-2 border-b">
              {['info', 'rules', 'participants'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}>
                  {tab === 'participants' ? `Contenders (${players.length})` : tab}
                </button>
              ))}
            </div>

            <div className="p-10 flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic">Tournament Detail</h3>
                    <p className="text-slate-500 leading-relaxed text-lg whitespace-pre-line bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      {competition?.description || "No description provided."}
                    </p>
                  </motion.div>
                )}
                {activeTab === 'rules' && (
                  <motion.div key="rules" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic">Official Rules</h3>
                    <div className="text-slate-500 leading-relaxed text-lg whitespace-pre-line bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100">
                      {competition?.rules || "Rules will be announced soon."}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'participants' && (
                  <motion.div key="participants" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-slate-800 uppercase italic">Registered Players</h3>
                    </div>
                    {players.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {players.map((p, idx) => (
                          <div key={p.id || idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 border text-lg shadow-sm">
                                {p.user?.name?.[0] || "P"}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-sm">{p.user?.name || "Player"}</p>
                                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                                  p.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                                  p.status === 'waiting' ? 'bg-blue-100 text-blue-600' :
                                  p.status === 'rejected' ? 'bg-rose-100 text-rose-600' :
                                  'bg-amber-100 text-amber-600'
                                }`}>
                                  {p.status === 'waiting' ? 'Checking Slip' : p.status}
                                </span>
                              </div>
                            </div>
                            {user?.role === 'Admin' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleStatusUpdate(p.id, 'approved')} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"><Check size={16} /></button>
                                <button onClick={() => handleStatusUpdate(p.id, 'rejected')} className="p-2.5 bg-rose-500 text-white rounded-xl hover:shadow-lg transition-all"><X size={16} /></button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <Users size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="font-bold text-slate-400 text-sm uppercase">No contenders yet</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl sticky top-10 space-y-10">
            <div className="text-center pb-6 border-b border-slate-50">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Logistics & Rewards</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm"><Trophy size={24} /></div>
                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prize Pool</p><p className="font-black text-xl text-amber-600">{competition?.prize || "TBD"}</p></div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Calendar size={24} /></div>
                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kick-off Date</p><p className="font-black text-lg text-slate-800">{competition?.date ? new Date(competition.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : "Coming Soon"}</p></div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm"><Users size={24} /></div>
                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Players Booked</p><p className="font-black text-xl text-slate-800">{players.filter(p => p.status === 'approved').length} / {competition?.maxPlayer || "∞"}</p></div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <AnimatePresence>
                {/* Approved Status */}
                {isApproved && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4 shadow-sm shadow-emerald-50">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                      <Verified size={20} />
                    </div>
                    <div>
                      <p className="text-emerald-700 font-black text-[11px] uppercase tracking-tighter">Confirmed Entry</p>
                      <p className="text-emerald-600/70 text-[9px] font-medium leading-none mt-1">คุณมีสิทธิ์เข้าแข่งขันเรียบร้อยแล้ว</p>
                    </div>
                  </motion.div>
                )}

                {/* Waiting Status */}
                {registrationStatus === 'waiting' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                    <div>
                      <p className="text-blue-700 font-black text-[11px] uppercase tracking-tighter">Verification Pending</p>
                      <p className="text-blue-600/70 text-[9px] font-medium leading-none mt-1">ได้รับสลิปแล้ว รอแอดมินยืนยันครู่เดียว</p>
                    </div>
                  </motion.div>
                )}

                {/* Rejected Status */}
                {registrationStatus === 'rejected' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-rose-50 rounded-[2rem] border border-rose-100 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                      <X size={20} />
                    </div>
                    <div>
                      <p className="text-rose-700 font-black text-[11px] uppercase tracking-tighter">Rejected</p>
                      <p className="text-rose-600/70 text-[9px] font-medium leading-none mt-1">คุณไม่ได้รับการยืนยันจากแอดมิน กรุณาติดต่อสอบถาม</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleJoin}
                disabled={hasJoined || submitting || isFull}
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl
                  ${hasJoined ? (registrationStatus === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100 cursor-not-allowed shadow-none' : 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100 shadow-none') : isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-900 active:scale-95 shadow-blue-200'}`}
              >
                {submitting && !showCancelModal ? <Loader2 className="animate-spin" /> : 
                 registrationStatus === 'rejected' ? <><X size={18} /> Rejected</> :
                 hasJoined ? <><ShieldCheck size={18} /> Registered</> : 
                 isFull ? "Arena is Full" : "Join the Arena"}
              </button>

              {/* Payment Button (Only if pending) */}
              {hasJoined && !isApproved && registrationStatus === 'pending' && (
                <button
                  onClick={() => navigate(`/payment/${registrationId}`)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all"
                >
                  <CreditCard size={18} /> จ่ายเงิน / ส่งสลิป
                </button>
              )}

              {/* Cancel Button (Only if joined but not approved) */}
              {hasJoined && !isApproved && registrationStatus !== 'rejected' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={submitting}
                  className="w-full py-4 text-rose-500 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <Trash2 size={14} /> Cancel Registration
                </button>
              )}

              {!user && <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4">Login to Join Tournament</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}