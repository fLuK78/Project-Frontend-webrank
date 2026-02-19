import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations"); 
      setRegistrations(res.data.data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/registrations/${id}`, { status: newStatus });
      
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg)
      );
    } catch (err) {
      alert("ไม่สามารถอัปเดตสถานะได้");
    }
  };

  const filteredData = registrations.filter(reg => 
    filter === "all" ? true : reg.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Registrations</h1>
          <p className="text-slate-500 font-medium">จัดการสถานะผู้สมัครเข้าแข่งขัน</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === s ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-50">
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">ผู้สมัคร (User ID)</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">รายการแข่งขัน</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest text-center">สถานะ</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence>
              {filteredData.map((reg) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={reg.id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-500">
                        {reg.userId}
                      </div>
                      <span className="font-bold text-slate-700">Player #{reg.userId}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-medium text-slate-600 italic">
                      {reg.competition?.name || `Competition ID: ${reg.competitionId}`}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {reg.status !== "approved" && (
                        <button 
                          onClick={() => handleStatusUpdate(reg.id, "approved")}
                          className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        >
                          APPROVE
                        </button>
                      )}
                      {reg.status !== "rejected" && (
                        <button 
                          onClick={() => handleStatusUpdate(reg.id, "rejected")}
                          className="bg-red-50 text-red-300 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all"
                        >
                          REJECT
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium italic">ไม่พบข้อมูลการสมัครในหมวดหมู่นี้</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}