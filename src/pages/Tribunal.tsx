import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Gavel, 
  History,
  Check,
  Star,
  Medal,
  Crown,
  Lock,
  Zap,
  Sunrise,
  Coins
} from 'lucide-react';
import { cn } from '../lib/utils';

// ... (Infractions data remains same)
const infractions = [
  { id: 1, title: '玩手机超时', date: '2026-02-05', cost: -50, reason: '约定1小时，实际使用1.5小时', repeatCount: 3, status: 'appealing', appealMsg: '我看错时间了，下次一定注意...' },
  { id: 2, title: '作业字迹潦草', date: '2026-02-03', cost: -20, reason: '英语抄写像鬼画符', repeatCount: 1, status: 'closed' },
];

// Expanded Achievements
const achievements = [
  // Combat (Tasks)
  { id: 'c1', category: 'combat', title: '百战老兵', desc: '累计完成 100 个任务', icon: <Swords className="w-6 h-6" />, progress: 82, target: 100, unlocked: false },
  { id: 'c2', category: 'combat', title: '任务狂人', desc: '单日完成 10 个任务', icon: <Zap className="w-6 h-6" />, progress: 8, target: 10, unlocked: false },
  // Focus (Zen)
  { id: 'z1', category: 'zen', title: '入定大师', desc: '单次专注超过 90 分钟', icon: <Zap className="w-6 h-6" />, progress: 45, target: 90, unlocked: false },
  { id: 'z2', category: 'zen', title: '心流掌控者', desc: '累计专注 100 小时', icon: <History className="w-6 h-6" />, progress: 42, target: 100, unlocked: false },
  // Diligence
  { id: 'd1', category: 'diligence', title: '破晓者', desc: '早晨 6:00 前打卡', icon: <Sunrise className="w-6 h-6" />, progress: 1, target: 1, unlocked: true, date: '2026-02-02' },
  { id: 'd2', category: 'diligence', title: '全勤标兵', desc: '连续 30 天无缺席', icon: <CalendarCheck className="w-6 h-6" />, progress: 12, target: 30, unlocked: false },
  // Wealth
  { id: 'w1', category: 'wealth', title: '星际富豪', desc: '累计赚取 10,000 星币', icon: <Coins className="w-6 h-6" />, progress: 3500, target: 10000, unlocked: false },
];

function Swords({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>; }
function CalendarCheck({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>; }

export function Tribunal() {
  const [activeTab, setActiveTab] = useState<'infractions' | 'glory'>('glory'); // Default to glory for demo

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            {activeTab === 'infractions' ? (
              <span className="text-red-400 flex items-center gap-2"><Gavel className="w-8 h-8" /> 罪与罚 Tribunal</span>
            ) : (
              <span className="text-neon-yellow flex items-center gap-2"><Crown className="w-8 h-8" /> 荣耀殿堂 Hall of Fame</span>
            )}
          </h2>
          {/* ... tabs ... */}
        </div>
        
        <div className="flex bg-space-900 rounded-lg p-1 border border-space-800">
          <button
            onClick={() => setActiveTab('infractions')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === 'infractions' ? "bg-red-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            过失记录
          </button>
          <button
            onClick={() => setActiveTab('glory')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === 'glory' ? "bg-neon-yellow text-space-950 shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <Medal className="w-4 h-4" />
            成就系统
          </button>
        </div>
      </div>

      {activeTab === 'infractions' ? <InfractionsList /> : <GloryHall />}
    </div>
  );
}

function InfractionsList() {
  // ... (Same as before)
  return (
    <div className="space-y-4">
        {infractions.map((item) => (
          <motion.div 
            key={item.id}
            className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6"
          >
             {/* ... simplified for brevity, assume previous code ... */}
             <div className="flex-1">
               <h3 className="text-xl font-bold text-white">{item.title}</h3>
               <p className="text-slate-400">{item.reason}</p>
             </div>
             <div className="text-3xl font-mono font-bold text-red-500">{item.cost}</div>
          </motion.div>
        ))}
    </div>
  );
}

function GloryHall() {
  const currentLvl = 12;
  const currentExp = 3200;
  const nextLvlExp = 5000;
  const progress = (currentExp / nextLvlExp) * 100;

  return (
    <div className="space-y-8">
      {/* Rank Card */}
      <div className="bg-gradient-to-r from-space-900 to-space-800 rounded-2xl p-8 border border-neon-yellow/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Crown className="w-64 h-64 text-neon-yellow" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 rounded-full bg-space-950 border-4 border-neon-yellow flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.3)]">
            <span className="text-6xl">🦁</span>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-3xl font-bold text-white">上校 Colonel</h3>
                <p className="text-neon-yellow font-mono">LV.{currentLvl}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">下一军衔：元帅</div>
                <div className="text-xs text-slate-500">还需 1,800 EXP</div>
              </div>
            </div>
            
            <div className="h-4 bg-space-950 rounded-full overflow-hidden border border-space-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-neon-yellow to-orange-500"
              />
            </div>
            
            <div className="mt-4 flex gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-neon-green" />
                解锁：自定义头像框
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-neon-green" />
                解锁：周末请假券
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <Lock className="w-4 h-4" />
                Lv.50 解锁：神秘大奖
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-purple" />
          无尽成就墙 Infinity Wall
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              whileHover={{ y: -5 }}
              className={cn(
                "p-4 rounded-xl border relative overflow-hidden group",
                ach.unlocked 
                  ? "bg-space-900/80 border-neon-yellow/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                  : "bg-space-900/30 border-space-800 opacity-70 grayscale"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  ach.unlocked ? "bg-neon-yellow/20 text-neon-yellow" : "bg-space-800 text-slate-500"
                )}>
                  {ach.icon}
                </div>
                {ach.unlocked && <Star className="w-4 h-4 text-neon-yellow fill-neon-yellow" />}
              </div>
              
              <h4 className="font-bold text-white mb-1">{ach.title}</h4>
              <p className="text-xs text-slate-400 mb-3">{ach.desc}</p>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-space-950 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", ach.unlocked ? "bg-neon-yellow" : "bg-slate-600")} 
                  style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-right text-slate-500 mt-1">
                {ach.progress} / {ach.target}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
}
