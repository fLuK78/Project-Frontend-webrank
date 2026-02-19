import { useEffect, useState } from "react";
import { getCompetitions } from "../api/competition";
import api from "../api/axios"; 
import CompetitionCard from "../components/CompetitionCard";
import { motion, AnimatePresence } from "framer-motion";
import { page, list } from "../animations/motion";
import { Calendar, Loader2, CheckCircle2, AlertCircle, Search, SlidersHorizontal, X, Activity } from "lucide-react";

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningId, setJoiningId] = useState(null); 

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    getCompetitions()
      .then((res) => setCompetitions(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCompetitions = competitions.filter(comp => 
    comp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (id) => {
    try {
      setJoiningId(id);
      await api.post(`/competitions/${id}/join`);
      showToast("ลงทะเบียนเข้าร่วมสำเร็จ!", "success");

      setCompetitions(prev => prev.map(comp => {
        if (comp.id === id) {
          const currentBooked = comp.booked ?? comp.currentPlayers ?? 0;
          return { ...comp, booked: currentBooked + 1, isJoined: true };
        }
        return comp;
      }));
      fetchData(true); 
    } catch (err) {
      const isAlreadyJoined = err.response?.status === 400 || err.response?.status === 409;
      showToast(isAlreadyJoined ? "คุณสมัครรายการนี้ไปแล้ว" : "เกิดข้อผิดพลาดในการสมัคร", "error");
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center font-['Prompt']">
      <Loader2 className="h-8 w-8 text-slate-300 animate-spin mb-4" />
      <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">Loading Arena...</p>
    </div>
  );

  return (
    <motion.div variants={page} initial="hidden" animate="show" className="max-w-7xl mx-auto p-6 md:p-12 text-left relative font-['Prompt']">
      
      {/* --- Notification Toast --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[999] w-full max-w-sm px-4"
          >
            <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              notification.type === 'success' ? "bg-slate-900 border-slate-800 text-white" : "bg-red-600 border-red-500 text-white"
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} />}
              <p className="font-bold text-sm tracking-tight">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Header Section --- */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-[900] text-slate-900 tracking-tight italic uppercase">
              Available <span className="text-blue-600">Events</span>
            </h1>
            <p className="text-slate-500 font-medium">ค้นหาและเข้าร่วมรายการแข่งขันที่กำลังจะมาถึง</p>
          </div>

          {/* ลูกเล่นตรงรายการกำลังเปิดรับ */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm group hover:border-blue-200 transition-colors cursor-default">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <span className="text-[13px] font-black text-slate-700 uppercase tracking-wide">
              {competitions.length} <span className="text-slate-400 ml-1">Tournaments Live</span>
            </span>
          </div>
        </div>

        {/* --- Search & Filter Bar --- */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="ค้นหาชื่อรายการ หรือสถานที่แข่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 font-bold text-slate-700 transition-all placeholder:text-slate-300 placeholder:font-medium shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <SlidersHorizontal size={16} className="text-blue-600" />
            Filter
          </button>
        </div>
      </header>

      {/* --- Competition Grid --- */}
      {filteredCompetitions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">No results found</h3>
          <p className="text-slate-400 text-sm font-medium">ไม่พบรายการที่คุณกำลังมองหา</p>
        </motion.div>
      ) : (
        <motion.div variants={list} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompetitions.map((item) => (
            <CompetitionCard 
              key={`${item.id}-${item.booked || item.currentPlayers}`}
              competition={item} 
              onJoin={() => handleJoin(item.id)}
              isJoined={item.isJoined}
              isLoading={joiningId === item.id}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}