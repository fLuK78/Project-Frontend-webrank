import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, ArrowRight, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // เพิ่มสถานะแสดงรหัสผ่าน
  const [pending, setPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      await login(email, password);
      setIsSuccess(true); 
      
      setTimeout(() => {
        navigate("/"); 
      }, 1000);

    } catch (err) {
      setPending(false);
      // ตรวจสอบ Error Code เฉพาะเจาะจง (ถ้า API ส่งมา)
      const errorMessage = err.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center p-6 text-left relative overflow-hidden font-['Prompt']">
      
      {/* Success Toast */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 40, x: "-50%", opacity: 1 }}
            className="fixed top-0 left-1/2 z-[100] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-800"
          >
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="text-sm font-bold tracking-tight">ยืนยันตัวตนสำเร็จ! กำลังเข้าสู่ Arena...</span>
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
            <LogIn size={28} />
          </div>
          <h1 className="text-2xl font-[900] text-slate-900 tracking-tight italic uppercase">Welcome Back</h1>
          <p className="text-slate-400 font-medium mt-1 text-sm">เข้าสู่ระบบเพื่อเริ่มการแข่งขัน</p>
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600"
            >
              <XCircle size={18} className="shrink-0" />
              <p className="text-[11px] font-black uppercase tracking-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 rounded-2xl outline-none font-bold transition-all text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 p-4 pl-12 pr-12 rounded-2xl outline-none font-bold transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={pending || isSuccess}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 mt-2 ${
              pending || isSuccess 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-95'
            }`}
          >
            {pending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-8">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Don't have an account? 
            <Link to="/register" className="text-blue-600 ml-2 hover:underline font-black">Create Account</Link>
          </p>
        </div>
      </motion.div>

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-40"></div>
    </div>
  );
}