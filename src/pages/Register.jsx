import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, User, ShieldCheck, Loader2, ArrowRight, CheckCircle2, XCircle, Info } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [acceptTerms, setAcceptTerms] = useState(false); 
  const [pending, setPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (form.username.length < 4) return "Username ต้องมีอย่างน้อย 4 ตัวอักษร";
    if (form.password.length < 8) return "Password ต้องมีอย่างน้อย 8 ตัวอักษร";
    if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return "Password ต้องประกอบด้วยตัวพิมพ์ใหญ่และตัวเลขอย่างน้อย 1 ตัว";
    }
    if (!acceptTerms) return "กรุณายอมรับข้อกำหนดและเงื่อนไขการใช้งาน";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    try {
      await register(form);
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setPending(false);
      setError(err.response?.data?.message || "การสมัครล้มเหลว: อีเมลหรือยูสเซอร์เนมนี้อาจถูกใช้ไปแล้ว");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center p-6 text-left relative overflow-hidden font-['Prompt']">
      
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 40, x: "-50%", opacity: 1 }}
            className="fixed top-0 left-1/2 z-[100] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl"
          >
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="text-sm font-bold tracking-tight">Account Created! Redirecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 border border-slate-100 z-10"
      >
        <div className="mb-10 text-center">
          <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-200">
            <UserPlus size={28} />
          </div>
          <h1 className="text-2xl font-[900] text-slate-900 tracking-tight italic uppercase">Join the Arena</h1>
          <p className="text-slate-400 font-medium mt-1 text-sm">สร้างบัญชีผู้แข่งขันใหม่ของคุณ</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600"
            >
              <XCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold uppercase leading-tight tracking-wide">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Username</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" required
                className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all text-sm"
                placeholder="ขั้นต่ำ 4 ตัวอักษร"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Display Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" required
                className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all text-sm"
                placeholder="ชื่อที่ใช้ในสนามแข่ง"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" required
                className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all text-sm"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" required
                className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all text-sm"
                placeholder="8+ ตัวอักษร (มีตัวใหญ่และตัวเลข)"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 py-2">
            <input 
              type="checkbox" 
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 leading-tight">
              ฉันยอมรับ <Link to="/terms" className="text-blue-600 underline">เงื่อนไขการใช้งาน</Link> และนโยบายความเป็นส่วนตัว
            </label>
          </div>

          <button 
            disabled={pending || isSuccess}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 mt-4 ${
              pending || isSuccess 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-lg active:scale-95'
            }`}
          >
            {pending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-8">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Already have an account? 
            <Link to="/login" className="text-blue-600 ml-2 hover:underline font-black">Sign In</Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-40"></div>
    </div>
  );
}