import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { page, list, card } from "../../animations/motion";
import { 
  Trophy, Plus, Trash2, Eye, Calendar, Users, 
  Coins, Loader2, CheckCircle2, X, AlertTriangle, Image as ImageIcon
} from "lucide-react";

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState({ show: false, message: "" });
  
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    maxPlayer: "",
    date: "",
    rules: "",
    prize: "",
    image: "" 
  });

  const navigate = useNavigate();

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/competitions");
      const data = res.data.data || res.data; 
      setCompetitions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const showToast = (msg) => {
    setSuccessToast({ show: true, message: msg });
    setTimeout(() => setSuccessToast({ show: false, message: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.maxPlayer) return alert("กรุณากรอกชื่อและจำนวนผู้สมัคร");
    
    setIsSubmitting(true);
    try {
      await api.post("/competitions", {
        ...form,
        maxPlayer: Number(form.maxPlayer),
      });
      
      showToast(`สร้างรายการ ${form.name} สำเร็จ!`);
      setForm({ name: "", maxPlayer: "", date: "", rules: "", prize: "", image: "" });
      fetchCompetitions();
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการสร้าง: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActuallyDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/competitions/${deleteId}`);
      showToast("ลบรายการแข่งขันเรียบร้อยแล้ว");
      fetchCompetitions();
      setDeleteId(null);
    } catch (err) {
      alert("ไม่สามารถลบได้");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen text-left relative font-sans"
    >
      
      {/* Success Toast & Delete Modal (เหมือนเดิม) */}
      <AnimatePresence>
        {successToast.show && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
            <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-800">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg"><CheckCircle2 size={24} /></div>
              <div className="flex-grow">
                <p className="text-sm font-black tracking-tight">{successToast.message}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Arena Tournament System</p>
              </div>
              <button onClick={() => setSuccessToast({ show: false })} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><AlertTriangle size={40} /></div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">ยืนยันการลบ?</h3>
              <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">คุณกำลังจะลบรายการนี้ถาวร <br/> ข้อมูลผู้สมัครทั้งหมดจะหายไปนะมึง!</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleActuallyDelete} disabled={isDeleting} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">{isDeleting ? <Loader2 className="animate-spin" size={16} /> : "ยืนยันลบรายการ"}</button>
                <button onClick={() => setDeleteId(null)} className="w-full bg-slate-50 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">ยกเลิก</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><Trophy size={32} /></div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">จัดการการแข่งขัน</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 ml-1">Tournament Management Console</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 border border-slate-100 rounded-[2.5rem] p-8 shadow-xl bg-white">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-3"><Plus size={24} className="text-blue-600" /> เพิ่มการแข่งขัน</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ชื่อรายการ</label>
                <input name="name" placeholder="ชื่อรายการ..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl outline-none font-medium" />
              </div>

              {/*  เพิ่มช่องกรอก URL รูปภาพ */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 text-blue-600">URL รูปภาพหน้าปก</label>
                <div className="relative">
                  <input name="image" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-blue-50/50 border-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-2xl outline-none font-medium text-xs text-blue-700" />
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ผู้สมัคร</label>
                  <input name="maxPlayer" type="number" placeholder="0" value={form.maxPlayer} onChange={(e) => setForm({ ...form, maxPlayer: e.target.value })} className="w-full bg-slate-50 ring-1 ring-slate-200 p-4 rounded-2xl outline-none font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">วันที่แข่ง</label>
                  <input name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 ring-1 ring-slate-200 p-4 rounded-2xl outline-none font-medium text-sm" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">เงินรางวัล</label>
                <input name="prize" placeholder="เช่น 10,000 THB" value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} className="w-full bg-slate-50 ring-1 ring-slate-200 p-4 rounded-2xl outline-none font-medium" />
              </div>

              <button disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-blue-600'} text-white py-4 rounded-2xl font-black transition-all shadow-lg uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 mt-2`}>
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Plus size={16} /> สร้างการแข่งขัน</>}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300"><Loader2 className="animate-spin mb-4" size={40} /><p className="font-bold uppercase tracking-[0.2em] text-[10px]">กำลังดึงข้อมูล...</p></div>
          ) : (
            <motion.div variants={list} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competitions.length > 0 ? competitions.map((c) => (
                <motion.div
                  key={c.id}
                  variants={card}
                  whileHover={{ y: -8 }}
                  className="group border border-slate-100 rounded-[2.5rem] shadow-sm bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden flex flex-col"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = "https://placehold.co/600x400/1e293b/white?text=No+Image"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                        <Trophy size={48} strokeWidth={1} />
                      </div>
                    )}
                    {/* ID Badge on Image */}
                    <div className="absolute top-4 right-4">
                      <span className="text-[9px] font-black text-white/90 uppercase tracking-widest px-3 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/10">ID: {c.id}</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-7">
                    <h3 className="font-black text-xl text-slate-800 mb-4 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">{c.name}</h3>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                        <Users size={14} className="mr-3 text-blue-500" /> รับสมัคร {c.maxPlayer} คน
                      </div>
                      <div className="flex items-center text-[11px] font-bold text-slate-500">
                        <Calendar size={14} className="mr-3 text-slate-400" /> {new Date(c.date).toLocaleDateString('th-TH', { dateStyle: 'long' })}
                      </div>
                      {c.prize && (
                        <div className="flex items-center text-[11px] font-bold text-emerald-600">
                          <Coins size={14} className="mr-3 text-emerald-500" /> {c.prize}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => navigate(`/competitions/${c.id}`)} className="flex-grow flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Eye size={14} /> รายละเอียด
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="px-5 bg-slate-50 text-slate-300 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ยังไม่มีรายการการแข่งขัน</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}