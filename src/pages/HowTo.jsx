import { CheckCircle2, UserPlus, Trophy, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HowTo() {
  const steps = [
    { 
      icon: <UserPlus size={28} />, 
      title: "สมัครสมาชิก", 
      desc: "สร้างบัญชีผู้ใช้งานของคุณให้เรียบร้อยเพื่อเริ่มต้นเข้าสู่ระบบ",
      color: "bg-blue-600"
    },
    { 
      icon: <Trophy size={28} />, 
      title: "เลือกรายการแข่ง", 
      desc: "ค้นหาทัวร์นาเมนต์ที่ใช่สำหรับคุณ และกดปุ่มสมัครเข้าร่วม",
      color: "bg-indigo-600"
    },
    { 
      icon: <CreditCard size={28} />, 
      title: "ชำระเงิน", 
      desc: "แนบหลักฐานการโอนเงิน (ถ้ามีค่าสมัคร) เพื่อยืนยันสิทธิ์ในระบบ",
      color: "bg-violet-600"
    },
    { 
      icon: <CheckCircle2 size={28} />, 
      title: "รอตรวจสอบ", 
      desc: "แอดมินจะตรวจสอบข้อมูลและประกาศสายการแข่งให้คุณทราบ",
      color: "bg-emerald-600"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="max-w-5xl mx-auto py-20 px-6 text-left"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="text-center mb-20">
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight text-center">
          วิธีการสมัคร<span className="text-blue-600">เข้าร่วม</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg leading-relaxed text-center">
          ทำตาม 4 ขั้นตอนง่ายๆ เพื่อเริ่มต้นเส้นทางสู่แชมป์ใน ARENA
        </p>
      </motion.div>

      {/* Grid Steps - อันนี้ปรับเป็น Static Card แล้ว */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-8 items-start transition-all"
          >
            {/* Number Badge */}
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg border-4 border-white">
              {index + 1}
            </div>

            {/* Icon Box */}
            <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
              {step.icon}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>

            {/* Decoration */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 rounded-br-[2.5rem] -z-10 opacity-50" />
          </motion.div>
        ))}
      </div>

      {/* Note Section แทนที่ CTA แบบกด */}
      <motion.div 
        variants={cardVariants}
        className="mt-20 p-8 rounded-[2.5rem] bg-slate-900 text-center"
      >
        <p className="text-slate-400 font-bold text-sm tracking-[0.2em] uppercase">
          Arena Tournament System v1.0
        </p>
      </motion.div>
    </motion.div>
  );
}