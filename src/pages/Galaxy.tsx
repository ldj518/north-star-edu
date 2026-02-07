import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Lock, CheckCircle2, ChevronRight, Zap, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Knowledge Graph
const constellations = [
  {
    id: 'math-geo',
    name: '几何星域',
    color: 'text-blue-400',
    stars: [
      { id: 'm1', x: 20, y: 30, name: '勾股定理', status: 'mastered', level: 5 },
      { id: 'm2', x: 40, y: 20, name: '全等三角形', status: 'mastered', level: 4 },
      { id: 'm3', x: 60, y: 40, name: '平行四边形', status: 'in-progress', level: 2 },
      { id: 'm4', x: 80, y: 30, name: '圆的性质', status: 'locked', level: 0 },
    ],
    connections: [['m1', 'm2'], ['m2', 'm3'], ['m3', 'm4']]
  },
  {
    id: 'eng-vocab',
    name: '词汇星云',
    color: 'text-purple-400',
    stars: [
      { id: 'e1', x: 30, y: 70, name: 'Unit 1 核心词', status: 'mastered', level: 5 },
      { id: 'e2', x: 50, y: 80, name: 'Unit 2 核心词', status: 'in-progress', level: 3 },
      { id: 'e3', x: 70, y: 65, name: '过去式变位', status: 'locked', level: 0 },
    ],
    connections: [['e1', 'e2'], ['e2', 'e3']]
  }
];

export function Galaxy() {
  const [selectedStar, setSelectedStar] = useState<any>(null);

  return (
    <div className="min-h-full relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?w=1600&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-space-950/80 backdrop-blur-sm" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-yellow" />
              知识星图 Galaxy
            </h2>
            <p className="text-slate-300">点亮每一颗星辰，征服未知的知识疆域。</p>
          </div>
          <div className="bg-space-900/80 px-4 py-2 rounded-full border border-space-700 text-sm flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_10px_#22c55e]" />
               <span className="text-slate-300">已掌握</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_10px_#3b82f6]" />
               <span className="text-slate-300">探索中</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-600" />
               <span className="text-slate-500">未解锁</span>
             </div>
          </div>
        </div>

        {/* Star Map Area */}
        <div className="flex-1 relative rounded-3xl border border-white/10 bg-space-950/50 backdrop-blur-md overflow-hidden min-h-[500px]">
          {constellations.map(c => (
            <div key={c.id} className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full absolute inset-0">
                {c.connections.map(([start, end], i) => {
                  const s = c.stars.find(star => star.id === start)!;
                  const e = c.stars.find(star => star.id === end)!;
                  return (
                    <line 
                      key={i}
                      x1={`${s.x}%`} y1={`${s.y}%`}
                      x2={`${e.x}%`} y2={`${e.y}%`}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>
              
              {c.stars.map(star => (
                <motion.button
                  key={star.id}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedStar(star)}
                  className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all group"
                  style={{ left: `${star.x}%`, top: `${star.y}%` }}
                >
                  {/* Glow Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-full blur-lg opacity-50 transition-opacity group-hover:opacity-100",
                    star.status === 'mastered' ? "bg-neon-green" :
                    star.status === 'in-progress' ? "bg-neon-blue" : "bg-transparent"
                  )} />
                  
                  {/* Star Icon */}
                  <div className={cn(
                    "w-full h-full rounded-full border-2 flex items-center justify-center bg-space-900 relative z-10",
                    star.status === 'mastered' ? "border-neon-green text-neon-green shadow-[0_0_15px_rgba(34,197,94,0.5)]" :
                    star.status === 'in-progress' ? "border-neon-blue text-neon-blue animate-pulse-slow shadow-[0_0_15px_rgba(59,130,246,0.5)]" :
                    "border-slate-700 text-slate-700 bg-space-950"
                  )}>
                    {star.status === 'locked' ? <Lock className="w-4 h-4" /> : <Star className="w-5 h-5 fill-current" />}
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-14 whitespace-nowrap px-2 py-1 bg-black/50 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
                    {star.name}
                  </div>
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-space-900/95 backdrop-blur-xl border-l border-space-700 shadow-2xl z-50 p-6 overflow-y-auto"
          >
             <button onClick={() => setSelectedStar(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
               <X className="w-6 h-6" />
             </button>

             <div className="mt-8 flex flex-col items-center mb-8">
               <div className={cn(
                 "w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4",
                 selectedStar.status === 'mastered' ? "border-neon-green bg-neon-green/10 text-neon-green" :
                 selectedStar.status === 'in-progress' ? "border-neon-blue bg-neon-blue/10 text-neon-blue" :
                 "border-slate-700 bg-space-950 text-slate-500"
               )}>
                 <Star className={cn("w-10 h-10", selectedStar.status !== 'locked' && "fill-current")} />
               </div>
               <h3 className="text-2xl font-bold text-white text-center">{selectedStar.name}</h3>
               <div className={cn(
                 "mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                 selectedStar.status === 'mastered' ? "bg-neon-green/20 text-neon-green" :
                 selectedStar.status === 'in-progress' ? "bg-neon-blue/20 text-neon-blue" :
                 "bg-slate-800 text-slate-500"
               )}>
                 {selectedStar.status.replace('-', ' ')}
               </div>
             </div>

             <div className="space-y-6">
               <div className="bg-space-950/50 p-4 rounded-xl border border-space-800">
                 <h4 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-neon-yellow" /> 熟练度等级 (Mastery)
                 </h4>
                 <div className="flex gap-1">
                   {[1,2,3,4,5].map(lvl => (
                     <div key={lvl} className={cn(
                       "h-2 flex-1 rounded-full",
                       lvl <= selectedStar.level ? "bg-neon-yellow" : "bg-space-800"
                     )} />
                   ))}
                 </div>
                 <p className="text-right text-xs text-slate-500 mt-2">{selectedStar.level}/5 Level</p>
               </div>

               <div>
                 <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                   <BookOpen className="w-4 h-4" /> 关联任务
                 </h4>
                 <div className="space-y-3">
                   {selectedStar.status === 'locked' ? (
                     <div className="text-center py-8 text-slate-500 border border-dashed border-space-800 rounded-xl">
                       <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                       请先解锁前置知识点
                     </div>
                   ) : (
                     <>
                       <button className="w-full bg-space-800 hover:bg-space-700 p-4 rounded-xl text-left transition-colors flex justify-between group">
                         <div>
                           <div className="font-bold text-slate-200">专项练习：{selectedStar.name}基础</div>
                           <div className="text-xs text-slate-500 mt-1">预计 15分钟 • +30 🪙</div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
                       </button>
                       <button className="w-full bg-space-800 hover:bg-space-700 p-4 rounded-xl text-left transition-colors flex justify-between group">
                         <div>
                           <div className="font-bold text-slate-200">挑战：错题重组</div>
                           <div className="text-xs text-slate-500 mt-1">预计 20分钟 • +50 🪙</div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
                       </button>
                     </>
                   )}
                 </div>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 5h4"/><path d="M18.882 9.254l-5.813-1.912a2 2 0 0 0-1.275-1.275L9.882 0.254"/></svg>
  );
}
