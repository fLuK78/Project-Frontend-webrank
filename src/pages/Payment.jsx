import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Loader2, Image as ImageIcon, CheckCircle2, QrCode, Edit3, Save } from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion"; // เพิ่มตัวนี้ด้วยนะ

export default function Payment() {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  
  const savedConfig = JSON.parse(localStorage.getItem("payment_config") || "{}");
  const [payInfo, setPayInfo] = useState({
    amount: savedConfig.amount || 300,
    accountNumber: savedConfig.accountNumber || "08x-xxx-xxxx",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State ใหม่สำหรับหน้าจอสำเร็จ
  const [targetCompId, setTargetCompId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "Admin") setIsAdmin(true);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        return Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกิน!', text: 'ขนาดไม่เกิน 5MB นะครับ' });
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const saveAdminConfig = () => {
    localStorage.setItem("payment_config", JSON.stringify(payInfo));
    setIsEditing(false);
    Swal.fire({ icon: 'success', title: 'บันทึกเรียบร้อย', timer: 1500, showConfirmButton: false });
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!file) return Swal.fire({ icon: 'warning', title: 'ลืมแนบรูป!', confirmButtonColor: '#2563eb' });

    const formData = new FormData();
    formData.append("registrationId", registrationId);
    formData.append("amount", payInfo.amount);
    formData.append("method", "PromptPay");
    formData.append("slipImage", file);

    setLoading(true);
    try {
      const response = await api.post("/payments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const compId = response.data.data?.competitionId;
      setTargetCompId(compId);
      
      // เปลี่ยนจาก Swal เป็นการตั้งค่า Success แทน
      setIsSuccess(true); 

    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  // --- หน้าจอ Success (แสดงเมื่อจ่ายเงินเสร็จ) ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-['Prompt']">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-white"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4 tracking-tight">
            Sent <span className="text-blue-600">Success!</span>
          </h2>
          
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            ส่งสลิปเรียบร้อยแล้ว! <br/>
            แอดมินกำลังทำการตรวจสอบสถานะ <br/>
            คุณสามารถเช็คผลได้ในหน้ากิจกรรม
          </p>

          <button 
            onClick={() => targetCompId ? navigate(`/competitions/${targetCompId}`, { replace: true }) : navigate(-1)}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-blue-600 transition-all active:scale-95"
          >
            Back to Arena
          </button>
        </motion.div>
      </div>
    );
  }

  // --- หน้าจอปกติ (ฟอร์มโอนเงิน) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-['Prompt']">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 text-xs font-bold uppercase mb-8">
          <div className="p-2 bg-white rounded-full shadow-sm shadow-slate-200 transition-transform group-hover:-translate-x-1"><ArrowLeft size={16} /></div>
          Back
        </button>
        
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white relative">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                Payment <span className="text-blue-600">Info</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">รายละเอียดการโอนเงิน</p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => isEditing ? saveAdminConfig() : setIsEditing(true)}
                className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
              </button>
            )}
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-blue-900/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             
             {isEditing ? (
               <div className="space-y-4 relative z-10">
                 <div>
                    <label className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">PromptPay Number</label>
                    <input 
                      className="w-full bg-slate-800 border-none rounded-xl mt-1 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                      value={payInfo.accountNumber}
                      onChange={(e) => setPayInfo({...payInfo, accountNumber: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Amount (THB)</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-800 border-none rounded-xl mt-1 text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                      value={payInfo.amount}
                      onChange={(e) => setPayInfo({...payInfo, amount: e.target.value})}
                    />
                 </div>
               </div>
             ) : (
               <div className="space-y-6">
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Official Transfer Account</p>
                 <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                   <div>
                     <span className="text-xs text-slate-500 block mb-1 uppercase">PromptPay</span>
                     <span className="text-2xl font-mono font-bold text-blue-400 tracking-wider">{payInfo.accountNumber}</span>
                   </div>
                   <div className="bg-white/5 p-2 rounded-xl">
                        <QrCode className="text-slate-400" size={32} />
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400 font-bold uppercase">Total Amount</span>
                    <span className="text-3xl font-black italic">{payInfo.amount}.00 <span className="text-xs text-slate-500 font-normal not-italic">THB</span></span>
                 </div>
               </div>
             )}
          </div>

          {!isEditing ? (
            <form onSubmit={handlePay} className="space-y-6">
              <div className="relative group">
                <input type="file" id="slip" className="hidden" onChange={handleFileChange} accept="image/*" />
                <label htmlFor="slip" className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer shadow-inner ${preview ? 'border-blue-500 bg-white shadow-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'}`}>
                  {preview ? (
                    <div className="relative w-full h-full p-4">
                        <img src={preview} className="w-full h-full object-contain rounded-2xl" alt="preview" />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center">
                            <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">เปลี่ยนรูปภาพ</span>
                        </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 inline-block mb-3">
                        <ImageIcon className="text-slate-300" size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">อัปโหลดสลิปที่นี่</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-slate-900 transition-all flex justify-center items-center gap-3 active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={22} /> : <><span>ยืนยันการแจ้งโอน</span><CheckCircle2 size={20} /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
                <button 
                  onClick={saveAdminConfig}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  Save Configuration
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full py-4 text-slate-400 font-bold uppercase text-xs hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}