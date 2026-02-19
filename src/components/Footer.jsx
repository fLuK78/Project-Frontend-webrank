import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import { Facebook, Twitter, Disc as Discord, Github, ArrowRight, Trophy } from "lucide-react"; 

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-white pt-24 pb-12 font-['Prompt'] relative overflow-hidden">
      {/* 🌌 Background Glow Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Section */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
                 <Trophy className="text-white" size={24} />
              </div>
              <span className="text-3xl font-[900] tracking-tighter italic uppercase">
                Arena<span className="text-blue-500"></span>
              </span>
            </Link> 
            
            <p className="mt-8 text-slate-400 max-w-sm leading-[1.8] font-medium text-base">
              จุดเริ่มต้นของความยิ่งใหญ่ แพลตฟอร์มที่เหล่านักสู้มารวมตัวกัน 
              สร้างมาตรฐานใหม่ให้กับวงการ E-Sports ไทยสู่ระดับสากล
            </p>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-2">
              <div className="w-4 h-[2px] bg-blue-600"></div> Navigation
            </h4>
            <ul className="space-y-5 text-[15px] font-bold">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-all flex items-center gap-3 group">
                  <span className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span> 
                  Tournament List
                </Link>
              </li>
              <li>
                <Link to="/my-history" className="text-slate-400 hover:text-white transition-all flex items-center gap-3 group">
                   <span className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span> 
                   Match History
                </Link>
              </li>
              {user?.role === 'Admin' && (
                <li>
                  <Link to="/admin/competitions" className="text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-3 group">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span> 
                    Admin Portal
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Support Section */}
          <div className="md:col-span-4">
            <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-2">
              <div className="w-4 h-[2px] bg-blue-600"></div> Support Center
            </h4>
            <div className="grid grid-cols-1 gap-5">
               <Link to="/how-to" className="group">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-blue-500/30 transition-all">
                     <p className="text-sm font-black uppercase tracking-widest mb-1 text-slate-200">Help Desk</p>
                     <p className="text-xs text-slate-500 font-medium">วิธีการสมัครและขั้นตอนการแข่งขัน</p>
                  </div>
               </Link>
               <Link to="/contact" className="group">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-blue-500/30 transition-all">
                     <p className="text-sm font-black uppercase tracking-widest mb-1 text-slate-200">Contact Us</p>
                     <p className="text-xs text-slate-500 font-medium">ติดต่อฝ่ายสนับสนุน 24 ชั่วโมง</p>
                  </div>
               </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
              © {currentYear} ARENA PLATFORM. BUILT FOR CHAMPIONS.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}