import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Mail, Phone, Shield, Calendar, 
  MapPin, ExternalLink, Trash2, AlertCircle, 
  User, Globe, Info, Clock
} from "lucide-react";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setPlayer(res.data.data);
      } catch (err) {
        alert("ดึงข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${id}`);
      setShowDeleteModal(false);
      navigate("/admin/users"); 
    } catch (err) {
      alert(err.response?.data?.message || "ไม่สามารถลบผู้ใช้ได้");
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    </div>
  );

  if (!player) return <div className="text-center py-20 text-red-500 font-black">ไม่พบผู้เล่นคนนี้ในระบบ</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-['Prompt']">
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl z-10 relative overflow-hidden">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><AlertCircle size={32} /></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">ยืนยันการลบผู้ใช้?</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">คุณกำลังจะลบ <span className="text-slate-900 font-bold">"{player.name}"</span> ข้อมูลทั้งหมดจะหายไปและไม่สามารถกู้คืนได้</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">ยกเลิก</button>
                  <button onClick={handleDelete} className="py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all">ลบเลย</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 font-black transition-all uppercase text-[10px] tracking-[0.2em]">
          <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all"><ArrowLeft size={16} /></div>
          Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white">
          
          {/* Header ส่วนรูปโปรไฟล์ */}
          <div className="relative pt-16 px-10 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] border-[6px] border-slate-50 overflow-hidden bg-slate-100 shadow-xl">
                  <img 
                    src={player.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`} 
                    className="w-full h-full object-cover" 
                    alt="profile"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${player.name}&background=0D8ABC&color=fff`; }}
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="mb-2 text-center md:text-left flex-grow">
                <h1 className="text-4xl font-[900] text-slate-900 tracking-tighter mb-1">{player.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <span className="px-4 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-200">
                    {player.role || 'Player'}
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    @{player.username}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            
            {/* ส่วนของ Bio / About */}
            <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100/50">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Info size={14} /> Player Biography
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{player.bio || "ผู้เล่นคนนี้ยังไม่ได้เพิ่มข้อมูลแนะนำตัวลงในระบบ"}"
                </p>
            </div>

            {/* ข้อมูลรายละเอียดส่วนตัว */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ข้อมูลติดต่อ */}
              <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" /> Contact Info
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><Mail size={18}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-slate-700">{player.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><Phone size={18}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-slate-700">{player.phone || "ไม่ได้ระบุ"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><ExternalLink size={18}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Social / Portfolio</p>
                      <p className="text-sm font-bold text-blue-600 truncate max-w-[180px]">{player.socialLink || "ไม่ได้ระบุ"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ข้อมูลที่ตั้งและเวลา */}
              <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Globe size={16} className="text-emerald-500" /> Location & Activity
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><MapPin size={18}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location / Country</p>
                      <p className="text-sm font-bold text-slate-700">{player.location || "ไม่ได้ระบุ"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><Calendar size={18}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined Since</p>
                      <p className="text-sm font-bold text-slate-700">{formatDate(player.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><Clock size={18}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <p className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active Account
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-medium text-slate-400 italic">
                ID อ้างอิงระบบ: {player.id}
              </p>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-red-200"
              >
                <Trash2 size={14} className="group-hover:animate-bounce" />
                Terminate User Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}