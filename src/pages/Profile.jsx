import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Save, Loader2, CheckCircle2,
  AlertTriangle, Phone, ChevronLeft,
  ShieldCheck, Image as ImageIcon, Link as LinkIcon, Globe,
  Eye, EyeOff, Upload
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;
  const setUser = auth?.setUser || auth?.updateUser;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์จริงที่จะอัปโหลด
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "", bio: "", location: "", socialLink: "", password: ""
  });

  const countries = ["Thailand", "Japan", "South Korea", "Singapore", "USA", "United Kingdom", "Vietnam", "Malaysia", "Indonesia", "Philippines", "China", "Taiwan", "Germany", "France", "Other"];

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        socialLink: user.socialLink || "",
      }));
      setImagePreview(user.image || "");
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ฟังก์ชันเลือกรูปจากเครื่อง
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return showToast("ขนาดไฟล์ต้องไม่เกิน 5MB", "error");
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // แสดง Preview ทันที
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 10) setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return showToast("กรุณากรอกชื่อของคุณ", "error");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);
      data.append("location", formData.location);
      data.append("socialLink", formData.socialLink);
      if (formData.password) data.append("password", formData.password);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await api.put("/users/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status === 'success') {
        showToast("อัปเดตเรียบร้อย!", "success");
        if (typeof setUser === 'function') setUser(res.data.data);
        setFormData(prev => ({ ...prev, password: "" }));
        setSelectedFile(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "บันทึกไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center bg-[#FBFBFC]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="h-screen bg-[#FBFBFC] font-['Prompt'] text-slate-900 overflow-hidden flex flex-col">

      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-100/20 rounded-full blur-[100px] -z-10" />

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: 50, x: "-50%", opacity: 0 }} animate={{ y: 0, x: "-50%", opacity: 1 }} exit={{ opacity: 0 }}
            className={`fixed top-8 left-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 ${notification.type === 'success' ? 'bg-slate-900 border border-emerald-500/30' : 'bg-red-600'}`}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-400" /> : <AlertTriangle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 max-w-7xl mx-auto w-full flex flex-col p-6 lg:p-10 overflow-hidden">

        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 flex-shrink-0">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-all">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{user.role || 'Player'} Member</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1 overflow-hidden">

          <motion.div variants={itemVariants} className="w-full lg:w-[350px] flex flex-col flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white flex flex-col items-center text-center h-full">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-[2.2rem] overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100">
                  <img src={imagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="Avatar"
                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}` }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-[4px] border-white"></div>
              </div>
              <h2 className="text-2xl font-[900] tracking-tighter mb-2">{formData.name || "Unnamed"}</h2>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-50 px-5 py-2 rounded-full mb-8 inline-block">@{user.username}</p>

              <div className="w-full space-y-4 py-6 border-y border-slate-50 text-left">
                <div className="flex items-center gap-4 font-bold text-slate-600 text-sm"><Phone size={18} className="text-slate-300" /> {formData.phone || "---"}</div>
                <div className="flex items-center gap-4 font-bold text-slate-600 text-sm"><Globe size={18} className="text-slate-300" /> {formData.location || "---"}</div>
                <div className="flex items-center gap-4 font-bold text-slate-600 text-sm truncate"><Mail size={18} className="text-slate-300" /> {formData.socialLink || "---"}</div>
              </div>

              <div className="w-full mt-6 p-5 bg-slate-50/50 rounded-3xl text-left border border-slate-100 flex-1 overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">About Player</p>
                <p className="text-sm text-slate-500 italic leading-relaxed line-clamp-4">"{formData.bio || "This user prefers to stay mysterious."}"</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/30 border border-white flex flex-col overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="p-8 pb-4 flex justify-between items-center flex-shrink-0">
                <div>
                  <h3 className="text-3xl font-[900] tracking-tighter uppercase italic">Account Settings</h3>
                  <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <User className="text-slate-100" size={50} />
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  {/* แก้ไขส่วนอัปโหลดรูปภาพ */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><ImageIcon size={14} /> Profile Picture</label>
                    <div className="relative">
                      <label className="flex items-center gap-3 w-full pl-5 pr-6 py-4 bg-[#FBFBFC] border-2 border-dashed border-slate-100 rounded-2xl text-sm font-bold cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all text-slate-500">
                        <Upload size={18} className="text-blue-600" />
                        {selectedFile ? selectedFile.name : "Click to upload image from computer"}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-[#FBFBFC] rounded-2xl border border-slate-100 font-bold text-sm focus:bg-white outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                    <input type="text" value={formData.phone} onChange={handlePhoneChange} placeholder="08XXXXXXXX" className="w-full px-6 py-4 bg-[#FBFBFC] rounded-2xl border border-slate-100 font-bold text-sm focus:bg-white outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-6 py-4 bg-[#FBFBFC] rounded-2xl border border-slate-100 font-bold text-sm outline-none appearance-none cursor-pointer focus:bg-white">
                        <option value="">Select country</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronLeft size={18} className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Email</label>
                    <input type="email" value={formData.socialLink} onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })} placeholder="example@mail.com" className="w-full px-6 py-4 bg-[#FBFBFC] rounded-2xl border border-slate-100 font-bold text-sm focus:bg-white outline-none" />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio</label>
                    <textarea rows="2" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-6 py-4 bg-[#FBFBFC] rounded-2xl border border-slate-100 font-bold text-sm focus:bg-white outline-none resize-none" />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                    <div className="space-y-2 opacity-60">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Login Email (Locked)</label>
                      <div className="px-6 py-4 bg-slate-50 rounded-2xl text-slate-500 font-bold text-sm border border-slate-100 truncate">{user.email}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Change Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min. 6 chars" className="w-full px-6 py-4 bg-[#FBFBFC] rounded-2xl border border-slate-100 font-bold text-sm focus:bg-white outline-none" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-4 flex-shrink-0">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Update Arena Profile
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}