import { motion } from "framer-motion";

export default function BracketView({ matches }) {
  // matches คือ array ของคู่แข่งขัน เช่น [{round: 1, p1: 'Team A', p2: 'Team B', winner: null}, ...]

  const renderRound = (roundNumber) => {
    const roundMatches = matches.filter(m => m.round === roundNumber);
    return (
      <div className="flex flex-col justify-around gap-8 min-w-[250px]">
        <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
          Round {roundNumber}
        </h3>
        {roundMatches.map((match, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={idx} 
            className="relative"
          >
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex flex-col w-full">
              <div className={`p-3 text-sm font-bold border-b border-slate-50 flex justify-between ${match.winner === match.p1 ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}>
                <span>{match.p1 || 'TBD'}</span>
                {match.winner === match.p1 && <span>🏆</span>}
              </div>
              <div className={`p-3 text-sm font-bold flex justify-between ${match.winner === match.p2 ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}>
                <span>{match.p2 || 'TBD'}</span>
                {match.winner === match.p2 && <span>🏆</span>}
              </div>
            </div>
            {/* เส้นเชื่อม (Connector) */}
            <div className="absolute -right-4 top-1/2 w-4 h-[1px] bg-slate-200"></div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex gap-8 p-8 overflow-x-auto bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
      {renderRound(1)}
      {renderRound(2)}
      {/* เพิ่ม Round ต่อๆ ไปตามจำนวนผู้แข่ง */}
    </div>
  );
}