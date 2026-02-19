import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Facebook, Mail, Send, Loader2 } from "lucide-react"; 
import emailjs from "@emailjs/browser"; 
import Swal from "sweetalert2"; 

export default function Contact() {
  const formRef = useRef(); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // --- ส่วนที่ใส่ค่าจาก EmailJS Dashboard  ---
    const SERVICE_ID = "service_6jgjdz1"; 
    const TEMPLATE_ID = "template_b3752uq";
    const PUBLIC_KEY = "Uj02f1ir6mtm_rd7Q"; 

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'ส่งข้อความสำเร็จ!',
          text: 'Arena ได้รับข้อความของคุณแล้ว เราจะติดต่อกลับโดยเร็วที่สุด',
          confirmButtonColor: '#2563eb',
          customClass: { 
            popup: 'rounded-[2.5rem] font-["Prompt"] border border-white/10 bg-[#0f172a] text-white' 
          }
        });
        setFormData({ name: "", email: "", message: "" }); 
      })
      .catch((error) => {
        setLoading(false);
        console.error("EmailJS Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่ภายหลัง',
        });
      });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 text-left font-['Prompt']">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs">Get In Touch</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black text-slate-900 mt-4 tracking-tight">ติดต่อสอบถาม</motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ข้อมูลการติดต่อ */}
          <div className="lg:col-span-5 space-y-6">
            <ContactCard 
              icon={<MessageSquare size={28} />} 
              title="Discord" 
              value="Join Our Community" 
              color="bg-[#5865F2]" 
              link="https://discord.gg/C62zqq8A9v"
            />
            <ContactCard 
              icon={<Facebook size={28} />} 
              title="Facebook" 
              value="Official Arena Page" 
              color="bg-[#1877F2]" 
              link="https://mail.google.com/mail/u/0/#inbox"
            />
            <ContactCard 
              icon={<Mail size={28} />} 
              title="Email" 
              value="kuki78za@gmail.com" 
              color="bg-slate-800" 
              link="kuki78za@gmail.com"
            />
          </div>

          {/* ฟอร์มส่งข้อความ */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">ชื่อของคุณ</label>
                    <input 
                      name="name" // เปลี่ยนให้ตรงกับ {{name}} ใน Template
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl outline-none transition-all font-bold" 
                      placeholder="Username" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">อีเมลติดต่อกลับ</label>
                    <input 
                      name="email" // เปลี่ยนให้ตรงกับ {{email}} ใน Template
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl outline-none transition-all font-bold" 
                      placeholder="email@example.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">ข้อความ</label>
                  <textarea 
                    name="message" // ตรงกับ {{message}} ใน Template
                    required
                    rows="5" 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl outline-none transition-all font-bold" 
                    placeholder="พิมพ์ข้อความของคุณ..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${loading ? "bg-slate-400" : "bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-blue-100"}`}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> SEND MESSAGE</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, value, color, link }) {
  return (
    <motion.a href={link} target="_blank" rel="noreferrer" whileHover={{ x: 10 }} className="flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className={`h-16 w-16 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{value}</p>
      </div>
    </motion.a>
  );
}