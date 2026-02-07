import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Skull, Calendar, Target } from 'lucide-react';
import { useStore } from '../store/useStore';

export function BossBattleCard() {
  // Mock Boss Data
  const boss = {
    name: "Mid-Term Exam Beast",
    totalHp: 500, // Total tasks/points needed
    currentHp: 280,
    deadline: "2026-04-15",
    daysLeft: 68
  };
  
  const hpPercent = (boss.currentHp / boss.totalHp) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-red-950/50 to-space-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Background Monster Texture */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
        <Skull className="w-48 h-48 text-red-500" />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/50">
             <Sword className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-red-100 text-lg uppercase tracking-wider">BOSS: 期中考巨兽</h3>
            <div className="flex items-center gap-2 text-xs text-red-300">
               <Calendar className="w-3 h-3" />
               <span>决战倒计时: <span className="font-bold text-white text-sm">{boss.daysLeft} 天</span></span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1 bg-red-500/10 rounded border border-red-500/20 text-xs text-red-400 font-bold">
          LEVEL 35
        </div>
      </div>

      {/* HP Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs mb-1 font-bold">
          <span className="text-red-400">BOSS HP</span>
          <span className="text-white">{boss.currentHp} / {boss.totalHp}</span>
        </div>
        <div className="h-6 bg-space-950 rounded-full border border-red-900/50 overflow-hidden relative shadow-inner">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-600 to-red-500 relative"
          >
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 right-0 h-[50%] bg-white/20" />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-400/50 animate-pulse" />
          </motion.div>
        </div>
        <p className="text-xs text-red-300/60 mt-2 italic text-right">
          "完成今日作业可对 BOSS 造成 50 点暴击伤害！"
        </p>
      </div>

      {/* Attack Button */}
      <div className="mt-6 flex gap-3 relative z-10">
         <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2">
           <Sword className="w-4 h-4" /> 发起进攻 (做题)
         </button>
         <button className="px-4 py-2 bg-space-800 hover:bg-space-700 rounded-lg text-slate-300 text-sm font-medium border border-space-700">
           查看弱点
         </button>
      </div>
    </motion.div>
  );
}
