import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, CheckCircle, Share2, Download, X } from 'lucide-react';
import { cn } from '../lib/utils';

const mistakes = [
  { id: 1, subject: 'English', topic: '一般现在时', content: 'He ___ (go) to school everyday.', wrong: 'go', right: 'goes', nextReview: 'Today', streak: 0, image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80' },
  { id: 2, subject: 'Math', topic: '几何面积', content: 'Triangle Area Calculation', wrong: '30', right: '15', nextReview: 'Tomorrow', streak: 1, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80' },
  { id: 3, subject: 'Physics', topic: '密度公式', content: 'ρ = m / V', wrong: 'm * V', right: 'm / V', nextReview: 'Today', streak: 2, image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80' },
];

export function Nexus() {
  const [selectedMistake, setSelectedMistake] = useState<any>(null);
  const [showGazette, setShowGazette] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-neon-purple" />
            错题枢纽 The Nexus
          </h2>
          <p className="text-slate-400">错误是通向真理的阶梯。消灭它们，转化为智慧。</p>
        </div>
        <button 
          onClick={() => setShowGazette(true)}
          className="bg-space-800 hover:bg-space-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-space-700"
        >
          <Share2 className="w-4 h-4" /> 生成周报
        </button>
      </div>

      {/* Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-neon-green" /> 今日复习任务
              </h3>
              <span className="text-xs text-slate-500">根据记忆曲线生成</span>
            </div>

            <div className="space-y-4">
              {mistakes.filter(m => m.nextReview === 'Today').map(mistake => (
                <motion.div 
                  key={mistake.id}
                  layoutId={`mistake-${mistake.id}`}
                  onClick={() => setSelectedMistake(mistake)}
                  className="bg-space-800 p-4 rounded-xl border border-space-700 cursor-pointer hover:border-neon-purple transition-all group relative overflow-hidden"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-space-900 rounded-lg shrink-0 overflow-hidden">
                      <img src={mistake.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Problem" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded border border-neon-purple/20">
                          {mistake.subject} • {mistake.topic}
                        </span>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className={cn(
                              "w-2 h-2 rounded-full",
                              i < mistake.streak ? "bg-neon-green" : "bg-space-600"
                            )} />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-200 mb-2 line-clamp-1">{mistake.content}</h4>
                      <p className="text-xs text-slate-500">
                        点击查看详情并进行自我检测。
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-space-900 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="font-bold text-white mb-4">错题粉碎机</h3>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-white mb-2">128</div>
              <div className="text-sm text-purple-300">历史消灭错题数</div>
            </div>
            <div className="bg-space-950/50 rounded-xl p-4 text-xs text-slate-400 leading-relaxed border border-space-800">
              每消灭一道错题（连续答对3次），将永久获得 <span className="text-neon-yellow font-bold">+10 荣耀积分</span>。
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMistake && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div 
              layoutId={`mistake-${selectedMistake.id}`}
              className="bg-space-900 w-full max-w-2xl rounded-2xl border border-space-700 overflow-hidden relative"
            >
              <button onClick={() => setSelectedMistake(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-white/20 transition-colors z-10">
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="grid grid-cols-2 h-[500px]">
                <div className="bg-black relative">
                  <img src={selectedMistake.image} className="w-full h-full object-contain" alt="Problem" />
                </div>
                <div className="p-8 flex flex-col">
                  <div className="mb-auto">
                    <div className="text-xs text-neon-purple font-bold uppercase tracking-wider mb-2">Review Mode</div>
                    <h3 className="text-2xl font-bold text-white mb-4">{selectedMistake.content}</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="text-xs text-red-400 font-bold mb-1">你的错误答案</div>
                        <div className="text-lg text-white font-mono">{selectedMistake.wrong}</div>
                      </div>
                      
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl relative group">
                        <div className="absolute inset-0 bg-space-800 flex items-center justify-center rounded-xl group-hover:opacity-0 transition-opacity cursor-pointer">
                          <span className="text-sm text-slate-400">按住查看正确答案</span>
                        </div>
                        <div className="text-xs text-green-400 font-bold mb-1">正确答案</div>
                        <div className="text-lg text-white font-mono">{selectedMistake.right}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button className="py-3 rounded-xl bg-space-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 font-bold transition-colors">
                      还是不会
                    </button>
                    <button className="py-3 rounded-xl bg-neon-green hover:bg-neon-green/90 text-space-950 font-bold transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      我学会了 (+1 Streak)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Gazette Modal */}
      <AnimatePresence>
        {showGazette && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
          >
            <div className="bg-white text-space-950 w-full max-w-md h-full rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto relative">
              <button onClick={() => setShowGazette(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
              
              {/* Gazette Content */}
              <div className="p-8">
                <div className="text-center border-b-2 border-space-950 pb-6 mb-6">
                  <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">The Weekly Star</h1>
                  <p className="text-sm font-serif italic text-slate-600">Vol. 24 • Feb 06, 2026</p>
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-space-950 rounded-full mx-auto mb-4 overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">路则昊本周战报</h2>
                    <p className="text-slate-600">"不可阻挡的上升势头！"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <div className="text-3xl font-black text-neon-blue">15</div>
                      <div className="text-xs uppercase font-bold text-slate-500">Tasks Crushed</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <div className="text-3xl font-black text-neon-purple">8.5h</div>
                      <div className="text-xs uppercase font-bold text-slate-500">Focus Time</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2 border-b border-space-950 pb-1">Hightlights</h3>
                    <ul className="list-disc pl-5 space-y-2 font-serif">
                      <li>击败了 <strong>Unit 1 单词</strong> 副本，准确率 98%。</li>
                      <li>在 <strong>几何战场</strong> 获得三连胜。</li>
                      <li>成功抵御了 3 次"手机诱惑"，获得【自律铁壁】勋章。</li>
                    </ul>
                  </div>

                  <div className="bg-black text-white p-6 rounded-xl text-center">
                    <div className="text-xs uppercase tracking-widest mb-2 text-neon-yellow">Next Goal</div>
                    <div className="font-bold text-xl">攻克 "二元一次方程组"</div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button className="flex-1 py-3 bg-neon-green text-space-950 font-bold rounded-xl flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> 分享到微信
                  </button>
                  <button className="flex-1 py-3 bg-slate-100 text-space-950 font-bold rounded-xl flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> 保存图片
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
