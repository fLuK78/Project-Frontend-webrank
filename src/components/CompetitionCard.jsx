import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { card } from "../animations/motion";
import { Calendar, Gamepad2, Coins, MapPin, ChevronRight } from "lucide-react"; 

export default function CompetitionCard({ competition, userId }) {
  const booked = competition.participants_count ?? (competition.Participants?.length) ?? 0;
  const max = competition.maxPlayer ?? 1;
  const isFull = booked >= max;
  const isJoined = competition.Participants?.some(p => p.id === userId) || competition.isJoined;
  
  const displayImage = competition.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800";

  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link to={`/competitions/${competition.id}`} className="block">
        <div className="relative overflow-hidden border border-slate-100 rounded-[2.5rem] bg-white transition-all flex flex-col h-full group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]">
          
          <div className="relative h-64 overflow-hidden bg-slate-100">
            <img 
              src={displayImage} 
              alt={competition.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute top-5 left-5">
              <div className={`backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${
                isJoined
                ? "bg-emerald-500/90 border-emerald-400 text-white" 
                : isFull 
                  ? "bg-rose-500/90 border-rose-400 text-white" 
                  : "bg-white/90 border-white text-slate-900"
              }`}>
                {isJoined ? "✓ Registered" : isFull ? "Full House" : "Open Now"}
              </div>
            </div>

            {competition.prize && (
              <div className="absolute top-5 right-5 bg-amber-400 px-4 py-2 rounded-2xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                <div className="flex items-center gap-1.5 text-slate-900 font-black text-xs">
                  <Coins size={14} />
                  {competition.prize}
                </div>
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin size={14} className="text-blue-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{competition.location || "Online Arena"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-grow relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Gamepad2 size={16} className="text-blue-600 group-hover:text-white" />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">
                {competition.gameType || "eSports Event"}
              </span>
            </div>
            
            <h2 className="font-bold text-2xl text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">
              {competition.name}
            </h2>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-500">
                <Calendar size={18} className="text-blue-500" />
                <span className="text-sm font-bold text-slate-600">
                  {competition.date ? new Date(competition.date).toLocaleDateString("th-TH", { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  }) : "TBD"}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                View Detail <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}