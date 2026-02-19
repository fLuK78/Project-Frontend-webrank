import { ShieldAlert, Info, Scale, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Terms() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto py-20 px-6 text-left"
    >
      <motion.div variants={itemVariants} className="text-center mb-16">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-3xl text-blue-600 mb-6 cursor-default"
        >
          <ShieldAlert size={40} />
        </motion.div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">ข้อกำหนดและเงื่อนไข</h1>
        <p className="text-slate-500 font-medium">กรุณาอ่านและทำความเข้าใจกฎกติกาการใช้งานแพลตฟอร์ม ARENA</p>
      </motion.div>

      <div className="grid gap-8">
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 transition-shadow"
        >
          <div className="flex items-start gap-5">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Info size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-3">1. การสมัครสมาชิกและข้อมูล</h3>
              <ul className="space-y-3 text-slate-600 font-medium list-disc pl-5">
                <li>ผู้สมัครต้องกรอกข้อมูลชื่อ-นามสกุล และข้อมูลติดต่อที่เป็นความจริง</li>
                <li>หนึ่งผู้ใช้งานสามารถมีบัญชีได้เพียง 1 บัญชีเท่านั้น</li>
                <li>หากตรวจพบข้อมูลเท็จ ระบบขอสงวนสิทธิ์ในการระงับบัญชีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 transition-shadow"
        >
          <div className="flex items-start gap-5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Scale size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-3">2. กฎกติกาการแข่งขัน</h3>
              <ul className="space-y-3 text-slate-600 font-medium list-disc pl-5">
                <li>การตัดสินของคณะกรรมการ (Admin) ในทุกรายการแข่งขันถือเป็นที่สิ้นสุด</li>
                <li>ห้ามใช้โปรแกรมโกง หรือการกระทำใดๆ ที่เอาเปรียบผู้เล่นท่านอื่น</li>
                <li>ผู้เข้าแข่งขันต้องรักษาความสุภาพ ไม่ใช้ถ้อยคำหยาบคายในพื้นที่ส่วนกลาง</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 transition-shadow"
        >
          <div className="flex items-start gap-5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-3">3. นโยบายการชำระเงินและคืนเงิน</h3>
              <ul className="space-y-3 text-slate-600 font-medium list-disc pl-5">
                <li>เมื่อชำระค่าสมัครและยืนยันสิทธิ์แล้ว ไม่สามารถขอคืนเงินได้ในทุกกรณี</li>
                <li>ยกเว้นกรณีที่รายการแข่งขันถูกยกเลิกโดยผู้จัด ระบบจะดำเนินการคืนเงินให้ภายใน 7-14 วัน</li>
                <li>การแนบสลิปปลอมจะถูกแบนจากระบบและดำเนินคดีตามกฎหมาย</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.p 
        variants={itemVariants}
        className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest"
      >
        อัปเดตล่าสุดเมื่อวันที่ 25 มกราคม 2026
      </motion.p>
    </motion.div>
  );
}