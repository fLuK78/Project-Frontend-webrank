import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Check, X, Eye, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminApproval() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const res = await api.get("/payments/pending");
      setPayments(res.data.data || []);
    } catch (err) {
      console.error("ดึงข้อมูลพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    const note = status === "VERIFIED" ? "ชำระเงินเรียบร้อย" : prompt("ระบุเหตุผลที่ปฏิเสธ:");
    if (status === "REJECTED" && !note) return;

    try {
      await api.patch(`/payments/verify/${id}`, { status, adminNote: note });
      setPayments(payments.filter(p => p.id !== id));
      alert("อัปเดตสถานะสำเร็จ");
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-['Prompt']">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-[900] text-slate-900 mb-8 uppercase italic italic">
          Payment <span className="text-blue-600">Verification</span>
        </h1>

        {payments.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center shadow-sm border border-dashed border-slate-200">
            <ImageIcon className="mx-auto mb-4 text-slate-200" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending payments</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((pay) => (
              <motion.div layout key={pay.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center gap-6 border border-white">
                <div className="w-24 h-24 bg-slate-100 rounded-3xl overflow-hidden cursor-zoom-in group relative"
                  onClick={() => setSelectedImage(`${import.meta.env.VITE_API_URL}/uploads/slips/${pay.slipImage}`)}>
                  <img src={`${import.meta.env.VITE_API_URL}/uploads/slips/${pay.slipImage}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Eye size={20} />
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-black text-slate-900 text-lg uppercase">{pay.registration?.user?.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{pay.registration?.competition?.name}</p>
                  <p className="font-black text-xl mt-1 text-slate-700">฿{pay.amount}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleVerify(pay.id, "REJECTED")} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                    <X size={20} />
                  </button>
                  <button onClick={() => handleVerify(pay.id, "VERIFIED")} className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all">
                    <Check size={18} /> Approve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
             <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} className="max-h-full max-w-full rounded-2xl shadow-2xl border-4 border-white/10" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}