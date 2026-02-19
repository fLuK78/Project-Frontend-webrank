import { useEffect, useState } from "react";
import api from "../api/axios"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Calendar, Trash2, Loader2, ArrowLeft, 
  CheckCircle2, AlertTriangle, X, ChevronRight
} from "lucide-react";

export default function MyHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, id: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      const timer = setTimeout(() => {
        if (!user) setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/players/${user.id}/history`);
      setHistory(res.data.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || "ไม่สามารถโหลดประวัติได้";
      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type) => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleConfirmDelete = async () => {
    const registrationId = modal.id;
    try {
      const res = await api.delete(`/players/history/${registrationId}`);
      if (res.data.success || res.status === 200) {
        showToast("ยกเลิกการสมัครสำเร็จแล้ว", "success");
        setHistory(prev => prev.filter(item => item.id !== registrationId));
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "เกิดข้อผิดพลาดในการยกเลิก";
      showToast(errMsg, "error");
    } finally {
      setModal({ show: false, id: null });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-['Prompt']">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Loading History...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6 font-['Prompt'] relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-slate-400 text-[10px] hover:text-blue-600 transition-all mb-4 font-black uppercase tracking-widest group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Arena
            </button>
            <h1 className="text-4xl font-[900] tracking-tight italic uppercase leading-none">
              My <span className="text-blue-600">History</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">จัดการรายการที่คุณเข้าร่วมแข่งขัน</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white border border-slate-200 p-5 rounded-[2rem] flex items-center gap-5 shadow-sm">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Joined</p>
                <p className="text-2xl font-[900] text-slate-900 leading-none">{history.length}</p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* --- Content List --- */}
        <section className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                <Calendar size={32} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">No Tournaments</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">คุณยังไม่ได้สมัครรายการใดๆ ในขณะนี้</p>
              <button 
                onClick={() => navigate('/')} 
                className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
              >
                Find Tournament
              </button>
            </div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center hover:border-blue-200 transition-all duration-300 group shadow-sm"
                >
                  <div 
                    onClick={() => navigate(`/competitions/${item.competition?.id}`)}
                    className="flex-1 flex items-center gap-5 p-6 cursor-pointer"
                  >
                    <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100 group-hover:border-blue-100 transition-all">
                      {item.competition?.image ? (
                        <img src={item.competition.image} className="w-full h-full object-cover" alt="tournament" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Trophy size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                           Registered
                         </span>
                      </div>
                      <h2 className="text-lg font-black group-hover:text-blue-600 transition-colors tracking-tight">
                        {item.competition?.name || "Tournament Name"}
                      </h2>
                      <div className="flex items-center gap-3 text-slate-400 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                          <Calendar size={12} className="text-blue-600"/> 
                          {item.competition?.date ? new Date(item.competition.date).toLocaleDateString('th-TH') : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 sm:p-6 bg-slate-50/50 sm:border-l border-slate-100">
                    <button
                      onClick={() => navigate(`/competitions/${item.competition?.id}`)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-blue-600 hover:text-white transition-all text-slate-400 shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setModal({ show: true, id: item.id }); }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-slate-400 shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </section>
      </div>

      {/* --- Confirmation Modal (Clean Style) --- */}
      <AnimatePresence>
        {modal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl text-center border border-slate-100"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 italic uppercase tracking-tight">Cancel Entry?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                ต้องการยกเลิกการสมัครรายการนี้หรือไม่?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setModal({ show: false, id: null })}
                  className="py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  Keep It
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white bg-slate-900 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Toast (Clean Style) --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-10 left-1/2 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[110] border ${
              toast.type === "success" ? "bg-slate-900 text-white border-slate-800" : "bg-red-600 text-white border-red-500"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} className="text-blue-400" /> : <AlertTriangle size={18} />}
            <span className="text-[11px] font-black uppercase tracking-wider">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors">
               <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}