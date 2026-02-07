import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BookOpen, 
  Users, 
  Target,
  Crown,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';

// Mock Data: Recent Exams
const exams = [
  { id: 1, name: '期末考试', date: '2026-01-20', rank: 33, total: 47, score: 380 },
  { id: 2, name: '期中考试', date: '2025-11-15', rank: 38, total: 47, score: 365 },
  { id: 3, name: '月考 (10月)', date: '2025-10-10', rank: 40, total: 47, score: 350 },
];

const subjects = [
  { name: '生物', score: 83, full: 100, prev: 78, rank: 5, status: 'up', comment: '绝对优势学科！保持住，你是生物课代表的料！🧬' },
  { name: '数学', score: 80, full: 120, prev: 75, rank: 12, status: 'up', comment: '逻辑思维在线，几何题全对！继续攻克代数！📐' },
  { name: '地理', score: 75, full: 100, prev: 76, rank: 18, status: 'stable', comment: '发挥稳定，地形图绘制很标准。🌍' },
  { name: '历史', score: 70, full: 100, prev: 65, rank: 22, status: 'up', comment: '记忆力提升明显，背诵任务没白做！📜' },
  { name: '语文', score: 82, full: 120, prev: 85, rank: 28, status: 'down', comment: '作文稍微跑题了，阅读理解要加强。📚' },
  { name: '政治', score: 48, full: 100, prev: 45, rank: 42, status: 'up', comment: '虽然没及格，但比上次多了3分！这就是进步！🚩' },
  { name: '英语', score: 40, full: 120, prev: 42, rank: 45, status: 'down', comment: '单词量是硬伤，每天多背10个，下学期逆袭！🔤' },
];

export function Academics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            学业档案 Academics
            <div className="px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-sm font-mono border border-neon-yellow/50 flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Class Rank: 33 / 47
            </div>
          </h2>
          <p className="text-slate-400">每一次考试都是升级的契机，而非审判。</p>
        </div>
      </div>

      {/* Rank Trend Chart */}
      <div className="bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-bl-full" />
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neon-blue" />
          排位晋升之路
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...exams].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} />
              <YAxis reversed domain={[1, 47]} stroke="#64748b" tick={{fill: '#94a3b8'}} label={{ value: '排名 (越低越好)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="rank" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">✨ 目标：下学期进入前 25 名！</p>
      </div>

      {/* Subject Cards Grid */}
      <h3 className="font-bold text-xl text-white mt-8 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-neon-purple" />
        学科战力分析 (期末考)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((sub, i) => (
          <motion.div
            key={sub.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative group bg-space-900/50 backdrop-blur-sm border rounded-2xl p-6 transition-all hover:-translate-y-1 ${
              sub.score >= 80 ? 'border-neon-green/30 hover:border-neon-green' : 
              sub.score < 60 ? 'border-red-500/30 hover:border-red-500' : 
              'border-space-800 hover:border-neon-blue'
            }`}
          >
            {/* Trend Indicator */}
            <div className="absolute top-4 right-4">
              {sub.status === 'up' && (
                <div className="flex items-center gap-1 text-neon-green bg-neon-green/10 px-2 py-1 rounded text-xs font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +{sub.score - sub.prev}
                </div>
              )}
              {sub.status === 'down' && (
                <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs font-bold">
                  <TrendingDown className="w-3 h-3" />
                  {sub.score - sub.prev}
                </div>
              )}
              {sub.status === 'stable' && (
                <div className="flex items-center gap-1 text-slate-400 bg-space-800 px-2 py-1 rounded text-xs font-bold">
                  <Minus className="w-3 h-3" />
                  -
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-slate-400 text-sm font-medium mb-1">{sub.name}</h4>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold font-mono ${
                  sub.score >= 80 ? 'text-neon-green' : 
                  sub.score < 60 ? 'text-red-500' : 
                  'text-white'
                }`}>
                  {sub.score}
                </span>
                <span className="text-xs text-slate-500">/ {sub.full}</span>
              </div>
            </div>

            {/* Rank Bar */}
            <div className="mb-4">
               <div className="flex justify-between text-xs text-slate-500 mb-1">
                 <span>班级排名</span>
                 <span>Top {Math.round((sub.rank / 47) * 100)}%</span>
               </div>
               <div className="h-1.5 w-full bg-space-800 rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full ${
                     sub.rank <= 10 ? 'bg-neon-yellow' : 
                     sub.rank <= 25 ? 'bg-neon-blue' : 
                     'bg-slate-600'
                   }`} 
                   style={{ width: `${(1 - sub.rank/47) * 100}%` }}
                 />
               </div>
            </div>

            {/* AI Comment */}
            <div className="bg-space-800/50 rounded-lg p-3 text-xs leading-relaxed text-slate-300 border border-space-700/50 flex gap-2">
              <Sparkles className="w-4 h-4 text-neon-yellow shrink-0 mt-0.5" />
              {sub.comment}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
