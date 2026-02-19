import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, ShieldCheck, Search, RefreshCw, Eye, 
  User, UserPlus, X, CheckCircle2 
} from "lucide-react";

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [roleModal, setRoleModal] = useState({ open: false, user: null });
  const [successToast, setSuccessToast] = useState({ show: false, message: "" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (newRole) => {
    const { user } = roleModal;
    if (!user) return;

    try {
      await api.put(`/users/${user.id}`, { role: newRole });
      
      setSuccessToast({ 
        show: true, 
        message: `อัปเดตยศของ ${user.username} เป็น ${newRole} เรียบร้อย!` 
      });

      setRoleModal({ open: false, user: null });
      fetchUsers();

      setTimeout(() => setSuccessToast({ show: false, message: "" }), 2500);
    } catch (err) {
      alert("ไม่สามารถเปลี่ยนสิทธิ์ได้");
    }
  };

  const handleDelete = async (id, username) => {
    if (id === currentUser.id) return alert("❌ มึงลบตัวเองไม่ได้!");
    if (window.confirm(`⚠️ ยืนยันการลบบัญชี ${username}?`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
        setSuccessToast({ show: true, message: "ลบรายชื่อนักแข่งออกแล้ว" });
        setTimeout(() => setSuccessToast({ show: false, message: "" }), 2000);
      } catch (err) { alert("เกิดข้อผิดพลาด"); }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-left relative overflow-hidden font-sans">
      
      {/* Success Toast */}
      <AnimatePresence>
        {successToast.show && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4"
          >
            <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-800">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg"><CheckCircle2 size={24} /></div>
              <div>
                <p className="text-sm font-black tracking-tight">{successToast.message}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Arena Database Updated</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                  <ShieldCheck size={28} />
               </div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Console</h1>
            </div>
            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] ml-1">Player Management & Access Control</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" placeholder="ค้นหาชื่อนักแข่ง..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white shadow-sm rounded-2xl outline-none w-full md:w-80 font-bold transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={fetchUsers} className="p-3.5 bg-white text-slate-600 rounded-2xl hover:bg-blue-600 hover:text-white shadow-sm transition-all active:scale-90">
              <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Player Details</th>
                  <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Role & Rank</th>
                  <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-center text-slate-400">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                          {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : <User size={24} className="text-slate-300" />}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-xl tracking-tight leading-tight">
                            {u.username} {u.id === currentUser.id && <span className="text-blue-500 text-xs">(YOU)</span>}
                          </div>
                          <div className="text-sm text-slate-400 font-bold">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        u.role === 'Admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {u.role === 'User' ? 'Player' : u.role}
                      </span>
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link to={`/admin/users/${u.id}`} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye size={20} />
                        </Link>
                        <button 
                          onClick={() => setRoleModal({ open: true, user: u })}
                          disabled={u.id === currentUser.id}
                          className={`p-3 rounded-xl transition-all ${
                            u.id === currentUser.id ? 'opacity-20 bg-slate-100' : 'bg-blue-50 text-blue-400 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          <UserPlus size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={u.id === currentUser.id}
                          className={`p-3 rounded-xl transition-all ${
                            u.id === currentUser.id ? 'opacity-20 bg-slate-100' : 'bg-red-50 text-red-300 hover:text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {roleModal.open && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShieldCheck size={24} /></div>
                <button onClick={() => setRoleModal({ open: false, user: null })} className="text-slate-300 hover:text-slate-600"><X size={24} /></button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Change Rank</h3>
              <p className="text-slate-500 text-sm font-bold mb-8">ปรับยศใหม่ให้นักแข่ง <span className="text-blue-600">@{roleModal.user?.username}</span></p>

              <div className="grid gap-3">
                {['Admin', 'User'].map((r) => (
                  <button 
                    key={r}
                    onClick={() => handleUpdateRole(r)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      roleModal.user?.role === r ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${r === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {r === 'Admin' ? <ShieldCheck size={18} /> : <User size={18} />}
                      </div>
                      <div className="text-left">
                        <div className="font-black text-slate-800 text-sm">{r === 'Admin' ? 'Admin' : 'Player'}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{r === 'Admin' ? 'System Manager' : 'Competitor'}</div>
                      </div>
                    </div>
                    {roleModal.user?.role === r && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}