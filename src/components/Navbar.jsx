import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  LogOut, User, ShieldCheck, 
  Menu, X, Trophy, AlertTriangle,
  CreditCard // เพิ่ม Icon สำหรับเมนูชำระเงิน
} from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (showLogoutConfirm || isMobileMenuOpen) ? "hidden" : "unset";
  }, [showLogoutConfirm, isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const navLinkCls = ({ isActive }) =>
    `relative px-1 py-2 text-[12px] font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 ${
      isActive ? "text-blue-500" : "text-slate-400 hover:text-white"
    }`;

  const ActiveLine = () => (
    <motion.span 
      layoutId="activeNav"
      className="absolute bottom-[-10px] left-0 h-[2px] w-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
    />
  );

return (
    <>
      <nav className="sticky top-0 z-[45] border-b border-white/5 bg-slate-900 backdrop-blur-xl font-['Prompt']">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3 group active:scale-95 transition-all">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-[10deg] transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Trophy size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-[900] text-white tracking-tighter italic uppercase">
                Arena<span className="text-blue-500"></span>
              </span>
            </Link>

            <div className="hidden md:flex gap-10">
              <NavLink to="/" className={navLinkCls}>
                {({ isActive }) => (
                  <>รายการแข่ง {isActive && <ActiveLine />}</>
                )}
              </NavLink>
              <NavLink to="/my-history" className={navLinkCls}>
                {({ isActive }) => (
                  <>ประวัติของฉัน {isActive && <ActiveLine />}</>
                )}
              </NavLink>
              
              {/* ส่วนที่เพิ่ม: เมนู Admin หลัก */}
              {user?.role === 'Admin' && (
                <>
                  <NavLink to="/admin/users" className={navLinkCls}>
                    {({ isActive }) => (
                      <>จัดการผู้ใช้งาน {isActive && <ActiveLine />}</>
                    )}
                  </NavLink>
                  {/* เพิ่ม Link สำหรับตั้งค่าชำระเงินตรงนี้ */}
                  <NavLink to="/payment/config" className={navLinkCls}>
                    {({ isActive }) => (
                      <>ตั้งค่าชำระเงิน {isActive && <ActiveLine />}</>
                    )}
                  </NavLink>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'Admin' && (
                  <NavLink to="/admin/competitions" className="hidden lg:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white/10 transition-all">
                    <ShieldCheck size={14} /> Admin Portal
                  </NavLink>
                )}

                <div className="flex items-center gap-5 pl-5 border-l border-white/10">
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Player</p>
                      <p className="text-sm font-black text-white leading-none group-hover:text-blue-400 transition-colors">{user.name}</p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg overflow-hidden group-hover:border-blue-500 transition-all">
                      {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <User size={20} className="text-slate-400" />}
                    </div>
                  </Link>

                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={20} />
                  </button>
                </div>

                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">เข้าสู่ระบบ</Link>
                <Link to="/register" className="bg-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">สมัครสมาชิก</Link>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }} 
              className="md:hidden bg-slate-900 border-t border-white/5 p-6 space-y-2"
            >
               <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 font-black text-[12px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">รายการแข่ง</NavLink>
               <NavLink to="/my-history" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 font-black text-[12px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">ประวัติของฉัน</NavLink>
               
               {/* ส่วนที่เพิ่ม: Mobile Admin Menu */}
               {user?.role === 'Admin' && (
                 <>
                  <NavLink to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 font-black text-[12px] uppercase tracking-widest">จัดการผู้ใช้งาน</NavLink>
                  {/* เมนูตั้งค่าชำระเงินสำหรับ Mobile */}
                  <NavLink to="/payment/config" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 text-blue-400 font-black text-[12px] uppercase tracking-widest">ตั้งค่าชำระเงิน</NavLink>
                 </>
               )}
               
               <button onClick={() => { setShowLogoutConfirm(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 text-red-400 font-black text-[12px] uppercase tracking-widest border-t border-white/5 mt-4">ออกจากระบบ</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f172a] rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 text-center border border-white/10"
            >
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-red-500/20">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-[900] text-white mb-3 italic uppercase tracking-tighter">Exit Arena?</h3>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                คุณกำลังจะออกระบบบ  ยืนยันการออกจากระบบ?
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 bg-white/5 hover:bg-white/10 transition-all"
                >
                  ย้อนกลับ
                </button>
                <button 
                  onClick={handleLogout}
                  className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-900/40"
                >
                  ออกจากระบบ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}