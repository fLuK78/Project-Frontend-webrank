import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Users, Search, ChevronRight, X, Mail, ShieldCheck, User, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // States สำหรับการลบ
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const userData = res.data.data || res.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("ดึงข้อมูลพลาด:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันลบผู้ใช้งาน
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/users/${userToDelete.id}`);
      // อัปเดต State ทันทีเพื่อให้ชื่อที่ลบหายไปจากหน้าจอโดยไม่ต้องโหลดใหม่
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "ไม่สามารถลบผู้ใช้ได้");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user?.name?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    const term = searchTerm.toLowerCase().trim();
    return name.includes(term) || email.includes(term);
  });

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400 font-black tracking-[0.2em] uppercase animate-pulse">
          Synchronizing User Database...
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-12 px-6"
    >
      {/* --- Delete Confirmation Modal --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl z-10 relative overflow-hidden"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">ยืนยันการลบ?</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">
                  คุณต้องการลบคุณ <span className="text-slate-900 font-bold">"{userToDelete?.name}"</span> ใช่หรือไม่?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    disabled={isDeleting}
                    onClick={() => setShowDeleteModal(false)}
                    className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    disabled={isDeleting}
                    onClick={handleDeleteConfirm}
                    className="py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                  >
                    {isDeleting ? "กำลังลบ..." : "ยืนยันการลบ"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="space-y-2">
          <motion.div 
            initial={{ x: -20 }} 
            animate={{ x: 0 }}
            className="flex items-center gap-4 text-blue-600"
          >
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Users size={32} />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em]">Directory</span>
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            พบผู้ใช้งานทั้งหมด <span className="text-blue-600 font-black">{users.length}</span> ท่าน ในระบบ
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full lg:w-96">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ อีเมล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-12 py-5 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={18} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Security Role</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Network Status</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-blue-50/30 transition-colors cursor-default"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-0.5 shadow-inner">
                            <img
                              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random&bold=true`}
                              className="w-full h-full object-cover rounded-[calc(1rem-2px)]"
                              alt={user.name}
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                            {user.name}
                          </span>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail size={12} />
                            <span className="text-xs font-medium">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-10 py-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${user.role === "Admin" 
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                          : "bg-slate-100 text-slate-500 border border-slate-200"}`}
                      >
                        {user.role === "Admin" ? <ShieldCheck size={12} /> : <User size={12} />}
                        {user.role}
                      </div>
                    </td>

                    <td className="px-10 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mx-auto border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </div>
                    </td>

                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {/* ปุ่มลบ */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </motion.button>

                        {/* ปุ่ม View Profile */}
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200"
                        >
                          View
                          <ChevronRight size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-slate-300"
            >
              <div className="p-8 bg-slate-50 rounded-[3rem] mb-6">
                <Search size={64} strokeWidth={1} />
              </div>
              <p className="text-xl font-black uppercase tracking-[0.2em] text-slate-400">
                ไม่พบข้อมูลที่คุณกำลังมองหา
              </p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-8 text-blue-600 font-black uppercase text-sm hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}