import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Gift, Lock, Moon, Sun, Send, StickyNote, Plus, Trash2, Save } from 'lucide-react';

export function Strategy() {
  const [curfewStart, setCurfewStart] = useState('22:00');
  const [curfewEnd, setCurfewEnd] = useState('06:00');
  const [message, setMessage] = useState('');
  
  const [goals, setGoals] = useState([
    { id: 1, title: '期末英语突击', target: '90分', current: '82分', progress: 60, reward: 'Switch 游戏任选一款', deadline: '2026-06-30' },
    { id: 2, title: '体能达标', target: '跳绳 180个/分', current: '140个/分', progress: 45, reward: '新球鞋一双', deadline: '2026-05-01' },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Long-term Goals */}
        <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-neon-purple" />
              战略悬赏令 (OKRs)
            </h3>
            <button className="text-xs bg-space-800 hover:bg-space-700 px-3 py-1.5 rounded-lg text-slate-300 border border-space-700 transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> 新增目标
            </button>
          </div>

          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-space-800/50 border border-space-700 rounded-xl p-4 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                    <div className="font-bold text-white text-lg">{goal.title}</div>
                    <div className="text-xs text-slate-400 mt-1">Deadline: {goal.deadline}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-neon-blue">{goal.current} <span className="text-slate-500">/ {goal.target}</span></div>
                  </div>
                </div>

                <div className="h-2 bg-space-950 rounded-full overflow-hidden mb-3 relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-neon-yellow bg-neon-yellow/10 px-3 py-2 rounded-lg border border-neon-yellow/20 relative z-10">
                  <Gift className="w-3 h-3" />
                  <span className="font-bold">悬赏:</span> {goal.reward}
                </div>
                
                {/* Decoration */}
                <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-space-700/50 rotate-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* 2. Curfew System */}
          <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              数字宵禁 (Digital Curfew)
            </h3>
            
            <div className="bg-space-950 rounded-xl p-6 border border-space-800 flex items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Moon className="w-4 h-4" /> 休眠时间 (Start)
                </div>
                <input 
                  type="time" 
                  value={curfewStart}
                  onChange={(e) => setCurfewStart(e.target.value)}
                  className="w-full bg-space-800 border border-space-700 rounded-lg p-3 text-white font-mono text-xl focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="text-slate-600">to</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Sun className="w-4 h-4" /> 唤醒时间 (End)
                </div>
                <input 
                  type="time" 
                  value={curfewEnd}
                  onChange={(e) => setCurfewEnd(e.target.value)}
                  className="w-full bg-space-800 border border-space-700 rounded-lg p-3 text-white font-mono text-xl focus:outline-none focus:border-neon-green"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
              <Lock className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">生效中：</span> 在此时段内，学生端将强制进入「深空休眠模式」，无法领取任务或兑换奖励。仅保留「紧急呼叫」功能。
              </div>
            </div>
          </div>

          {/* 3. Bridge Comms */}
          <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-neon-green" />
              舰桥通讯 (Sticky Note)
            </h3>
            
            <div className="relative">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="给领航员写一张全息便利贴... 
例如：今天辛苦了，桌上有切好的水果 🍎"
                className="w-full h-32 bg-space-950 border border-space-700 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-neon-green mb-4"
              />
              <button 
                onClick={() => { setMessage(''); alert('消息已发送至战况室'); }}
                className="absolute bottom-6 right-2 p-2 bg-neon-green text-space-950 rounded-lg hover:bg-neon-green/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              {['早点睡 💤', '为你骄傲 👍', '记得喝水 💧'].map(preset => (
                <button 
                  key={preset}
                  onClick={() => setMessage(preset)}
                  className="px-3 py-1.5 bg-space-800 hover:bg-space-700 rounded-lg text-xs text-slate-300 border border-space-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
